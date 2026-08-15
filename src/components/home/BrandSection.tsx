"use client";

import Link from "next/link";
import { BrandInfo } from "@/types";
import { useState, useRef } from "react";

const LOGO_SIZE_OVERRIDES: Record<string, string> = {
  Philips: "h-9 max-w-[100px]",
};

function BrandLogo({ brand }: { brand: BrandInfo }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoClass = LOGO_SIZE_OVERRIDES[brand.id] ?? "h-14 max-w-[130px]";

  return (
    <Link
      href={`/shop?brand=${encodeURIComponent(brand.id)}`}
      className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-3 h-28 w-28 shrink-0 hover:border-navy hover:shadow-md transition-all group"
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

function BrandMarqueeMobile({ brands }: { brands: BrandInfo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  // duplicate the list so the loop from -50% back to 0% is seamless
  const loopBrands = [...brands, ...brands];

  return (
    <div className="sm:hidden overflow-hidden">
      <div
        ref={trackRef}
        onTouchStart={pause}
        onTouchEnd={resume}
        onMouseDown={pause}
        onMouseUp={resume}
        onMouseLeave={resume}
        className="flex gap-3 w-max brand-marquee-track"
      >
        {loopBrands.map((brand, index) => (
          <BrandLogo key={`${brand.id}-${index}`} brand={brand} />
        ))}
      </div>

      <style>{`
        .brand-marquee-track {
          animation: brand-marquee-scroll 22s linear infinite;
        }
        @keyframes brand-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
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

      {/* Mobile: continuous right-to-left marquee */}
      <BrandMarqueeMobile brands={brands} />

      {/* Tablet/Desktop: static grid, unchanged */}
      <div className="hidden sm:grid sm:grid-cols-5 md:grid-cols-10 gap-3">
        {brands.map((brand) => (
          <BrandLogo key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
}