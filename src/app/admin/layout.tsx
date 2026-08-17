"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { isLoggedIn, clearToken } from "@/lib/adminAuth";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Flame, LayoutGrid, MessageSquare, Image as ImageIcon, Megaphone } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !isLoggedIn()) {
      router.push("/admin/login");
    } else {
      setChecked(true);
    }
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (!checked) return null;

  function handleLogout() {
    clearToken();
    router.push("/admin/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/hot-deals", label: "Hot Deals", icon: Flame },
    { href: "/admin/homepage-sections", label: "Homepage Sections", icon: LayoutGrid },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/hero-banners", label: "Homepage Banners", icon: ImageIcon },
    { href: "/admin/announcements", label: "Announcement Bar", icon: Megaphone },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 shrink-0 bg-navy text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="font-bold text-sm">KANZ ELECTRONICS</div>
          <div className="text-[10px] text-white/60 uppercase tracking-wider">Admin Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href as Route}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === href ? "bg-white/10 font-semibold" : "hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 m-3 rounded-md px-3 py-2 text-sm hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}