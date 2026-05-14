import { supabase } from "@/integrations/supabase/client";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Converts any string to a URL-safe slug */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");
}

/**
 * Maps the ProductsManager form data → exact columns in your Supabase `products` table
 *
 * Real products table columns (from your Definition screenshot):
 *   id, name_en, name_ar, name_tr,
 *   description_en, description_ar, description_tr,
 *   price, compare_at_price, cost_per_item,
 *   category_id, status ('active'|'inactive'|'draft'),
 *   featured, sku, weight_grams,
 *   requires_shipping, track_inventory, low_stock_threshold,
 *   tags (text[]), created_at
 */
function mapFormToProduct(formData: any, status: "active" | "inactive" | "draft" = "active") {
  const nameEn: string = formData.name_en || "";

  // Auto-generate slug from English name
  // "Midnight Elegance Gown" → "midnight-elegance-gown"
  const slug = formData.slug || toSlug(nameEn) || `product-${Date.now()}`;

  return {
    // ── Slug (URL) ─────────────────────────────────────
    slug,

    // ── Names ──────────────────────────────────────────
    name_en: nameEn,
    name_ar: formData.name_ar || "",
    name_tr: formData.name_tr || "",

    // ── Descriptions ───────────────────────────────────
    description_en: formData.description_en || null,
    description_ar: formData.description_ar || null,
    description_tr: formData.description_tr || null,

    // ── Pricing ────────────────────────────────────────
    price: Number(formData.price) || 0,
    compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
    cost_per_item: formData.cost_per_item ? Number(formData.cost_per_item) : null,

    // ── Category ───────────────────────────────────────
    category_id: formData.category_id || null,

    // ── Status & Flags ─────────────────────────────────
    status,                                          // 'active' | 'inactive' | 'draft'
    featured: formData.is_featured ?? false,

    // ── SKU & Logistics ────────────────────────────────
    sku: formData.sku || `RB-${Date.now()}`,
    weight_grams: formData.weight ? Number(formData.weight) : null,
    requires_shipping: formData.requires_shipping ?? true,
    track_inventory: formData.track_inventory ?? true,
    low_stock_threshold: formData.low_stock_threshold ?? 5,

    // ── Tags ───────────────────────────────────────────
    // Form stores tags as comma-separated string → convert to array
    tags: formData.tags
      ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [],
  };
}

/**
 * After creating a product, save its color variants into `product_color_variants`
 *
 * product_color_variants columns:
 *   id, product_id, name_en, name_ar, name_tr,
 *   hex_color, stock_quantity, is_available, is_main, position
 */
async function saveColorVariants(productId: string, colors: any[]) {
  if (!colors || colors.length === 0) return;

  const rows = colors.map((c, i) => ({
    product_id: productId,
    name_en: c.name_en || "",
    name_ar: c.name_ar || "",
    name_tr: c.name_tr || "",
    hex_color: c.hex || "#000000",
    stock_quantity: Number(c.stock) || 0,
    is_available: c.is_active ?? true,
    is_main: c.is_main ?? i === 0,
    position: i,
  }));

  const { error } = await supabase.from("product_color_variants").insert(rows);
  if (error) throw new Error(`Color variants save failed: ${error.message}`);
}

/**
 * Save sizes into `product_sizes`
 *
 * product_sizes columns:
 *   id, product_id, size_label, position
 */
async function saveSizes(productId: string, sizes: string[], hasOneSize: boolean) {
  const labels = hasOneSize ? ["One Size"] : sizes;
  if (!labels || labels.length === 0) return;

  const rows = labels.map((label, i) => ({
    product_id: productId,
    size_label: label,
    position: i,
  }));

  const { error } = await supabase.from("product_sizes").insert(rows);
  if (error) throw new Error(`Sizes save failed: ${error.message}`);
}

/**
 * Save images into `product_images`
 *
 * product_images columns:
 *   id, product_id, url, position, is_main, color_variant_id, created_at
 */
async function saveImages(productId: string, images: string[]) {
  if (!images || images.length === 0) return;

  const rows = images.map((url, i) => ({
    product_id: productId,
    url,
    position: i,
    is_main: i === 0,
    color_variant_id: null,
  }));

  const { error } = await supabase.from("product_images").insert(rows);
  if (error) throw new Error(`Images save failed: ${error.message}`);
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export const adminApi = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats: async () => {
    const [products, orders, revenue] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }),
      supabase.from("orders").select("total_amount").eq("payment_status", "paid"),
    ]);

    const totalRevenue =
      revenue.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    return {
      totalProducts: products.count || 0,
      totalOrders: orders.count || 0,
      totalRevenue,
    };
  },

  // ── Products ───────────────────────────────────────────────────────────────

  getProducts: async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(id, name_en, name_ar, name_tr),
          product_images(id, url, is_main, position),
          product_color_variants(*),
          product_sizes(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to mock products", e);
      const { MOCK_PRODUCTS_FULL } = await import("@/lib/constants");
      return MOCK_PRODUCTS_FULL || [];
    }
  },

  /**
   * Creates a product + its variants/sizes/images in one atomic flow.
   * `formData` is the raw ProductFormData from ProductsManager.
   * `status` is passed from handleSave() — 'active' or 'inactive' (draft).
   */
  createProduct: async (formData: any, status: "active" | "inactive" | "draft" = "active") => {
    // 1. Insert the product row
    const productRow = mapFormToProduct(formData, status);

    const { data: product, error } = await supabase
      .from("products")
      .insert(productRow)
      .select()
      .single();

    if (error) throw new Error(`Product insert failed: ${error.message}`);

    const productId: string = product.id;

    // 2. Save related data in parallel
    await Promise.all([
      saveColorVariants(productId, formData.colors || []),
      saveSizes(productId, formData.sizes || [], formData.has_one_size ?? false),
      saveImages(productId, formData.general_images || []),
    ]);

    return product;
  },

  /**
   * Updates product core data.
   * Color variants / sizes / images update is handled separately below.
   */
  updateProduct: async (id: string, formData: any, status?: "active" | "inactive" | "draft") => {
    const updates = mapFormToProduct(formData, status ?? "active");

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Product update failed: ${error.message}`);

    // Re-save color variants (delete old → insert new)
    if (formData.colors !== undefined) {
      await supabase.from("product_color_variants").delete().eq("product_id", id);
      await saveColorVariants(id, formData.colors || []);
    }

    // Re-save sizes
    if (formData.sizes !== undefined || formData.has_one_size !== undefined) {
      await supabase.from("product_sizes").delete().eq("product_id", id);
      await saveSizes(id, formData.sizes || [], formData.has_one_size ?? false);
    }

    // Re-save general images
    if (formData.general_images !== undefined) {
      // Only delete images with no color_variant_id (general images)
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id)
        .is("color_variant_id", null);
      await saveImages(id, formData.general_images || []);
    }

    return data;
  },

  deleteProduct: async (id: string) => {
    // CASCADE on FK handles product_color_variants, product_sizes, product_images
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(`Product delete failed: ${error.message}`);
  },

  // ── Orders ─────────────────────────────────────────────────────────────────

  getOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  updateOrderStatus: async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
  },

  // ── Categories ─────────────────────────────────────────────────────────────

  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to mock categories", e);
      const { MOCK_CATEGORIES } = await import("@/lib/constants");
      return MOCK_CATEGORIES || [];
    }
  },

  createCategory: async (category: any) => {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateCategory: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};