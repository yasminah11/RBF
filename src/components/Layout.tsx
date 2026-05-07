import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Spacer for fixed header - adjusted height after removing announcement bar */}
      <div className="h-[80px] md:h-[120px]" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
