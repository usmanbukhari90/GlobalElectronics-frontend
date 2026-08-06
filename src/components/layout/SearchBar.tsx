"use client";

import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useSearchOverlayStore } from "@/lib/searchOverlayStore";

export default function SearchBar() {
  const router = useRouter();
  const { open, query, setOpen, setQuery } = useSearchOverlayStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="I'm looking for..."
          autoComplete="off"
          className="w-full rounded-full bg-white py-2.5 pl-11 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}