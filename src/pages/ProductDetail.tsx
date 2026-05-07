import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, localizedField } from "@/i18n/I18nContext";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { Ornament } from "@/components/Ornament";
import { productImg } from "@/lib/assets";
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronRight, Maximize2, Minus, Plus, Share2 } from "lucide-react";
import { useWishlist, wishlist } from "@/store/wishlist";
import { cart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MOCK_PRODUCTS } from "@/lib/constants";

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, locale, formatPrice } = useI18n();
  const [p, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);

  const wishlistItems = useWishlist();
  const isWishlisted = p ? wishlist.has(p.id) : false;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
        if (data) {
          setProduct(data);
          const { data: rel } = await supabase.from("products").select("*").eq("category_id", data.category_id).neq("id", data.id).limit(4);
          setRelated(rel as any || []);
        } else {
          // Fallback to mock
          const mock = MOCK_PRODUCTS.find(m => m.slug === slug);
          if (mock) {
            setProduct(mock);
            const rel = MOCK_PRODUCTS.filter(m => m.id !== mock.id).slice(0, 4);
            setRelated(rel);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error(t.product.size, { description: "Please select a size first." });
      return;
    }
    cart.add({
      productId: p.id,
      variantId: `${p.id}-${selectedSize}`,
      sku: p.sku,
      name: localizedField(p, "name", locale),
      variantLabel: `${t.product.size}: ${selectedSize}`,
      price: p.is_on_sale && p.sale_price ? p.sale_price : p.price,
      image: productImg(p.sku),
      quantity: qty,
    });
    toast.success(localizedField(p, "name", locale), { 
      description: "Added to selection",
      icon: <ShoppingBag className="h-4 w-4 text-primary" />
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current || !zoom) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    zoomRef.current.style.setProperty('--x', `${x}%`);
    zoomRef.current.style.setProperty('--y', `${y}%`);
  };

  if (loading) return (
    <div className="container-luxury py-20 flex justify-center items-center min-h-[60vh]">
      <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!p) return (
    <div className="container-luxury py-32 text-center">
      <h2 className="font-display text-4xl text-cream mb-6">{t.product.selectionNotFound}</h2>
      <p className="text-muted-foreground mb-10">{t.product.selectionNotFoundText}</p>
      <Link to="/shop" className="bg-primary text-primary-foreground px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-primary-glow transition-all">
        {t.product.backToCollections}
      </Link>
    </div>
  );

  const name = localizedField(p, "name", locale);
  const desc = localizedField(p, "description", locale);
  const sizes = ["36", "38", "40", "42", "44"]; // Mock sizes

  return (
    <div className="pb-20">
      <div className="container-luxury py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to="/shop" className="hover:text-primary transition-colors">{t.nav.shop}</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-primary font-medium truncate">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="lg:col-span-7">
            <div 
              ref={zoomRef}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
              className={cn(
                "relative aspect-[3/4] overflow-hidden bg-secondary group cursor-zoom-in border border-border/5",
                zoom && "cursor-zoom-out"
              )}
              style={{
                '--x': '50%',
                '--y': '50%'
              } as any}
            >
              <img
                src={productImg(p.sku)}
                alt={name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  zoom ? "scale-[2.5] origin-[var(--x)_var(--y)]" : "scale-100"
                )}
              />
              {!zoom && (
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-background/40 backdrop-blur-md px-3 py-1.5 text-[9px] uppercase tracking-widest text-cream opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-3 w-3" /> {t.product.zoom}
                </div>
              )}
              
              <button 
                onClick={(e) => { e.preventDefault(); wishlist.toggle(p); }}
                className="absolute top-6 right-6 p-3 rounded-full bg-background/60 backdrop-blur-md text-foreground/80 hover:text-primary transition-all border border-border/10 shadow-luxury z-10"
              >
                <Heart className={cn("h-5 w-5 transition-colors", isWishlisted && "fill-primary text-primary")} />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-[140px] lg:self-start">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 {p.is_new_arrival && (
                   <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary px-3 py-1 bg-primary/10 border border-primary/20">{t.common.new}</span>
                 )}
                 <span className="text-[10px] uppercase tracking-widest text-muted-foreground">SKU: {p.sku}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1]">{name}</h1>
              
              <div className="flex items-center gap-4 pt-2">
                {p.is_on_sale && p.sale_price ? (
                  <>
                    <span className="text-3xl md:text-4xl text-primary font-light">{formatPrice(p.sale_price)}</span>
                    <span className="text-xl text-muted-foreground line-through opacity-50">{formatPrice(p.price)}</span>
                  </>
                ) : (
                  <span className="text-3xl md:text-4xl text-primary font-light">{formatPrice(p.price)}</span>
                )}
              </div>
            </div>

            <div className="h-px bg-border/10 w-full" />

            {/* Sizes */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cream/90">{t.product.size}</span>
                <button className="text-[9px] uppercase tracking-[0.2em] text-primary hover:text-primary-glow underline underline-offset-4 transition-colors font-medium">
                  {t.product.sizeGuide}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border text-[11px] md:text-xs tracking-[0.1em] transition-all duration-300 font-medium",
                      selectedSize === s 
                        ? "border-primary bg-primary text-primary-foreground shadow-gold" 
                        : "border-border/20 text-foreground/60 hover:border-primary/40 hover:text-cream"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Quantity & Add to Cart - Fixed for Phone Screens */}
            <div className="flex items-center gap-3 pt-4 w-full">
              {/* Piece Counter - Smaller and fixed width on mobile */}
              <div className="flex items-center border border-border/20 h-14 bg-card/20 w-32 sm:w-[140px] shrink-0">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="flex-1 h-full flex items-center justify-center hover:text-primary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-cream tracking-tighter">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="flex-1 h-full flex items-center justify-center hover:text-primary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Add to Cart Button - Full width flexibility */}
              <button 
                onClick={handleAdd}
                className="flex-1 group relative h-14 bg-primary text-primary-foreground px-4 text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold overflow-hidden transition-all hover:shadow-gold flex items-center justify-center gap-2 md:gap-3"
              >
                <ShoppingBag className="h-4 w-4 relative z-10 shrink-0" />
                <span className="relative z-10 truncate">{t.product.addToCart}</span>
                <div className="absolute inset-0 bg-primary-glow translate-y-full transition-transform group-hover:translate-y-0 duration-500" />
              </button>
            </div>

            {/* Informational Blocks */}
            <div className="grid grid-cols-1 gap-6 pt-10 border-t border-border/5">
              {/* Shipping & Returns */}
              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 transition-colors group-hover:bg-primary/10">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-cream">{t.product.shipping}</h4>
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-muted-foreground/80 font-medium">
                    {t.product.shippingText}
                  </p>
                </div>
              </div>

              {/* Authenticity */}
              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 transition-colors group-hover:bg-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-cream">Authenticity</h4>
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-muted-foreground/80 font-medium">
                    Certified 100% authentic designer evening wear from Royal Brands.
                  </p>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="pt-8">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light italic">
                {desc}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center gap-6 mb-16 px-4 md:px-0">
               <h2 className="font-display text-3xl md:text-5xl text-cream whitespace-nowrap">{t.product.related}</h2>
               <div className="h-px w-full bg-border/10" />
               <span className="text-[9px] uppercase tracking-[0.4em] text-primary whitespace-nowrap font-bold">{t.product.relatedTag}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {related.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
