import Link from "next/link";
import Image from "next/image";
import { SHOP_INFO } from "@/lib/constants";
export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-12">
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
    <div>
    <div className="relative z-10 h-16 w-full">
              <Image
                src="/images/logo.png"
                alt={`${SHOP_INFO.name} — ${SHOP_INFO.tagline}`}
                width={400}
                height={218}
                className="absolute -left-6 -top-14 h-44 w-auto"
              />
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
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
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} {SHOP_INFO.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/50 sm:justify-start">
              <Link href="/privacy-policy" target="_blank" className="hover:text-accent-yellow">Privacy Policy</Link>
              <Link href="/terms-conditions" target="_blank" className="hover:text-accent-yellow">Terms & Conditions</Link>
              <Link href="/cookies-policy" target="_blank" className="hover:text-accent-yellow">Cookies Policy</Link>
              <Link href="/developer" target="_blank" className="hover:text-accent-yellow">Website by Gate Developers</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { name: "Apple Pay", src: "/payments/apple-pay.svg" },
              { name: "Google Pay", src: "/payments/google-pay.svg" },
              { name: "Mastercard", src: "/payments/mastercard.svg" },
              { name: "Visa", src: "/payments/visa.svg" },
              { name: "PayPal", src: "/payments/paypal.svg" },
            ].map((method) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={method.name}
                src={method.src}
                alt={method.name}
                className="h-8 w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
