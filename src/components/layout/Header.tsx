"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User, Heart, ShoppingCart, LayoutDashboard } from "lucide-react";
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
                        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 lg:h-16 lg:gap-6 lg:px-6">
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/images/logo.png"
              alt={`${SHOP_INFO.name} — ${SHOP_INFO.tagline}`}
              className="h-8 w-auto lg:h-10"
            />
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