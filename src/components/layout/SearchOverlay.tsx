"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Product, CategoryInfo } from "@/types";
import { API_URL, getCategories } from "@/lib/api";
import { formatAED } from "@/lib/constants";
import { useSearchOverlayStore } from "@/lib/searchOverlayStore";

const TRENDING_SEARCHES = ["iPhone 15", "MacBook Air", "Smart TV", "AirPods", "Apple Watch"];

function ResultTile({ product, highlight }: { product: Product; highlight: string }) {
  const price = product.sizes?.[0]?.price ?? product.price;
  const parts = product.name.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <Link
      href={`/product/${product.slug}`}
      className="block group"
      onClick={() => useSearchOverlayStore.getState().setOpen(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="220px" />
      </div>
      <p className="mt-2 text-sm text-gray-800 line-clamp-2 leading-snug">
        {parts.map((part, i) =>
          highlight && part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-accent-yellow/60 text-inherit">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
      <p className="mt-1 text-sm font-semibold text-navy">{formatAED(price)}</p>
    </Link>
  );
}

function SkeletonTile() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-lg bg-gray-200" />
      <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
      <div className="mt-1.5 h-3 w-1/3 rounded bg-gray-200" />
    </div>
  );
}

export default function SearchOverlay() {
  const router = useRouter();
  const { open, query, setOpen, setQuery } = useSearchOverlayStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Measure the header+nav wrapper's actual height so the panel can fill
  // exactly the remaining viewport height below it, matching the reference site.
  useEffect(() => {
    function updateHeight() {
      const wrapper = panelRef.current?.parentElement;
      if (wrapper) {
        document.documentElement.style.setProperty("--nav-bottom", `${wrapper.getBoundingClientRect().bottom}px`);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [open]);

  const [popular, setPopular] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (popular.length === 0) {
      fetch(`${API_URL}/api/products`)
        .then((r) => r.json())
        .then((data: Product[]) => setPopular([...data].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)))
        .catch(() => setPopular([]));
    }
    if (categories.length === 0) {
      getCategories().then(setCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`${API_URL}/api/products?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data: Product[]) => setResults(data.slice(0, 10)))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest("form")) setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const matchedCategoryIds = Array.from(new Set(results.map((p) => p.category)));
  const matchedCategories = categories.filter((c) => matchedCategoryIds.includes(c.id));
  const suggestions = matchedCategories.slice(0, 5).map((c) => `${query} ${c.label.toLowerCase()}`);

  function goToCategory(catId: string) {
    setOpen(false);
    router.push(`/shop?category=${catId}`);
  }

  function goToFullResults() {
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div
      ref={panelRef}
      className="absolute inset-x-0 top-full z-40 min-h-[calc(100vh-var(--nav-bottom,180px))] overflow-y-auto bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
          {!query.trim() ? (
            <>
              <h3 className="text-sm font-semibold text-navy mb-3">Trending Search</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-gray-600 hover:border-navy hover:text-navy transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-navy mb-4">Popular Products</h3>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                {popular.length === 0
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonTile key={i} />)
                  : popular.map((p) => <ResultTile key={p.id} product={p} highlight="" />)}
              </div>
            </>
          ) : loading ? (
            <div className="grid grid-cols-[180px_1fr] gap-8">
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
              <div>
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200 mb-3" />
                <div className="flex gap-2 mb-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTile key={i} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr]">
              <div>
                <h3 className="text-sm font-semibold text-navy mb-3">Categories</h3>
                <div className="space-y-2">
                  {matchedCategories.length === 0 ? (
                    <p className="text-sm text-muted">No matching categories.</p>
                  ) : (
                    matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => goToCategory(c.id)}
                        className="block text-sm text-gray-600 hover:text-navy hover:underline"
                      >
                        {c.label.toUpperCase()}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted mb-4">
                  Search for &quot;<span className="font-semibold text-navy">{query}</span>&quot;
                </p>

                {suggestions.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-navy mb-2">Suggestions</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="rounded-full border border-border px-3 py-1 text-sm text-gray-600 hover:border-navy hover:text-navy transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {results.length === 0 ? (
                  <p className="text-sm text-muted">No products found for &quot;{query}&quot;</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                      {results.slice(0, 5).map((p) => (
                        <ResultTile key={p.id} product={p} highlight={query} />
                      ))}
                    </div>
                    <button
                      onClick={goToFullResults}
                      className="mt-6 text-sm font-medium text-navy hover:underline"
                    >
                      See all {results.length} results →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
       </div>
    </div>
  );
}