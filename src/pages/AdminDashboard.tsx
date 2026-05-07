import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Ornament } from "@/components/Ornament";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Revenue", value: "$45,285", icon: DollarSign, change: "+12.5%", color: "text-primary" },
    { label: "Total Orders", value: "154", icon: ShoppingBag, change: "+8.2%", color: "text-cream" },
    { label: "Customers", value: "1,204", icon: Users, change: "+15.3%", color: "text-primary" },
    { label: "Active Products", value: "84", icon: Package, change: "+2", color: "text-cream" },
  ];

  const recentOrders = [
    { id: "#ORD-7701", customer: "Sophia Lauren", date: "Oct 24, 2023", amount: "$1,200", status: "Paid" },
    { id: "#ORD-7702", customer: "Julianne Moore", date: "Oct 23, 2023", amount: "$850", status: "Processing" },
    { id: "#ORD-7703", customer: "Emma Stone", date: "Oct 23, 2023", amount: "$2,100", status: "Paid" },
    { id: "#ORD-7704", customer: "Cate Blanchett", date: "Oct 22, 2023", amount: "$450", status: "Shipped" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("rbf_admin_auth");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card/50 backdrop-blur-2xl border-r border-primary/10 transition-all duration-500 ease-luxury",
          isSidebarOpen ? "w-72" : "w-20",
          "-translate-x-full lg:translate-x-0" // Mobile behavior
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 border border-primary flex items-center justify-center shrink-0">
              <span className="font-display text-primary">RBF</span>
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="font-display text-lg tracking-widest text-cream uppercase whitespace-nowrap"
              >
                Maison Admin
              </motion.span>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-6 mb-8" />

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutDashboard },
              { id: "products", label: "Collections", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "customers", label: "Clients", icon: Users },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "settings", label: "Maison Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-none transition-all duration-300 group",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-gold" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                )}
                {activeTab === item.id && isSidebarOpen && (
                  <motion.div layoutId="active" className="ml-auto">
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-4 text-muted-foreground hover:text-destructive transition-colors group"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && (
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen overflow-y-auto",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-primary/10 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-primary/5 rounded-none text-primary"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h2 className="font-display text-xl text-cream capitalize">{activeTab}</h2>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Royal Brands Fashion Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-primary/5 border border-primary/10 pl-10 pr-4 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-background" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-2">Management Portal</p>
              <h1 className="font-display text-4xl text-cream">Welcome back, Admin</h1>
              <Ornament className="mt-4" />
            </div>
            <div className="flex gap-3">
              <button className="bg-primary/5 border border-primary/20 text-primary px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-all">
                Export Data
              </button>
              <button className="bg-primary text-primary-foreground px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:shadow-gold transition-all flex items-center gap-2">
                <Plus className="h-3 w-3" /> New Collection
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/40 backdrop-blur-xl border border-primary/10 p-6 shadow-luxury group hover:border-primary/30 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <stat.icon className="h-12 w-12" />
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className={cn("font-display text-3xl", stat.color)}>{stat.value}</h3>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-primary/10 p-8 shadow-luxury relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display text-2xl text-cream">Recent Orders</h3>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Live updates from the maison</p>
                </div>
                <button className="text-[10px] uppercase tracking-widest text-primary hover:underline">View All</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary/10">
                      {["Order ID", "Client", "Date", "Amount", "Status"].map((h) => (
                        <th key={h} className="pb-4 text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="group hover:bg-primary/5 transition-colors">
                        <td className="py-4 text-[11px] font-mono text-primary">{order.id}</td>
                        <td className="py-4 text-xs text-cream">{order.customer}</td>
                        <td className="py-4 text-[10px] text-muted-foreground uppercase">{order.date}</td>
                        <td className="py-4 text-xs font-bold text-cream">{order.amount}</td>
                        <td className="py-4">
                          <span className={cn(
                            "text-[8px] uppercase tracking-widest px-2 py-1 rounded-full border",
                            order.status === "Paid" ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" :
                            order.status === "Processing" ? "border-amber-500/20 text-amber-500 bg-amber-500/5" :
                            "border-primary/20 text-primary bg-primary/5"
                          )}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions / Activity */}
            <div className="space-y-8">
              <div className="bg-card/40 backdrop-blur-xl border border-primary/10 p-8 shadow-luxury">
                <h3 className="font-display text-2xl text-cream mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Add Item", icon: Plus },
                    { label: "Promote", icon: TrendingUp },
                    { label: "Analytics", icon: BarChart3 },
                    { label: "Maison", icon: Settings },
                  ].map((action) => (
                    <button 
                      key={action.label}
                      className="flex flex-col items-center justify-center p-4 border border-primary/10 bg-primary/5 hover:border-primary/30 transition-all gap-3 group"
                    >
                      <action.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-primary/10 p-8 shadow-luxury">
                <h3 className="font-display text-2xl text-cream mb-6">System Status</h3>
                <div className="space-y-6">
                  {[
                    { label: "Payment Gateway", status: "Operational", color: "bg-emerald-500" },
                    { label: "Inventory Sync", status: "Operational", color: "bg-emerald-500" },
                    { label: "Newsletter API", status: "Operational", color: "bg-emerald-500" },
                  ].map((sys) => (
                    <div key={sys.label} className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{sys.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-cream">{sys.status}</span>
                        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", sys.color)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
