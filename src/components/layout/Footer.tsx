import Link from "next/link";
import { SHOP_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-12">
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-3">{SHOP_INFO.name}</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {SHOP_INFO.tagline}. Your trusted electronics partner in Dubai,
              UAE.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/shop" className="hover:text-accent-yellow">
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=tv-av"
                  className="hover:text-accent-yellow"
                >
                  TV & AV
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=laptop"
                  className="hover:text-accent-yellow"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=mobile"
                  className="hover:text-accent-yellow"
                >
                  Mobile
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=tablets"
                  className="hover:text-accent-yellow"
                >
                  Tablets
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=monitors"
                  className="hover:text-accent-yellow"
                >
                  Monitors
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=discounted"
                  className="hover:text-accent-yellow"
                >
                  Discounted
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/order/track" className="hover:text-accent-yellow">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-accent-yellow">
                  View Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-accent-yellow">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-yellow">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{SHOP_INFO.address}</li>
              <li>{SHOP_INFO.phone}</li>
              <li>{SHOP_INFO.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {SHOP_INFO.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
