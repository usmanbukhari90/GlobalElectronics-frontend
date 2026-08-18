"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, User, ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";

const NAV_ITEMS: { label: string; href: Route; icon: typeof Home }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Account", href: "/account", icon: User },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeCounts: Record<string, number> = {
    "/wishlist": wishlistCount,
    "/cart": cartCount,
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-border bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)] lg:hidden"
      aria-label="Mobile bottom navigation"
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        const count = badgeCounts[href] ?? 0;
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold transition-colors ${
              active ? "text-navy" : "text-black hover:text-navy"
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2.25} />
              {mounted && count > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </div>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}