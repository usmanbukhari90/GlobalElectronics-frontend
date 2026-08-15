"use client";

import Link from "next/link";
import type { Route } from "next";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href: Route;
  dropdown?: { label: string; href: Route }[];
};

const navItems: NavItem[] = [
  { label: "Shop", href: "/shop" },
  {
    label: "TV & AV",
    href: "/shop?category=tv-av",
    dropdown: [
      { label: "All TVs", href: "/shop?category=tv-av" },
      { label: "Sony BRAVIA", href: "/shop?category=tv-av&brand=Sony" },
      { label: "Samsung", href: "/shop?category=tv-av&brand=Samsung" },
      { label: "LG OLED", href: "/shop?category=tv-av&brand=LG" },
      { label: "Philips", href: "/shop?category=tv-av&brand=Philips" },
    ],
  },
  {
    label: "Laptop",
    href: "/shop?category=laptop",
    dropdown: [
      { label: "All Laptops", href: "/shop?category=laptop" },
      { label: "Apple MacBook", href: "/shop?category=laptop&brand=Apple" },
      { label: "HP", href: "/shop?category=laptop&brand=HP" },
      { label: "Dell", href: "/shop?category=laptop&brand=Dell" },
      { label: "Lenovo", href: "/shop?category=laptop&brand=Lenovo" },
    ],
  },
  {
    label: "Mobile",
    href: "/shop?category=mobile",
    dropdown: [
      { label: "All Mobiles", href: "/shop?category=mobile" },
      { label: "Apple iPhone", href: "/shop?category=mobile&brand=Apple" },
      { label: "Samsung Galaxy", href: "/shop?category=mobile&brand=Samsung" },
      { label: "Huawei", href: "/shop?category=mobile&brand=Huawei" },
      { label: "Xiaomi", href: "/shop?category=mobile&brand=Xiaomi" },
    ],
  },
  { label: "Tablets", href: "/shop?category=tablets" },
  { label: "Monitors", href: "/shop?category=monitors" },
  {
    label: "More",
    href: "/shop",
    dropdown: [
      { label: "Buds & Earphones", href: "/shop?category=buds" },
      { label: "Sound Devices", href: "/shop?category=sound-devices" },
      { label: "Projectors", href: "/shop?category=projectors" },
      { label: "LED Signage", href: "/shop?category=led-signage" },
      { label: "Watches", href: "/shop?category=watches" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

export default function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-white shadow-sm">
     <div className="mx-auto flex max-w-[1400px] items-center px-6 lg:px-10">
        {/* Mobile hamburger */}
        <button
          className="mr-3 p-2 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-4 text-sm font-medium text-gray-700 hover:text-navy transition-colors whitespace-nowrap"
              >
                {item.label}
                {item.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>

              {item.dropdown && openDropdown === item.label && (
                <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-b-lg border border-border bg-white py-2 shadow-lg">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
          <Link href="/shop?minDiscount=25" className="py-4 text-[11px] sm:text-sm font-bold text-red-500 whitespace-nowrap hover:text-red-600">
            SUPER SALE
          </Link>
          <Link href="/shop?maxDiscount=30" className="py-4 text-[11px] sm:text-sm font-semibold text-orange-500 whitespace-nowrap hover:text-orange-600">
            FLASH DEALS
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 pb-4 lg:hidden">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block py-2.5 text-sm font-medium text-gray-700 hover:text-navy"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.dropdown && (
                <div className="pl-4">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block py-1.5 text-sm text-muted hover:text-navy"
                      onClick={() => setMobileOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
