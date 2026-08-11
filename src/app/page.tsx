export const dynamic = "force-dynamic";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import BrandSection from "@/components/home/BrandSection";
import CategorySection from "@/components/home/CategorySection";
import HomeHeroSection from "@/components/home/HomeHeroSection";
import PopularPicksSection from "@/components/home/PopularPicksSection";
import BigSavingsSection from "@/components/home/BigSavingsSection";
import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import {
  getProducts,
  getCategories,
  getBrands,
  getDailyHighlights,
  getPopularPicks,
  getBigSavings,
  getHeroBanners,
} from "@/lib/api";

export default async function HomePage() {
  const [products, categories, brands, highlights, popularPicks, bigSavings, heroBanners] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getDailyHighlights(),
    getPopularPicks(),
    getBigSavings(),
    getHeroBanners(),
  ]);

  const featured = products.slice(0, 8);

  return (
    <>
      <HomeHeroSection initialHighlights={highlights} banners={heroBanners} />

      <PopularPicksSection items={popularPicks.items} banner={popularPicks.banner} />
      <BrandSection brands={brands} />
      <BigSavingsSection products={bigSavings} />
      <CategorySection categories={categories} />

      <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy">Featured Products</h2>
          <Link href="/shop" className="text-sm font-medium text-navy hover:text-accent-yellow">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-10 border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {[
              { icon: Truck, title: "Free Delivery", desc: "Across Dubai & UAE" },
              { icon: ShieldCheck, title: "1 Year Warranty", desc: "On all new products" },
              { icon: RotateCcw, title: "Easy Returns", desc: "14-day return policy" },
              { icon: Headset, title: "Expert Support", desc: "TV repair professionals" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border">
                  <Icon className="h-5 w-5 text-navy" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{title}</h3>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}