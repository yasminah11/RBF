import { Link } from "react-router-dom";
import { Globe, Heart, Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { useState, useEffect } from "react";
import { useCart, cartCount, useCartDrawer, cart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { LOCALES } from "@/i18n/translations";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { CartDrawer } from "./CartDrawer";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openDressesMobile, setOpenDressesMobile] = useState(false);
  const openCart = useCartDrawer();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const items = useCart();
  const wishlistItems = useWishlist();
  const count = cartCount(items);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (openMobile || openCart) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [openMobile, openCart]);

  useEffect(() => {
    setOpenMobile(false);
    setOpenDressesMobile(false);
  }, [locale]);

  const dressSubcategories = [
    { to: "/category/long-evening-dresses", label: t.nav.longDresses },
    { to: "/category/short-evening-dresses", label: t.nav.shortDresses },
    { to: "/category/graduation-evening-dresses", label: t.nav.graduationDresses },
    { to: "/category/mermaid-style-evening-dresses", label: t.nav.mermaidDresses },
  ];

  const accountLink = isAuthenticated ? "/profile" : "/auth";

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury",
          isScrolled 
            ? "bg-background/90 backdrop-blur-xl shadow-gold border-b border-primary/10 py-2 md:py-3" 
            : "bg-gradient-to-b from-background/80 to-transparent py-3 md:py-6"
        )}
      >
        <div className="container-luxury flex items-center justify-between gap-1 md:gap-8">
          {/* Left: Mobile Toggle & Desktop Icons */}
          <div className="flex items-center gap-1 md:gap-4 flex-1">
            <button 
              onClick={() => setOpenMobile(true)} 
              className="lg:hidden text-foreground/90 hover:text-primary transition-colors p-2 -ms-2" 
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            
            <div className="hidden lg:flex items-center gap-6">
              <button className="text-foreground/80 hover:text-primary transition-all duration-300" aria-label={t.common.search}>
                <Search className="h-4 w-4" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setOpenLang(!openLang)} 
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-[10px] uppercase tracking-widest font-medium" 
                  aria-label={t.common.selectLanguage}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{locale.toUpperCase()}</span>
                </button>
                {openLang && (
                  <div className="absolute top-full mt-4 start-0 bg-card/95 backdrop-blur-md border border-primary/20 shadow-gold min-w-[140px] py-2 z-50 animate-fade-in-up">
                    {LOCALES.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setOpenLang(false); }}
                        className={cn(
                          "block w-full text-start px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-primary/10 hover:ps-6",
                          l === locale ? "text-primary font-bold" : "text-foreground/80"
                        )}
                      >
                        {l === "ar" ? "العربية" : l === "tr" ? "Türkçe" : "English"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Logo - Optimized for small screens */}
          <Link to="/" className={cn(
            "flex flex-col items-center transition-all duration-500 ease-luxury group text-center px-1",
            isScrolled ? "scale-90 md:scale-90" : "scale-95 md:scale-100"
          )}>
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="w-6 h-6 md:w-10 md:h-10 border border-primary flex items-center justify-center relative overflow-hidden group-hover:bg-primary transition-all duration-500 shrink-0">
                <span className="font-display text-[10px] md:text-base text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10">RBF</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className={cn(
                  "font-display tracking-[0.1em] md:tracking-[0.2em] text-cream transition-all duration-500 block leading-tight whitespace-nowrap",
                  isScrolled ? "text-base md:text-xl" : "text-lg md:text-3xl"
                )}>
                  ROYAL <span className="text-primary">BRANDS</span> FASHION
                </span>
              </div>
            </div>
          </Link>

          {/* Right: Icons & Optional Nav */}
          <div className="flex items-center gap-0.5 md:gap-6 flex-1 justify-end">
            <div className="flex items-center gap-0 md:gap-5">
              <Link to={accountLink} className="hidden md:flex p-2 text-foreground/80 hover:text-primary transition-all duration-300" aria-label={t.common.account}>
                <User className="h-4 w-4" />
              </Link>
              <Link to="/wishlist" className="relative p-2 text-foreground/80 hover:text-primary transition-all duration-300" aria-label={t.wishlist.title}>
                <Heart className={cn("h-4.5 w-4.5 md:h-4 md:w-4", wishlistCount > 0 && "fill-primary text-primary")} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1 md:-top-1.5 md:-end-1.5 bg-primary text-primary-foreground text-[7px] md:text-[9px] font-bold rounded-full h-3 w-3 md:h-4 md:w-4 flex items-center justify-center animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => cart.setOpen(true)}
                className="relative p-2 text-foreground/80 hover:text-primary transition-all duration-300" 
                aria-label={t.cart.title}
              >
                <ShoppingBag className="h-5 w-5 md:h-4 md:w-4" />
                {count > 0 && (
                  <span className="absolute top-1.5 right-1 md:-top-1.5 md:-end-1.5 bg-primary text-primary-foreground text-[7px] md:text-[9px] font-bold rounded-full h-3 w-3 md:h-4 md:w-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Desktop Nav (Only when NOT scrolled) */}
        <nav className={cn(
          "hidden lg:block border-t border-border/5 transition-all duration-700 ease-luxury mt-5",
          isScrolled ? "max-h-0 opacity-0 overflow-hidden pointer-events-none mt-0" : "max-h-20 opacity-100"
        )}>
          <div className="container-luxury flex items-center justify-center gap-12 py-4">
            <NavLink to="/shop" className="nav-link text-[11px] tracking-[0.2em]">{t.nav.shop}</NavLink>
            
            {/* Dresses Dropdown */}
            <div className="relative group/dropdown">
              <button className="nav-link text-[11px] tracking-[0.2em] flex items-center gap-2">
                {t.nav.dresses} <ChevronDown className="h-3 w-3 transition-transform group-hover/dropdown:rotate-180" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 translate-y-2 group-hover/dropdown:translate-y-0 z-50">
                <div className="bg-card/95 backdrop-blur-xl border border-primary/20 shadow-gold min-w-[280px] p-2">
                  {dressSubcategories.map((sub) => (
                    <Link 
                      key={sub.to} 
                      to={sub.to} 
                      className="block w-full text-start px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink to="/about" className="nav-link text-[11px] tracking-[0.2em]">{t.nav.about}</NavLink>
          </div>
        </nav>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-background/98 backdrop-blur-2xl z-[100] transition-all duration-500 ease-luxury overflow-hidden flex flex-col h-[100dvh]",
        openMobile ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-primary flex items-center justify-center">
              <span className="font-display text-xs text-primary">RBF</span>
            </div>
            <span className="font-display text-sm tracking-widest text-cream uppercase">Royal Brands</span>
          </div>
          <button 
            onClick={() => setOpenMobile(false)} 
            className="text-foreground/90 hover:text-primary transition-colors p-2"
            aria-label="Close Menu"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <Link to="/shop" onClick={() => setOpenMobile(false)} className="text-xl md:text-2xl font-display tracking-[0.1em] text-foreground hover:text-primary transition-colors">
              {t.nav.shop}
            </Link>

            {/* Mobile Dresses Dropdown */}
            <div className="w-full flex flex-col items-center border-y border-border/5 py-6">
              <button 
                onClick={() => setOpenDressesMobile(!openDressesMobile)}
                className="text-xl md:text-2xl font-display tracking-[0.1em] text-foreground flex items-center gap-3 hover:text-primary transition-colors"
              >
                {t.nav.dresses} <ChevronDown className={cn("h-5 w-5 transition-transform", openDressesMobile && "rotate-180")} />
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 w-full",
                openDressesMobile ? "max-h-[400px] opacity-100 mt-6" : "max-h-0 opacity-0"
              )}>
                <div className="flex flex-col gap-5 py-4 bg-primary/5 rounded-lg">
                  {dressSubcategories.map((sub) => (
                    <Link 
                      key={sub.to} 
                      to={sub.to} 
                      onClick={() => setOpenMobile(false)} 
                      className="text-xs uppercase tracking-[0.15em] text-foreground/70 hover:text-primary transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/about" onClick={() => setOpenMobile(false)} className="text-xl md:text-2xl font-display tracking-[0.1em] text-foreground hover:text-primary transition-colors">
              {t.nav.about}
            </Link>
            
            <div className="w-16 h-px bg-primary/30 my-4" />
            
            <div className="flex flex-col items-center gap-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{t.common.selectLanguage}</p>
              <div className="flex gap-6">
                {LOCALES.map((l) => (
                  <button 
                    key={l} 
                    onClick={() => setLocale(l)} 
                    className={cn(
                      "text-xs uppercase tracking-[0.2em] transition-all",
                      l === locale ? "text-primary font-bold border-b border-primary/50 pb-1" : "text-foreground/40 hover:text-foreground/60"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full mt-8 pt-8 border-t border-border/5">
              <Link to={accountLink} onClick={() => setOpenMobile(false)} className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                <User className="h-5 w-5 text-foreground/60" />
                <span className="text-[8px] uppercase tracking-widest font-medium text-muted-foreground">{t.common.account}</span>
              </Link>
              <Link to="/wishlist" onClick={() => setOpenMobile(false)} className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-5 w-5 text-foreground/60" />
                <span className="text-[8px] uppercase tracking-widest font-medium text-muted-foreground">{t.wishlist.title}</span>
              </Link>
              <button 
                onClick={() => { setOpenMobile(false); cart.setOpen(true); }} 
                className="flex flex-col items-center gap-2 hover:text-primary transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-foreground/60" />
                <span className="text-[8px] uppercase tracking-widest font-medium text-muted-foreground">{locale === "ar" ? "السلة" : locale === "tr" ? "Sepet" : "Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="px-6 py-6 text-center border-t border-border/5">
          <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">
            © {new Date().getFullYear()} Royal Brands Fashion
          </p>
        </div>
      </div>

      <CartDrawer open={openCart} onOpenChange={(o) => cart.setOpen(o)} />
    </>
  );
}
