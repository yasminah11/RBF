import { Link, useNavigate } from "react-router-dom";
import { Globe, Heart, Search, ShoppingBag, User, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { useState, useEffect, useRef } from "react";
import { useCart, cartCount, useCartDrawer, cart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { LOCALES } from "@/i18n/translations";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { CartDrawer } from "./CartDrawer";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openDressesMobile, setOpenDressesMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    if (openMobile || openCart || showSearch) {
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
  }, [openMobile, openCart, showSearch]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  useEffect(() => {
    setOpenMobile(false);
    setOpenDressesMobile(false);
  }, [locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setOpenMobile(false);
      setSearchQuery("");
    }
  };

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
        <div className="container-luxury flex items-center justify-between px-3 sm:px-6 md:px-10 gap-1 sm:gap-4 md:gap-8">
          {/* Left: Mobile Toggle & Lang Switcher */}
          <div className="flex items-center gap-1 sm:gap-4 flex-1">
            <button 
              onClick={() => setOpenMobile(true)} 
              className="lg:hidden text-foreground/90 hover:text-primary transition-colors p-1.5 sm:p-2 -ms-1 sm:-ms-2" 
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Desktop Search - Hidden on mobile */}
              <button 
                onClick={() => setShowSearch(true)}
                className="hidden lg:flex text-foreground/80 hover:text-primary transition-all duration-300 p-1.5" 
                aria-label={t.common.search}
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Language Switcher - Always visible in main navbar */}
              <div className="relative">
                <button 
                  onClick={() => setOpenLang(!openLang)} 
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold p-1.5" 
                  aria-label={t.common.selectLanguage}
                >
                  <Globe className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{locale.toUpperCase()}</span>
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

          {/* Center: Logo */}
          <Link to="/" className={cn(
            "flex flex-col items-center transition-all duration-500 ease-luxury group text-center px-1 shrink-0",
            isScrolled ? "scale-95" : "scale-100"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className={cn(
                "border border-primary flex items-center justify-center relative overflow-hidden group-hover:bg-primary transition-all duration-500 shrink-0",
                isScrolled ? "w-6 h-6 sm:w-8 sm:h-8" : "w-7 h-7 sm:w-10 sm:h-10"
              )}>
                <span className={cn(
                  "font-display text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10 font-bold",
                  isScrolled ? "text-[8px] sm:text-[10px]" : "text-[9px] sm:text-base"
                )}>RBF</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className={cn(
                  "font-display tracking-[0.05em] sm:tracking-[0.2em] text-cream transition-all duration-500 block leading-tight whitespace-nowrap font-bold md:font-semibold",
                  isScrolled 
                    ? "text-[12px] sm:text-base md:text-xl" 
                    : "text-[14px] sm:text-xl md:text-3xl"
                )}>
                  ROYAL <span className="text-primary">BRANDS</span> FASHION
                </span>
              </div>
            </div>
          </Link>

          {/* Right: Icons (Wishlist & Cart visible on all, Account moved to menu on mobile) */}
          <div className="flex items-center gap-1 sm:gap-4 md:gap-6 flex-1 justify-end">
            <div className="flex items-center gap-0.5 sm:gap-3 md:gap-5">
              {/* Account Icon - Hidden on mobile navbar, moved to menu */}
              <Link to={accountLink} className="hidden lg:flex p-1.5 sm:p-2 text-foreground/80 hover:text-primary transition-all duration-300" aria-label={t.common.account}>
                <User className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-4 md:w-4" />
              </Link>
              
              {/* Wishlist - Visible on all screens direct in navbar */}
              <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-foreground/80 hover:text-primary transition-all duration-300" aria-label={t.wishlist.title}>
                <Heart className={cn("h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-4 md:w-4", wishlistCount > 0 && "fill-primary text-primary")} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 sm:-top-1.5 sm:-end-1 bg-primary text-primary-foreground text-[7px] sm:text-[9px] font-bold rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              {/* Cart - Visible on all screens direct in navbar */}
              <button 
                onClick={() => cart.setOpen(true)}
                className="relative p-1.5 sm:p-2 text-foreground/80 hover:text-primary transition-all duration-300" 
                aria-label={t.cart.title}
              >
                <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-4 md:w-4" />
                {count > 0 && (
                  <span className="absolute top-1 right-1 sm:-top-1.5 sm:-end-1 bg-primary text-primary-foreground text-[7px] sm:text-[9px] font-bold rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Desktop Nav (Only when NOT scrolled) */}
        <nav className={cn(
          "hidden lg:block border-t border-border/5 transition-all duration-700 ease-luxury mt-6",
          isScrolled ? "max-h-0 opacity-0 overflow-hidden pointer-events-none mt-0" : "max-h-24 opacity-100"
        )}>
          <div className="container-luxury flex items-center justify-center gap-16 py-6">
            <NavLink to="/shop" className="nav-link text-[13px] tracking-[0.25em] font-semibold">{t.nav.shop}</NavLink>
            
            {/* Dresses Dropdown */}
            <div className="relative group/dropdown">
              <button className="nav-link text-[13px] tracking-[0.25em] font-semibold flex items-center gap-2">
                {t.nav.dresses} <ChevronDown className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 translate-y-2 group-hover/dropdown:translate-y-0 z-50">
                <div className="bg-card/95 backdrop-blur-md border border-primary/20 shadow-gold min-w-[280px] p-2">
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

            <NavLink to="/about" className="nav-link text-[13px] tracking-[0.25em] font-semibold">{t.nav.about}</NavLink>
          </div>
        </nav>
      </header>

      {/* Desktop Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col items-center pt-20 px-6">
          <button 
            onClick={() => setShowSearch(false)}
            className="absolute top-6 right-6 p-2 text-foreground/60 hover:text-primary transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="w-full max-w-2xl mt-20">
            <form onSubmit={handleSearch} className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.search + "..."}
                className="w-full bg-transparent border-b-2 border-primary/20 py-4 px-2 text-2xl md:text-4xl font-display text-cream placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                <ArrowRight className="h-8 w-8" />
              </button>
            </form>
          </div>
        </div>
      )}

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
            <span className="font-display text-base tracking-widest text-cream uppercase font-semibold">Royal Brands</span>
          </div>
          <button 
            onClick={() => setOpenMobile(false)} 
            className="text-foreground/90 hover:text-primary transition-colors p-2"
            aria-label="Close Menu"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            
            {/* Search Bar inside Mobile Menu */}
            <form onSubmit={handleSearch} className="w-full relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.search + "..."}
                className="w-full bg-primary/5 border border-primary/20 py-3 ps-10 pe-4 rounded-full text-sm text-cream placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            </form>

            <Link to="/shop" onClick={() => setOpenMobile(false)} className="text-2xl font-display tracking-[0.1em] text-foreground hover:text-primary transition-colors font-semibold">
              {t.nav.shop}
            </Link>

            {/* Mobile Dresses Dropdown */}
            <div className="w-full flex flex-col items-center border-y border-border/5 py-8">
              <button 
                onClick={() => setOpenDressesMobile(!openDressesMobile)}
                className="text-2xl font-display tracking-[0.1em] text-foreground flex items-center gap-3 hover:text-primary transition-colors font-semibold"
              >
                {t.nav.dresses} <ChevronDown className={cn("h-6 w-6 transition-transform", openDressesMobile && "rotate-180")} />
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 w-full",
                openDressesMobile ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0"
              )}>
                <div className="flex flex-col gap-6 py-6 bg-primary/5 rounded-lg text-center">
                  {dressSubcategories.map((sub) => (
                    <Link 
                      key={sub.to} 
                      to={sub.to} 
                      onClick={() => setOpenMobile(false)} 
                      className="text-sm uppercase tracking-[0.15em] text-foreground/70 hover:text-primary transition-colors font-semibold"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/about" onClick={() => setOpenMobile(false)} className="text-2xl font-display tracking-[0.1em] text-foreground hover:text-primary transition-colors font-semibold">
              {t.nav.about}
            </Link>

            {/* Explicit Login/Profile link for mobile */}
            <Link to={accountLink} onClick={() => setOpenMobile(false)} className="text-2xl font-display tracking-[0.1em] text-primary hover:text-primary-glow transition-colors font-semibold">
              {isAuthenticated ? t.common.account : (locale === "ar" ? "تسجيل الدخول" : locale === "tr" ? "Giriş Yap" : "Login")}
            </Link>
            
            <div className="w-16 h-px bg-primary/30 my-6" />
            
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">{t.common.selectLanguage}</p>
              <div className="flex gap-8">
                {LOCALES.map((l) => (
                  <button 
                    key={l} 
                    onClick={() => setLocale(l)} 
                    className={cn(
                      "text-sm uppercase tracking-[0.2em] transition-all",
                      l === locale ? "text-primary font-bold border-b border-primary/50 pb-1" : "text-foreground/40 hover:text-foreground/60"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 w-full mt-10 pt-10 border-t border-border/5 text-center">
              <Link to={accountLink} onClick={() => setOpenMobile(false)} className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                <User className="h-6 w-6 text-foreground/60" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t.common.account}</span>
              </Link>
              <Link to="/wishlist" onClick={() => setOpenMobile(false)} className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-6 w-6 text-foreground/60" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t.wishlist.title}</span>
              </Link>
              <button 
                onClick={() => { setOpenMobile(false); cart.setOpen(true); }} 
                className="flex flex-col items-center gap-2 hover:text-primary transition-colors"
              >
                <ShoppingBag className="h-6 w-6 text-foreground/60" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{locale === "ar" ? "السلة" : locale === "tr" ? "Sepet" : "Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="px-6 py-8 text-center border-t border-border/5 bg-background/50">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">
            © {new Date().getFullYear()} Royal Brands Fashion
          </p>
        </div>
      </div>

      <CartDrawer open={openCart} onOpenChange={(o) => cart.setOpen(o)} />
    </>
  );
}
