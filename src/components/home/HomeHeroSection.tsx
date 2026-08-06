"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import HeroBanners from "./HeroBanners";
import DailyHighlight from "./DailyHighlight";

export default function HomeHeroSection({ initialHighlights }: { initialHighlights: Product[] }) {
  const [highlights, setHighlights] = useState(initialHighlights);

  useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

  const hasHighlights = highlights.length > 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 lg:px-6">
      {hasHighlights ? (
        <div className="grid gap-4 lg:grid-cols-5 items-stretch">
          <div className="lg:col-span-4 h-full">
            <HeroBanners />
          </div>
          <div className="hidden lg:block h-full">
            <DailyHighlight products={highlights} onAllExpired={() => setHighlights([])} />
          </div>
        </div>
      ) : (
        <HeroBanners fullWidth />
      )}
    </div>
  );
}