import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n/I18nContext";
import { Layout } from "@/components/Layout";
import { InfoLayout } from "@/components/InfoLayout";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import ReturnRules from "./pages/ReturnRules";

// Admin Imports
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { AdminLogin } from "./features/admin/pages/AdminLogin";
import { DashboardOverview } from "./features/admin/pages/DashboardOverview";
import { ProductsManager } from "./features/admin/pages/ProductsManager";
import { OrdersManager } from "./features/admin/pages/OrdersManager";
import { CategoriesManager } from "./features/admin/pages/CategoriesManager";
import { SubscribersManager } from "./features/admin/pages/SubscribersManager";
import { AdminSettings } from "./features/admin/pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="subscribers" element={<SubscribersManager />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
            </Route>

            {/* Informational Routes */}
            <Route element={<InfoLayout />}>
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/returns" element={<ReturnRules />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);
export default App;

