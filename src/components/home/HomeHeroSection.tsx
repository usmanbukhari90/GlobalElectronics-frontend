"use client";

import { useEffect, useState } from "react";
import { Product, HeroBanner } from "@/types";
import HeroBanners from "./HeroBanners";
import DailyHighlight from "./DailyHighlight";

export default function HomeHeroSection({
  initialHighlights,
  banners,
}: {
  initialHighlights: Product[];
  banners: HeroBanner[];
}) {
  const [highlights, setHighlights] = useState(initialHighlights);

  useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

  const hasHighlights = highlights.length > 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 lg:px-6">
      {hasHighlights ? (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:items-stretch">
          <div className="order-1 lg:order-2 lg:col-span-1 h-full">
            <DailyHighlight products={highlights} onAllExpired={() => setHighlights([])} />
          </div>
          <div className="order-2 lg:order-1 lg:col-span-4 h-full">
            <HeroBanners banners={banners} />
          </div>
        </div>
      ) : (
        <HeroBanners banners={banners} fullWidth />
      )}
    </div>
  );
}