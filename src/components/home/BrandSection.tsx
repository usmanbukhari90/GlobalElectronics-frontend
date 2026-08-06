"use client";

import Link from "next/link";
import { BrandInfo } from "@/types";
import { useState } from "react";

const LOGO_SIZE_OVERRIDES: Record<string, string> = {
  Philips: "h-9 max-w-[100px]",
};

function BrandLogo({ brand }: { brand: BrandInfo }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoClass = LOGO_SIZE_OVERRIDES[brand.id] ?? "h-14 max-w-[130px]";

  return (
    <Link
      href={`/shop?brand=${encodeURIComponent(brand.id)}`}
      className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-3 h-28 hover:border-navy hover:shadow-md transition-all group"
    >
      {!imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo}
          alt={brand.name}
          className={`${logoClass} object-contain group-hover:scale-105 transition-transform`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-sm font-bold text-navy">{brand.name}</span>
      )}
  
    </Link>
  );
}

export default function BrandSection({ brands }: { brands: BrandInfo[] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-navy">Search by Brand</h2>
        <Link href="/shop" className="text-sm text-navy hover:text-accent-yellow">
          Check All Brands →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-10">
        {brands.map((brand) => (
          <BrandLogo key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
}
