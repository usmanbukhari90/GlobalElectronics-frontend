"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminAuth";
import { Product } from "@/types";
import { Trash2, LayoutGrid } from "lucide-react";

function ProductPicker({
  allProducts,
  onPick,
}: {
  allProducts: Product[];
  onPick: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md border border-border px-3 py-2 text-sm"
      />
      {search && (
        <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-border">
          {filtered.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onPick(p.id);
                setSearch("");
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-border last:border-0"
            >
              {p.name} <span className="text-muted">— {p.brand}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="px-3 py-2 text-sm text-muted">No matching products.</p>}
        </div>
      )}
    </div>
  );
}

export default function HomepageSectionsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pickItems, setPickItems] = useState<Product[]>([]);
  const [pickBanner, setPickBanner] = useState<Product | null>(null);
  const [savings, setSavings] = useState<Product[]>([]);

  useEffect(() => {
    load();
  }, []);

  function load() {
    adminFetch<Product[]>("/api/products").then(setAllProducts);
    adminFetch<{ items: Product[]; banner: Product | null }>("/api/products/popular-picks").then((d) => {
      setPickItems(d.items);
      setPickBanner(d.banner);
    });
    adminFetch<Product[]>("/api/products/big-savings").then(setSavings);
  }

  async function addPick(id: string) {
    if (pickItems.length >= 4) return alert("Maximum 4 grid products already selected. Remove one first.");
    await adminFetch(`/api/products/${id}/popular-pick`, { method: "POST", body: JSON.stringify({}) });
    load();
  }
  async function removePick(id: string) {
    await adminFetch(`/api/products/${id}/popular-pick`, { method: "DELETE" });
    load();
  }
  async function setBanner(id: string) {
    await adminFetch(`/api/products/${id}/popular-pick`, { method: "POST", body: JSON.stringify({ asBanner: true }) });
    load();
  }
  async function removeBanner(id: string) {
    await adminFetch(`/api/products/${id}/popular-pick?banner=true`, { method: "DELETE" });
    load();
  }
  async function addSaving(id: string) {
    await adminFetch(`/api/products/${id}/big-savings`, { method: "POST" });
    load();
  }
  async function removeSaving(id: string) {
    await adminFetch(`/api/products/${id}/big-savings`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1 flex items-center gap-2">
        <LayoutGrid className="h-6 w-6" />
        Homepage Sections
      </h1>
      <p className="text-sm text-muted mb-8">Manage the "Popular Picks" and "Small Prices Big Savings" sections shown on the homepage.</p>

      <div className="rounded-lg border border-border bg-white p-5 mb-8 max-w-xl">
        <h2 className="font-semibold text-navy mb-1">Popular Picks — Center Banner (1 product)</h2>
        <p className="text-xs text-muted mb-3">The large featured banner in the middle of the grid.</p>
        {pickBanner ? (
          <div className="flex items-center justify-between rounded-md border border-border p-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pickBanner.image} alt="" className="h-10 w-10 rounded object-cover" />
              <p className="text-sm">{pickBanner.name}</p>
            </div>
            <button onClick={() => removeBanner(pickBanner.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <ProductPicker allProducts={allProducts} onPick={setBanner} />
        )}
      </div>

      <div className="rounded-lg border border-border bg-white p-5 mb-8 max-w-xl">
        <h2 className="font-semibold text-navy mb-1">Popular Picks — Grid Products ({pickItems.length}/4)</h2>
        <p className="text-xs text-muted mb-3">The 4 smaller product cards surrounding the banner.</p>
        <div className="space-y-2 mb-3">
          {pickItems.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border p-2">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                <p className="text-sm">{p.name}</p>
              </div>
              <button onClick={() => removePick(p.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {pickItems.length < 4 && <ProductPicker allProducts={allProducts} onPick={addPick} />}
      </div>

      <div className="rounded-lg border border-border bg-white p-5 max-w-xl">
        <h2 className="font-semibold text-navy mb-1">Small Prices Big Savings (rotating carousel)</h2>
        <p className="text-xs text-muted mb-3">Add as many products as you like — they'll rotate automatically on the homepage.</p>
        <div className="space-y-2 mb-3">
          {savings.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border p-2">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                <p className="text-sm">{p.name}</p>
              </div>
              <button onClick={() => removeSaving(p.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {savings.length === 0 && <p className="text-sm text-muted">No products added yet.</p>}
        </div>
        <ProductPicker allProducts={allProducts} onPick={addSaving} />
      </div>
    </div>
  );
}