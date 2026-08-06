import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { Star } from "lucide-react";

function PickCard({ product }: { product: Product }) {
  const price = product.sizes?.[0]?.price ?? product.price;
  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex flex-1 items-center gap-4 rounded-lg border border-border bg-white p-4 hover:border-navy hover:shadow-md transition-all"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-50">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium text-navy line-clamp-2 leading-snug">{product.name}</p>
        <div className="flex items-center gap-0.5 mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-accent-yellow text-accent-yellow" : "text-gray-200"}`} />
          ))}
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-bold text-red-500">{formatAED(price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">{formatAED(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PopularPicksSection({ items, banner }: { items: Product[]; banner: Product | null }) {
  if (items.length === 0 && !banner) return null;

  const [left1, left2, right1, right2] = items;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy">Popular Picks</h2>
        <Link href="/shop" className="text-sm font-medium text-navy hover:text-accent-yellow underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-stretch">
        <div className="flex flex-col gap-4 md:col-span-1">
          {left1 && <PickCard product={left1} />}
          {left2 && <PickCard product={left2} />}
        </div>

        {banner && (
          <Link
            href={`/product/${banner.slug}`}
            className="relative col-span-2 md:col-span-2 aspect-[4/3] md:aspect-auto md:h-auto overflow-hidden rounded-lg group"
          >
            <Image
              src={banner.image}
              alt={banner.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex h-full flex-col justify-center p-8">
              <p className="text-xs font-semibold tracking-widest text-white/80 uppercase">Best Offer Deal</p>
              <h3 className="mt-3 text-2xl font-extrabold text-white leading-tight">{banner.name}</h3>
              <p className="mt-3 text-base text-white/90">
                Starting at <span className="text-2xl font-bold text-accent-yellow">{formatAED(banner.price)}</span>
              </p>
              <span className="mt-5 inline-block w-fit rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white">
                Shop Now
              </span>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-4 md:col-span-1">
          {right1 && <PickCard product={right1} />}
          {right2 && <PickCard product={right2} />}
        </div>
      </div>
    </section>
  );
}