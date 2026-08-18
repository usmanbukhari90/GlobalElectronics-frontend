"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Heart, ShoppingCart, Tv, LayoutDashboard } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatAED, SHOP_INFO } from "@/lib/constants";
import { isLoggedIn } from "@/lib/adminAuth";
import { useCustomerAuth } from "@/lib/useCustomerAuth";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import SearchBar from "@/components/layout/SearchBar";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useCustomerAuth();
  const cartTotal = useCartStore((s) => s.getTotal());
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    setMounted(true);
    setIsAdmin(isLoggedIn());
  }, []);

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

    return (
      <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 pt-3 pb-2 lg:gap-6 lg:px-6 lg:py-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 lg:h-12 lg:w-12">
              <Tv className="h-6 w-6 text-white lg:h-7 lg:w-7" />
            </div>
            <div className="block">
              <div className="text-sm font-bold tracking-wide lg:text-lg">{SHOP_INFO.name}</div>
              <div className="text-[9px] tracking-wider text-white/70 uppercase lg:text-[10px]">
                {SHOP_INFO.tagline}
              </div>
            </div>
          </Link>
  
          {/* Search — desktop/tablet only, sits inline here. On mobile it moves
              to its own row below the header (rendered further down). */}
          <div className="hidden lg:block lg:flex-1">
            <SearchBar />
          </div>
  
         {/* Actions */}
         <div className="ml-auto flex shrink-0 items-center gap-4 lg:ml-0 lg:gap-6">
          <Link
            href={mounted && user ? "/account" : "/login"}
            className="hidden items-center gap-1.5 text-sm hover:text-accent-yellow transition-colors md:flex"
          >
            <User className="h-5 w-5" />
            <span>{mounted && user ? `Hi, ${displayName}` : "Login"}</span>
          </Link>

          <Link
            href="/wishlist"
            className="relative flex items-center gap-1.5 text-sm hover:text-accent-yellow transition-colors"
          >
            <Heart className="h-5 w-5" />
            {mounted && (
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
              {mounted && (
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

      {/* Search — mobile/tablet only, own row below the header, above Navigation */}
      <div className="px-4 pb-3 pt-0 lg:hidden">
        <div className="mx-auto max-w-[1400px] text-sm">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}