import { 
  TrendingUp, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../services/api";
import { Link } from "react-router-dom";

export function DashboardOverview() {
  const { t, formatPrice, locale } = useI18n();

  // Fetch real mock data from API
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getDashboardStats,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: adminApi.getProducts,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminApi.getOrders,
  });

  const dashboardStats = [
    {
      title: t.admin.dashboard.totalRevenue,
      value: formatPrice(stats?.totalRevenue || 0),
      subtitle: "vs last month",
      icon: TrendingUp,
      trend: "up",
      trendValue: "12%"
    },
    {
      title: t.admin.dashboard.totalOrders,
      value: stats?.totalOrders?.toString() || "0",
      subtitle: "vs last month",
      icon: ShoppingCart,
      trend: "up",
      trendValue: "8.4%"
    },
    {
      title: t.admin.dashboard.totalProducts,
      value: stats?.totalProducts?.toString() || "0",
      subtitle: "Active products",
      icon: ShoppingBag
    },
    {
      title: t.admin.dashboard.registeredUsers,
      value: stats?.totalUsers?.toString() || "0",
      subtitle: "New this week",
      icon: Users,
      trend: "up",
      trendValue: "2.1%"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-primary">{t.admin.sidebar.dashboard}</h1>
        <p className="text-muted-foreground">{t.brand} {t.admin.sidebar.portal}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <Card key={i} className="bg-card border-border overflow-hidden relative group transition-all duration-300 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {statsLoading ? "..." : stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend && (
                  <span className={cn(
                    "flex items-center text-[10px] font-bold",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trendValue}
                  </span>
                )}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="lg:col-span-4 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl text-primary">{t.admin.dashboard.monthlySales}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-background/50 rounded-lg border border-border/50 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 flex items-end justify-between px-8 py-4 opacity-20">
                {[40, 70, 45, 90, 65, 85, 30, 50, 75, 40, 60, 95].map((h, i) => (
                  <div key={i} className="w-4 bg-primary rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="text-muted-foreground text-sm font-medium relative z-10 uppercase tracking-widest">{t.admin.dashboard.recentActivity}</p>
              <span className="text-[10px] text-primary/60 mt-2 relative z-10 tracking-widest uppercase">Chart Component Ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Products section */}
        <Card className="lg:col-span-3 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-primary">Top Products</CardTitle>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {productsLoading ? (
                <div className="flex justify-center py-8"><Package className="animate-pulse text-muted/20" /></div>
              ) : (
                products?.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded border border-border overflow-hidden bg-muted">
                      <img src="/placeholder.svg" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {locale === "ar" ? product.name_ar : locale === "tr" ? product.name_tr : product.name_en}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.sku || `SKU-${product.id}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{formatPrice(product.price)}</p>
                      <p className="text-[10px] text-green-500 font-bold uppercase">In Stock</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders section */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-xl text-primary">{t.admin.dashboard.recentActivity}</CardTitle>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10">All Orders</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersLoading ? (
               <div className="col-span-full flex justify-center py-8"><ShoppingCart className="animate-pulse text-muted/20" /></div>
            ) : (
              orders?.map((order: any) => (
                <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-all group">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Order {order.order_number.split('-').pop()}</p>
                    <p className="text-xs text-muted-foreground">{order.guest_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{formatPrice(order.total_amount)}</p>
                    <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-widest bg-green-500/10 text-green-500 border-green-500/20">{order.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
