"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminAuth";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { Flame, Trash2 } from "lucide-react";

const DURATION_PRESETS = [
  { label: "3 Hours", hours: 3 },
  { label: "12 Hours", hours: 12 },
  { label: "1 Day", hours: 24 },
  { label: "3 Days", hours: 72 },
  { label: "5 Days", hours: 120 },
  { label: "7 Days", hours: 168 },
];

export default function HotDealsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [hours, setHours] = useState(24);
  const [customHours, setCustomHours] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    adminFetch<Product[]>("/api/products").then(setAllProducts);
    adminFetch<Product[]>("/api/products/highlights").then(setActive);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!selectedId) {
      setError("Please select a product");
      return;
    }
    const finalHours = useCustom ? Number(customHours) : hours;
    if (!finalHours || finalHours <= 0) {
      setError("Please enter a valid duration");
      return;
    }
    setSaving(true);
    try {
      await adminFetch(`/api/products/${selectedId}/highlight`, {
        method: "POST",
        body: JSON.stringify({ hours: finalHours }),
      });
      setSelectedId("");
      setSearch("");
      load();
    } catch {
      setError("Failed to add hot deal");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this product from Hot Deals?")) return;
    await adminFetch(`/api/products/${id}/highlight`, { method: "DELETE" });
    load();
  }

  const filtered = allProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && !active.some((a) => a.id === p.id)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1 flex items-center gap-2">
        <Flame className="h-6 w-6 text-orange-500" />
        Hot Deals
      </h1>
      <p className="text-sm text-muted mb-6">
        Products added here appear in the homepage "Daily Highlight" card until their timer runs out. Add multiple products to rotate between them automatically.
      </p>

      <div className="rounded-lg border border-border bg-white p-5 mb-8 max-w-xl">
        <h2 className="font-semibold text-navy mb-4">Add a Product to Hot Deals</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search product</label>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedId("");
              }}
              placeholder="Type to search..."
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            {search && !selectedId && (
              <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-border">
                {filtered.slice(0, 8).map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      setSelectedId(p.id);
                      setSearch(p.name);
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

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((d) => (
                <button
                  type="button"
                  key={d.hours}
                  onClick={() => {
                    setHours(d.hours);
                    setUseCustom(false);
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                    !useCustom && hours === d.hours ? "bg-navy text-white border-navy" : "border-border hover:border-navy"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustom(true)}
                className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                  useCustom ? "bg-navy text-white border-navy" : "border-border hover:border-navy"
                }`}
              >
                Custom
              </button>
            </div>
            {useCustom && (
              <input
                type="number"
                min={1}
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                placeholder="Enter hours (e.g. 48)"
                className="mt-2 w-40 rounded-md border border-border px-3 py-2 text-sm"
              />
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add to Hot Deals"}
          </button>
        </form>
      </div>

      <h2 className="font-semibold text-navy mb-4">Currently Active ({active.length})</h2>
      {active.length === 0 ? (
        <p className="text-sm text-muted">No active hot deals. Hero banners are currently full width on the homepage.</p>
      ) : (
        <div className="space-y-2 max-w-xl">
          {active.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-white p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {formatAED(p.price)} · Ends {p.highlightExpiresAt ? new Date(p.highlightExpiresAt).toLocaleString() : ""}
                  </p>
                </div>
              </div>
              <button onClick={() => handleRemove(p.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}