import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Ornament } from "./Ornament";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-card mt-24 border-t border-border/40">
      <div className="container-luxury py-16 px-6">
        <div className="flex flex-col items-center mb-12">
          <div className="w-12 h-12 border border-primary flex items-center justify-center mb-4">
            <span className="font-display text-lg text-primary">RBF</span>
          </div>
          <Ornament />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-10">
          <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-start">
            <h3 className="font-display text-2xl text-cream mb-4 tracking-wider">ROYAL <span className="text-primary">BRANDS</span> FASHION</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs italic font-light">
              {t.tagline}
            </p>
            <div className="flex gap-6 mt-6 text-foreground/60">
              <a href="#" aria-label="Instagram" className="hover:text-primary transition-all hover:scale-110"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-primary transition-all hover:scale-110"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Youtube" className="hover:text-primary transition-all hover:scale-110"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <h4 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary font-bold mb-6">{t.footer.shop}</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/category/long-evening-dresses" className="hover:text-primary transition-colors block py-1">{t.nav.longDresses}</Link></li>
              <li><Link to="/category/short-evening-dresses" className="hover:text-primary transition-colors block py-1">{t.nav.shortDresses}</Link></li>
              <li><Link to="/category/graduation-evening-dresses" className="hover:text-primary transition-colors block py-1">{t.nav.graduationDresses}</Link></li>
              <li><Link to="/category/mermaid-style-evening-dresses" className="hover:text-primary transition-colors block py-1">{t.nav.mermaidDresses}</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <h4 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary font-bold mb-6">{t.footer.maison}</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/about" className="hover:text-primary transition-colors block py-1">{t.footer.about}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors block py-1">{t.footer.contact}</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors block py-1">{t.footer.faq}</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <h4 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary font-bold mb-6">{t.footer.help}</h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/returns" className="hover:text-primary transition-colors block py-1">{t.footer.returns}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors block py-1">{t.footer.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border/10 text-center">
          <p className="text-[10px] md:text-xs text-muted-foreground tracking-[0.2em] uppercase opacity-60">
            © {new Date().getFullYear()} Royal Brands Fashion. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
