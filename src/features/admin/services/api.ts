import { supabase } from "@/integrations/supabase/client";

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const [products, orders, users, revenue] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }),
      supabase.from("subscribers").select("id", { count: "exact" }),
      supabase
        .from("orders")
        .select("total_amount")
        .eq("payment_status", "paid"),
    ]);

    const totalRevenue =
      revenue.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    return {
      totalProducts: products.count || 0,
      totalOrders: orders.count || 0,
      totalUsers: users.count || 0,
      totalRevenue,
    };
  },

  // Products
  getProducts: async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories(id, name_en, name_ar, name_tr),
        product_images(id, url, is_main, position),
        product_color_variants(*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  createProduct: async (product: any) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateProduct: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  // Orders
  getOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  updateOrderStatus: async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },

  // Categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data || [];
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

  // Subscribers
  getSubscribers: async () => {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
