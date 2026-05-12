import { useState } from "react";
import { 
  Save, 
  Globe, 
  CreditCard, 
  Mail, 
  Upload, 
  Clock,
  DollarSign
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AdminSettings() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t.admin.common.success);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-primary">{t.admin.settings.title}</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border p-1">
          <TabsTrigger value="general" className="gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">{t.admin.settings.general}</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">{t.admin.settings.payment}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-primary">{t.admin.settings.storeName}</CardTitle>
                    <CardDescription>How your brand appears across all languages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store_en" className="text-[10px] uppercase tracking-widest text-muted-foreground">Store Name (English)</Label>
                        <Input id="store_en" defaultValue="Royal Brands Fashion" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store_ar" className="text-[10px] uppercase tracking-widest text-muted-foreground">Store Name (Arabic)</Label>
                        <Input id="store_ar" dir="rtl" defaultValue="رويال براندز فاشن" className="bg-background border-border text-right" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store_tr" className="text-[10px] uppercase tracking-widest text-muted-foreground">Store Name (Turkish)</Label>
                        <Input id="store_tr" defaultValue="Royal Brands Fashion" className="bg-background border-border" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-primary">Regional & Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" /> {t.admin.settings.contactEmail}
                        </Label>
                        <Input id="email" type="email" defaultValue="contact@royalbrands.com" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency" className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <DollarSign className="h-3 w-3" /> {t.admin.settings.currency}
                        </Label>
                        <Select defaultValue="TRY">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="TRY">Turkish Lira (₺)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="SAR">Saudi Riyal (SR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" /> {t.admin.settings.timezone}
                        </Label>
                        <Select defaultValue="GMT+3">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="GMT+3">(GMT+03:00) Istanbul, Riyadh</SelectItem>
                            <SelectItem value="GMT+0">(GMT+00:00) London</SelectItem>
                            <SelectItem value="GMT-5">(GMT-05:00) New York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-primary">{t.admin.settings.logo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square rounded-lg border border-dashed border-border bg-background flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4 border border-border group-hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground">Upload New Logo</p>
                      <p className="text-[10px] text-muted-foreground mt-2">Recommended size: 512x512px</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="sticky top-24">
                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold h-12 text-xs font-bold uppercase tracking-[0.2em]">
                    {loading ? "Saving..." : t.admin.settings.save}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="bg-card border-border">
            <CardHeader className="text-center py-12">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl text-primary mb-2">Payment Gateway</CardTitle>
              <CardDescription className="max-w-md mx-auto">
                {t.admin.settings.paymentPlaceholder}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12 text-center">
              <Button disabled variant="outline" className="bg-background border-border text-[10px] uppercase font-bold tracking-widest">
                Configure Stripe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
