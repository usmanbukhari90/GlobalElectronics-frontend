"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductCardDetail from "@/components/products/ProductCardDetail";
import { Product, CategoryInfo } from "@/types";
import { API_URL, getCategories } from "@/lib/api";
import { ChevronDown, X, SlidersHorizontal, Grid2x2, Grid3x3, List } from "lucide-react";

type ViewMode = "4" | "6" | "detail";

const VIEW_OPTIONS: { mode: ViewMode; icon: typeof Grid2x2; label: string }[] = [
  { mode: "4", icon: Grid2x2, label: "4 per row" },
  { mode: "6", icon: Grid3x3, label: "6 per row" },
  { mode: "detail", icon: List, label: "Detail view" },
];

const GRID_CLASSES: Record<ViewMode, string> = {
  "4": "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5",
  "6": "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4",
  detail: "flex flex-col",
};

// Bump this version string any time the underlying product data shape or
// calculation changes server-side (e.g. review stats logic) — this
// automatically invalidates all previously cached shop results.
const CACHE_VERSION = "v2";

function getCachedProducts(key: string): Product[] | null {
  try {
    const raw = sessionStorage.getItem(`shop-products:${CACHE_VERSION}:${key}`);
    return raw ? (JSON.parse(raw) as Product[]) : null;
  } catch {
    return null;
  }
}

function setCachedProducts(key: string, data: Product[]) {
  try {
    sessionStorage.setItem(`shop-products:${CACHE_VERSION}:${key}`, JSON.stringify(data));
  } catch {
    // sessionStorage can fail in private browsing / quota exceeded — safe to ignore
  }
}



function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const query = searchParams.get("q");
  const minDiscount = searchParams.get("minDiscount");
  const maxDiscount = searchParams.get("maxDiscount");

  const cacheKey = searchParams.toString();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOptionType>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("4");
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 10000]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

 // Fetch only if we don't already have cached results for this exact query.
 useEffect(() => {
  const cached = getCachedProducts(cacheKey);
  if (cached) {
    setProducts(cached);
    setLoading(false);
    if (cached.length > 0) {
      const prices = cached.map((p) => p.sizes?.[0]?.price ?? p.price);
      setPriceBounds([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
      setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
    }
    return;
  }

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (query) params.set("q", query);

  setLoading(true);
  fetch(`${API_URL}/api/products?${params}`)
    .then((r) => r.json())
    .then((data: Product[]) => {
      setCachedProducts(cacheKey, data);
      setProducts(data);
      if (data.length > 0) {
        const prices = data.map((p) => p.sizes?.[0]?.price ?? p.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceBounds([min, max]);
        setPriceRange([min, max]);
      }
    })
    .catch(() => setProducts([]))
    .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [cacheKey]);

// Scroll position is now handled natively by Next.js's Router Cache
  // (see experimental.staleTimes in next.config.ts) — no manual code needed.

  function discountOf(p: Product): number {
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }

  const filteredSorted = useMemo(() => {
    let result = products.filter((p) => {
      const price = p.sizes?.[0]?.price ?? p.price;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      const discount = discountOf(p);
      if (minDiscount && discount < Number(minDiscount)) return false;
      if (maxDiscount && discount >= Number(maxDiscount)) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => (a.sizes?.[0]?.price ?? a.price) - (b.sizes?.[0]?.price ?? b.price));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => (b.sizes?.[0]?.price ?? b.price) - (a.sizes?.[0]?.price ?? a.price));
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
    return result;
  }, [products, priceRange, sort]);

  function setCategoryParam(catId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) params.set("category", catId);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
    setCategoryOpen(false);
  }

  function clearAll() {
    router.push("/shop");
    setPriceRange(priceBounds);
    setSort("popularity");
  }

  const title = minDiscount
    ? "Super Sale"
    : maxDiscount
      ? "Flash Deals"
      : brand
        ? `${brand} Products`
        : category
          ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : query
            ? `Results for "${query}"`
            : "All Products";

  const currentCategoryInfo = categories.find((c) => c.id === category);
  const hasActiveFilters = !!category || !!brand || !!query;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-2">{title}</h1>

      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4 mb-6">
        <p className="text-sm text-muted mr-auto">{filteredSorted.length} results in total</p>

        <div className="relative">
          <button
            onClick={() => { setCategoryOpen((v) => !v); setSortOpen(false); }}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-navy"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {currentCategoryInfo ? `${currentCategoryInfo.label} (${currentCategoryInfo.count ?? 0})` : "All Categories"}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {categoryOpen && (
            <div className="absolute right-0 z-20 mt-1 w-64 max-h-72 overflow-y-auto rounded-md border border-border bg-white shadow-lg">
              <button
                onClick={() => setCategoryParam(null)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-border font-medium"
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryParam(c.id)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${category === c.id ? "bg-gray-100 font-medium" : ""}`}
                >
                  {c.label} ({c.count ?? 0})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <span className="text-muted">Price:</span>
          <input
            type="number"
            value={priceRange[0]}
            min={priceBounds[0]}
            max={priceRange[1]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-16 border-0 p-0 text-sm focus:outline-none focus:ring-0"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            value={priceRange[1]}
            min={priceRange[0]}
            max={priceBounds[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-16 border-0 p-0 text-sm focus:outline-none focus:ring-0"
          />
          <span className="text-muted">د.إ</span>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border p-1">
          {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              aria-label={label}
              className={`rounded p-1.5 transition-colors ${
                viewMode === mode ? "bg-navy text-white" : "text-gray-400 hover:text-navy"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => { setSortOpen((v) => !v); setCategoryOpen(false); }}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-navy"
          >
            Sort by: <span className="font-semibold">{SORT_LABELS[sort]}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 z-20 mt-1 w-52 rounded-md border border-border bg-white shadow-lg">
              {(Object.keys(SORT_LABELS) as SortOptionType[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSort(opt); setSortOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sort === opt ? "font-semibold" : ""}`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {category && currentCategoryInfo && (
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm">
              {currentCategoryInfo.label}
              <button onClick={() => setCategoryParam(null)} aria-label="Remove category filter">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {brand && (
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm">
              {brand}
              <button onClick={() => router.push("/shop")} aria-label="Remove brand filter">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-navy-light"
          >
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted py-12">Loading products...</p>
      ) : filteredSorted.length === 0 ? (
        <p className="text-muted">No products found. Try a different search or filter.</p>
      ) : (
        <div className={GRID_CLASSES[viewMode]}>
          {filteredSorted.map((product) =>
            viewMode === "detail" ? (
              <ProductCardDetail key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            )
          )}
        </div>
      )}
    </div>
  );
}

type SortOptionType = "popularity" | "rating" | "price-asc" | "price-desc" | "newest";

const SORT_LABELS: Record<SortOptionType, string> = {
  popularity: "Popularity",
  rating: "Average Rating",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  newest: "Newest",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}