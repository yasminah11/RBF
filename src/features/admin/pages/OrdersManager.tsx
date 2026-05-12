import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Types
type FulfillmentStatus = "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  notes?: string;
}

// Initial Mock Data
const INITIAL_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "RB-1001",
    date: "2024-05-12",
    customerName: "Sarah Ahmed",
    customerEmail: "sarah@example.com",
    customerPhone: "+966 50 123 4567",
    shippingAddress: "King Fahd Road, Riyadh, Saudi Arabia",
    total: 2500,
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    items: [
      { id: "p1", name: "Long Silk Evening Gown", image: "/placeholder.svg", quantity: 2, price: 1250 }
    ],
    notes: "Please pack with extra care."
  },
  {
    id: "2",
    orderNumber: "RB-1002",
    date: "2024-05-11",
    customerName: "Ayşe Yılmaz",
    customerEmail: "ayse@example.com",
    customerPhone: "+90 532 123 4567",
    shippingAddress: "Nişantaşı, Istanbul, Turkey",
    total: 850,
    paymentStatus: "pending",
    fulfillmentStatus: "confirmed",
    items: [
      { id: "p2", name: "Short Silk Wrap Dress", image: "/placeholder.svg", quantity: 1, price: 850 }
    ]
  },
  {
    id: "3",
    orderNumber: "RB-1003",
    date: "2024-05-10",
    customerName: "Emma Thompson",
    customerEmail: "emma@example.com",
    customerPhone: "+44 20 1234 5678",
    shippingAddress: "Kensington High St, London, UK",
    total: 1500,
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    items: [
      { id: "p3", name: "Graduation Lace Dress", image: "/placeholder.svg", quantity: 1, price: 1500 }
    ]
  }
];

export function OrdersManager() {
  const { t, formatPrice, dir } = useI18n();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;
      const matchesFulfillment = fulfillmentFilter === "all" || o.fulfillmentStatus === fulfillmentFilter;
      
      return matchesSearch && matchesPayment && matchesFulfillment;
    });
  }, [orders, searchQuery, paymentFilter, fulfillmentFilter]);

  const handleStatusChange = (orderId: string, status: FulfillmentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillmentStatus: status } : o));
  };

  const getStatusIcon = (status: FulfillmentStatus) => {
    switch(status) {
      case "processing": return <Clock className="h-3 w-3" />;
      case "confirmed": return <CheckCircle2 className="h-3 w-3" />;
      case "shipped": return <Truck className="h-3 w-3" />;
      case "delivered": return <Package className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: FulfillmentStatus) => {
    switch(status) {
      case "processing": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "confirmed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-primary">{t.admin.orders.title}</h1>
        <p className="text-muted-foreground">{filteredOrders.length} total orders found</p>
      </div>

      <Card className="bg-card border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
            <Input 
              placeholder="Search by order # or customer..." 
              className="pl-10 rtl:pr-10 bg-background border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">{t.admin.orders.statuses.paid}</SelectItem>
                <SelectItem value="pending">{t.admin.orders.statuses.pending}</SelectItem>
                <SelectItem value="refunded">{t.admin.orders.statuses.refunded}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Fulfillment" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processing">{t.admin.orders.statuses.processing}</SelectItem>
                <SelectItem value="confirmed">{t.admin.orders.statuses.confirmed}</SelectItem>
                <SelectItem value="shipped">{t.admin.orders.statuses.shipped}</SelectItem>
                <SelectItem value="delivered">{t.admin.orders.statuses.delivered}</SelectItem>
                <SelectItem value="cancelled">{t.admin.orders.statuses.cancelled}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="bg-background border-border">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-background border-border">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">{t.admin.orders.orderNum}</th>
                <th className="px-6 py-4 font-medium">{t.admin.orders.date}</th>
                <th className="px-6 py-4 font-medium">{t.admin.orders.customer}</th>
                <th className="px-6 py-4 font-medium">{t.admin.orders.total}</th>
                <th className="px-6 py-4 font-medium">{t.admin.orders.paymentStatus}</th>
                <th className="px-6 py-4 font-medium">{t.admin.orders.fulfillment}</th>
                <th className="px-6 py-4 font-medium text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-6 py-4 font-bold text-foreground">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{order.customerName}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "text-[10px] uppercase tracking-widest",
                      order.paymentStatus === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                      order.paymentStatus === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {t.admin.orders.statuses[order.paymentStatus]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <Select 
                      value={order.fulfillmentStatus} 
                      onValueChange={(val) => handleStatusChange(order.id, val as FulfillmentStatus)}
                    >
                      <SelectTrigger className={cn("h-8 w-[140px] text-[10px] uppercase font-bold tracking-widest", getStatusColor(order.fulfillmentStatus))}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.fulfillmentStatus)}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="processing" className="text-[10px] uppercase font-bold tracking-widest">{t.admin.orders.statuses.processing}</SelectItem>
                        <SelectItem value="confirmed" className="text-[10px] uppercase font-bold tracking-widest">{t.admin.orders.statuses.confirmed}</SelectItem>
                        <SelectItem value="shipped" className="text-[10px] uppercase font-bold tracking-widest">{t.admin.orders.statuses.shipped}</SelectItem>
                        <SelectItem value="delivered" className="text-[10px] uppercase font-bold tracking-widest">{t.admin.orders.statuses.delivered}</SelectItem>
                        <SelectItem value="cancelled" className="text-[10px] uppercase font-bold tracking-widest">{t.admin.orders.statuses.cancelled}</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8 rtl:pl-8 rtl:pr-0">
              <DialogTitle className="font-display text-2xl text-primary">{t.admin.orders.details} {selectedOrder?.orderNumber}</DialogTitle>
              {selectedOrder && (
                <Badge className={cn("text-[10px] uppercase tracking-widest", getStatusColor(selectedOrder.fulfillmentStatus))}>
                  {t.admin.orders.statuses[selectedOrder.fulfillmentStatus]}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer & Shipping */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-foreground">{selectedOrder.customerName}</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t.admin.orders.shipping}</h3>
                    <p className="text-sm text-foreground leading-relaxed">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-6">
                  <Card className="bg-background/50 border-border shadow-none">
                    <CardHeader className="py-4">
                      <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatPrice(selectedOrder.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-500 uppercase text-[10px] font-bold">Free</span>
                      </div>
                      <Separator className="bg-border" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-primary font-display">Total</span>
                        <span className="text-foreground">{formatPrice(selectedOrder.total)}</span>
                      </div>
                      <div className="pt-2">
                        <Badge className={cn(
                          "w-full justify-center py-1 text-[10px] uppercase tracking-widest",
                          selectedOrder.paymentStatus === "paid" ? "bg-green-500 text-green-foreground" : "bg-yellow-500 text-yellow-foreground"
                        )}>
                          Payment: {t.admin.orders.statuses[selectedOrder.paymentStatus]}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.admin.orders.items}</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium text-center">Qty</th>
                        <th className="px-4 py-3 font-medium text-right rtl:text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-muted overflow-hidden border border-border">
                                <img src={item.image} alt="" className="h-full w-full object-cover" />
                              </div>
                              <span className="font-medium text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-center text-foreground font-bold">{item.quantity}</td>
                          <td className="px-4 py-3 text-right rtl:text-left font-bold text-foreground">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">{t.admin.orders.notes}</h3>
                  <p className="text-sm text-muted-foreground italic">"{selectedOrder.notes}"</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="bg-background border-border">
                  Close
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold">
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
