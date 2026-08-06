"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingCart, Tv, Bell, LayoutDashboard } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatAED, SHOP_INFO } from "@/lib/constants";
import { isLoggedIn } from "@/lib/adminAuth";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import SearchBar from "@/components/layout/SearchBar";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const cartTotal = useCartStore((s) => s.getTotal());
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    setMounted(true);
    setIsAdmin(isLoggedIn());
  }, []);
  return (
    <header className="bg-navy text-white">
    <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
            <Tv className="h-7 w-7 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-bold tracking-wide">{SHOP_INFO.name}</div>
            <div className="text-[10px] tracking-wider text-white/70 uppercase">
              {SHOP_INFO.tagline}
            </div>
          </div>
        </Link>
//TODO: Add a search bar

        {/* Search */}
        <SearchBar />

       {/* Actions */}
       <div className="flex shrink-0 items-center gap-4 lg:gap-6">
          <Link
            href="/login"
            className="hidden items-center gap-1.5 text-sm hover:text-accent-yellow transition-colors md:flex"
          >
            <User className="h-5 w-5" />
            <span>Login</span>
          </Link>

          <Link
            href="/wishlist"
            className="relative flex items-center gap-1.5 text-sm hover:text-accent-yellow transition-colors"
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm hover:text-accent-yellow transition-colors"
          >
            <div className="relative">
            <ShoppingCart className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="font-medium">Cart</div>
              <div className="text-xs text-white/70">{formatAED(mounted ? cartTotal : 0)}</div>
            </div>
          </Link>

         {/* Admin notification bell — only visible to logged-in admin */}
         {mounted && isAdmin && <AdminNotificationBell />}

{/* Admin dashboard shortcut — only visible to logged-in admin */}
{mounted && isAdmin && (
  <Link
    href="/admin"
    className="flex items-center hover:text-accent-yellow transition-colors"
    aria-label="Admin Dashboard"
    title="Back to Admin Dashboard"
  >
    <LayoutDashboard className="h-5 w-5" />
  </Link>
)}
</div>
      </div>
    </header>
  );
}