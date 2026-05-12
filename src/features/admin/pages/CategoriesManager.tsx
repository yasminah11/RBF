import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Upload, 
  X,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  order: number;
  name_en: string;
  name_ar: string;
  name_tr: string;
  slug: string;
  description_en?: string;
  description_ar?: string;
  description_tr?: string;
  status: "active" | "inactive";
  productCount: number;
  image?: string;
  parentId?: string;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", order: 1, name_en: "Modest Dresses", name_ar: "فساتين للمحجبات", name_tr: "Tesettür Elbiseleri", slug: "modest-dresses", status: "active", productCount: 24 },
  { id: "2", order: 2, name_en: "Evening Dresses", name_ar: "فساتين سهرة", name_tr: "Abiye Elbiseler", slug: "evening-dresses", status: "active", productCount: 45 },
  { id: "3", order: 3, name_en: "Wedding Dresses", name_ar: "فساتين زفاف", name_tr: "Gelinlikler", slug: "wedding-dresses", status: "active", productCount: 12 },
  { id: "4", order: 4, name_en: "Engagement Dresses", name_ar: "فساتين خطوبة", name_tr: "Nişan Elbiseleri", slug: "engagement-dresses", status: "active", productCount: 18 },
  { id: "5", order: 5, name_en: "Long Evening Dresses", name_ar: "فساتين سهرة طويلة", name_tr: "Uzun Abiye Elbiseler", slug: "long-evening-dresses", status: "active", productCount: 15, parentId: "2" },
  { id: "6", order: 6, name_en: "Short Evening Dresses", name_ar: "فساتين سهرة قصيرة", name_tr: "Kısa Abiye Elbiseler", slug: "short-evening-dresses", status: "active", productCount: 10, parentId: "2" },
];

export function CategoriesManager() {
  const { t, locale, dir } = useI18n();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories
    .filter(c => 
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_tr.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  const handleMove = (id: string, direction: "up" | "down") => {
    const idx = categories.findIndex(c => c.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === categories.length - 1)) return;
    
    const newCategories = [...categories];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    
    // Swap order values
    const tempOrder = newCategories[idx].order;
    newCategories[idx].order = newCategories[targetIdx].order;
    newCategories[targetIdx].order = tempOrder;
    
    setCategories(newCategories.sort((a, b) => a.order - b.order));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCategory: Category = {
      id: currentCategory?.id || Math.random().toString(36).substr(2, 9),
      order: currentCategory?.order || categories.length + 1,
      name_en: formData.get("name_en") as string,
      name_ar: formData.get("name_ar") as string,
      name_tr: formData.get("name_tr") as string,
      slug: formData.get("slug") as string,
      description_en: formData.get("description_en") as string,
      description_ar: formData.get("description_ar") as string,
      description_tr: formData.get("description_tr") as string,
      status: formData.get("status") === "active" ? "active" : "inactive",
      productCount: currentCategory?.productCount || 0,
      parentId: formData.get("parentId") === "none" ? undefined : formData.get("parentId") as string,
    };

    if (currentCategory) {
      setCategories(prev => prev.map(c => c.id === currentCategory.id ? newCategory : c));
    } else {
      setCategories(prev => [...prev, newCategory]);
    }

    toast.success(t.admin.common.success);
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
    ));
    toast.success(t.admin.common.success);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-primary">{t.admin.categories.title}</h1>
          <p className="text-muted-foreground">Manage your store dress collections</p>
        </div>
        <Button onClick={() => { setCurrentCategory(null); setIsModalOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold">
          <Plus className="h-4 w-4 mr-2 rtl:ml-2" />
          {t.admin.categories.addCategory}
        </Button>
      </div>

      <Card className="bg-card border-border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
          <Input 
            placeholder="Search categories..." 
            className="pl-10 rtl:pr-10 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium w-16">#</th>
                <th className="px-6 py-4 font-medium">Name (EN/AR/TR)</th>
                <th className="px-6 py-4 font-medium">{t.admin.categories.slug}</th>
                <th className="px-6 py-4 font-medium">{t.admin.categories.productCount}</th>
                <th className="px-6 py-4 font-medium">{t.admin.products.status}</th>
                <th className="px-6 py-4 font-medium text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => handleMove(cat.id, "up")} disabled={i === 0} className="text-muted-foreground hover:text-primary disabled:opacity-30">
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-foreground text-xs">{cat.order}</span>
                      <button onClick={() => handleMove(cat.id, "down")} disabled={i === filteredCategories.length - 1} className="text-muted-foreground hover:text-primary disabled:opacity-30">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        {cat.parentId && <LinkIcon className="h-3 w-3 text-primary/50" />}
                        {cat.name_en}
                      </span>
                      <span className="text-xs text-muted-foreground">{cat.name_ar} • {cat.name_tr}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-primary border border-primary/20">{cat.slug}</code>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {cat.productCount}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      onClick={() => toggleStatus(cat.id)}
                      className={cn(
                        "text-[10px] uppercase tracking-widest cursor-pointer transition-all",
                        cat.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {cat.status === "active" ? t.admin.products.active : t.admin.products.inactive}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => { setCurrentCategory(cat); setIsModalOpen(true); }} className="h-8 w-8 text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleStatus(cat.id)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">
              {currentCategory ? t.admin.categories.modal.editTitle : t.admin.categories.modal.addTitle}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.nameEn}</Label>
                  <Input id="name_en" name="name_en" defaultValue={currentCategory?.name_en} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.nameAr}</Label>
                  <Input id="name_ar" name="name_ar" dir="rtl" defaultValue={currentCategory?.name_ar} required className="bg-background border-border text-right" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_tr" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.nameTr}</Label>
                  <Input id="name_tr" name="name_tr" defaultValue={currentCategory?.name_tr} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.slug}</Label>
                  <Input id="slug" name="slug" defaultValue={currentCategory?.slug} required className="bg-background border-border" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parentId" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.parent}</Label>
                  <Select name="parentId" defaultValue={currentCategory?.parentId || "none"}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="none">{t.admin.categories.none}</SelectItem>
                      {categories.filter(c => !c.parentId && c.id !== currentCategory?.id).map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.categories.modal.image}</Label>
                  <div className="h-32 rounded border border-dashed border-border flex flex-col items-center justify-center gap-2 bg-background group cursor-pointer hover:bg-muted/30 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Upload Image</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Label htmlFor="status" className="text-xs uppercase tracking-widest text-muted-foreground">{t.admin.products.status}</Label>
                  <Select name="status" defaultValue={currentCategory?.status || "active"}>
                    <SelectTrigger className="w-[120px] bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {/* Using literals because t.admin.products is available in scope but might be cleaner */}
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="bg-background border-border">
                {t.admin.common.cancel}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold font-bold uppercase tracking-widest text-xs">
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
