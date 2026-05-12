import { Menu, UserCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminTopbar({ setMobileOpen }: { setMobileOpen: (o: boolean) => void }) {
  const { locale, setLocale, t, dir } = useI18n();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="flex-1 flex justify-between items-center">
        <h2 className="hidden md:block font-display text-xl text-primary">
          {/* Page title could be dynamic based on route, for now let's show Portal */}
          {t.admin.sidebar.portal}
        </h2>
        
        <div className="flex items-center gap-4 ml-auto">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-4 w-4" />
                <span className="uppercase text-xs font-bold tracking-widest">{locale}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="bg-card border-border">
              <DropdownMenuItem onClick={() => setLocale("en")} className="text-xs uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-primary-foreground">
                English (EN)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("ar")} className="text-xs uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-primary-foreground">
                العربية (AR)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("tr")} className="text-xs uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Türkçe (TR)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3 border-l border-border pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-foreground tracking-wide uppercase">{t.admin.topbar.user}</span>
              <span className="text-[10px] text-primary uppercase tracking-[0.2em]">{t.admin.topbar.role}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
