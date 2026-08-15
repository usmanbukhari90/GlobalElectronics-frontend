"use client";

import Link from "next/link";
import { CategoryInfo } from "@/types";
import { useRef } from "react";
import {
  Plug,
  Headphones,
  Laptop,
  Tv,
  Smartphone,
  Monitor,
  Projector,
  Volume2,
  Tablet,
  Watch,
  Tag,
  MonitorSpeaker,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof Plug> = {
  accessories: Plug,
  buds: Headphones,
  laptop: Laptop,
  "led-signage": MonitorSpeaker,
  mobile: Smartphone,
  monitors: Monitor,
  projectors: Projector,
  "sound-devices": Volume2,
  tablets: Tablet,
  "tv-av": Tv,
  watches: Watch,
  discounted: Tag,
};

function CategoryCard({ cat }: { cat: CategoryInfo }) {
  const Icon = CATEGORY_ICONS[cat.id] ?? Tag;
  return (
    <Link
      href={`/shop?category=${cat.id}`}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-3 w-24 shrink-0 hover:border-navy hover:shadow-md transition-all group text-center"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/5 group-hover:bg-navy transition-colors">
        <Icon className="h-5 w-5 text-navy group-hover:text-white transition-colors" />
      </div>
      <span className="text-[11px] font-medium text-gray-700 group-hover:text-navy leading-tight">
        {cat.label}
      </span>
    </Link>
  );
}

function CategoryMarqueeMobile({ categories }: { categories: CategoryInfo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  // duplicate the list so the loop from -50% back to 0% is seamless
  const loopCategories = [...categories, ...categories];

  return (
    <div className="sm:hidden overflow-hidden">
      <div
        ref={trackRef}
        onTouchStart={pause}
        onTouchEnd={resume}
        onMouseDown={pause}
        onMouseUp={resume}
        onMouseLeave={resume}
        className="flex gap-3 w-max category-marquee-track"
      >
        {loopCategories.map((cat, index) => (
          <CategoryCard key={`${cat.id}-${index}`} cat={cat} />
        ))}
      </div>

      <style>{`
        .category-marquee-track {
          animation: category-marquee-scroll 22s linear infinite;
        }
        @keyframes category-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function CategorySection({ categories }: { categories: CategoryInfo[] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
      <h2 className="text-xl font-bold text-navy mb-6">Shop by Category</h2>

      {/* Mobile: continuous right-to-left marquee */}
      <CategoryMarqueeMobile categories={categories} />

      {/* Tablet/Desktop: static grid, unchanged */}
      <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}