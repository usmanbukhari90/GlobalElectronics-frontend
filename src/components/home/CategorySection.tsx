import Link from "next/link";
import { CategoryInfo } from "@/types";
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

export default function CategorySection({ categories }: { categories: CategoryInfo[] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
      <h2 className="text-xl font-bold text-navy mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] ?? Tag;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-3 hover:border-navy hover:shadow-md transition-all group text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/5 group-hover:bg-navy transition-colors">
                <Icon className="h-5 w-5 text-navy group-hover:text-white transition-colors" />
              </div>
              <span className="text-[11px] font-medium text-gray-700 group-hover:text-navy leading-tight">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}