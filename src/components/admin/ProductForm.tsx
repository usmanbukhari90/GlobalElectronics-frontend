"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, getToken } from "@/lib/adminAuth";
import { getCategories, getBrands } from "@/lib/api";
import { Product, CategoryInfo, BrandInfo } from "@/types";
import { X, Upload } from "lucide-react";

interface Props {
  initial?: Partial<Product>;
  mode: "create" | "edit";
}

export default function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [useCustomBrand, setUseCustomBrand] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [sizes, setSizes] = useState<{ label: string; price: string; originalPrice: string; inStock: boolean }[]>(
    initial?.sizes?.map((s) => ({
      label: s.label,
      price: s.price.toString(),
      originalPrice: s.originalPrice?.toString() ?? "",
      inStock: s.inStock,
    })) ?? []
  );
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      if (!initial?.category) setCategory(data[0]?.id ?? "");
    });
    getBrands().then((data) => {
        setBrands(data);
        if (initial?.brand && !data.some((b) => b.id === initial.brand)) {
          setUseCustomBrand(true);
          setCustomBrand(initial.brand);
        } else if (!initial?.brand) {
          setBrand(data[0]?.id ?? "");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [colorSwatches, setColorSwatches] = useState<{ name: string; hex: string }[]>(
    initial?.colorSwatches ?? (initial?.colors?.map((c) => ({ name: c, hex: "#000000" })) ?? [])
  );
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initial?.specs ? Object.entries(initial.specs).map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (mode === "create") {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    if (images.length + files.length > 5) {
      setError("Maximum 5 images per product");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("images", f));
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImages((prev) => [...prev, ...data.urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSpec(index: number, field: "key" | "value", val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function addSpecRow() {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeSpecRow(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !slug || !price || images.length === 0) {
      setError("Name, slug, price, and at least one image are required");
      return;
    }

    setSaving(true);
    try {
      const specsObj: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim();
      });

      const finalBrand = useCustomBrand ? customBrand.trim() : brand;
      if (!finalBrand) {
        setError("Brand is required");
        setSaving(false);
        return;
      }

      const validSizes = sizes
      .filter((s) => s.label.trim() && s.price)
      .map((s) => ({
        label: s.label.trim(),
        price: Number(s.price),
        originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined,
        inStock: s.inStock,
      }));

    const validColorSwatches = colorSwatches.filter((c) => c.name.trim());

      const payload = {
        id: initial?.id,
        name,
        slug,
        category,
        brand: finalBrand,
        price: Number(price),
        sizes: validSizes.length > 0 ? validSizes : undefined,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        description,
        images,
        inStock,
        rating: initial?.rating ?? 0,
        reviewCount: initial?.reviewCount ?? 0,
        specs: specsObj,
        colors: validColorSwatches.length > 0 ? validColorSwatches.map((c) => c.name) : undefined,
        colorSwatches: validColorSwatches.length > 0 ? validColorSwatches : undefined,
      };

      if (mode === "create") {
        await adminFetch("/api/products", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await adminFetch(`/api/products/${initial?.id}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Product["category"])} className="w-full rounded-md border border-border px-3 py-2 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          {!useCustomBrand ? (
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm">
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          ) : (
            <input
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              placeholder="Enter brand name"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          )}
          <button
            type="button"
            onClick={() => setUseCustomBrand((v) => !v)}
            className="mt-1 text-xs text-navy hover:underline"
          >
            {useCustomBrand ? "← Choose from existing brands" : "Brand not listed? Type it manually"}
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (AED)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
          <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        </div>
        </div>

      <div>
        <label className="block text-sm font-medium mb-2">Available Colors (optional)</label>
        <div className="space-y-2">
          {colorSwatches.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="color"
                value={c.hex}
                onChange={(e) => setColorSwatches((prev) => prev.map((row, idx) => (idx === i ? { ...row, hex: e.target.value } : row)))}
                className="h-9 w-12 rounded border border-border cursor-pointer"
              />
              <input
                placeholder="Color name (e.g. Rose Gold)"
                value={c.name}
                onChange={(e) => setColorSwatches((prev) => prev.map((row, idx) => (idx === i ? { ...row, name: e.target.value } : row)))}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => setColorSwatches((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-600 px-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setColorSwatches((prev) => [...prev, { name: "", hex: "#000000" }])}
          className="mt-2 text-sm text-navy hover:underline"
        >
          + Add color
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Sizes / Variants (optional — leave empty for products with one fixed price)
        </label>
        <div className="space-y-2">
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                placeholder='Label (e.g. 13", 256GB)'
                value={s.label}
                onChange={(e) => setSizes((prev) => prev.map((row, idx) => (idx === i ? { ...row, label: e.target.value } : row)))}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
             <input
                type="number"
                placeholder="Selling price"
                value={s.price}
                onChange={(e) => setSizes((prev) => prev.map((row, idx) => (idx === i ? { ...row, price: e.target.value } : row)))}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Original price (if discounted)"
                value={s.originalPrice}
                onChange={(e) => setSizes((prev) => prev.map((row, idx) => (idx === i ? { ...row, originalPrice: e.target.value } : row)))}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={s.inStock}
                  onChange={(e) => setSizes((prev) => prev.map((row, idx) => (idx === i ? { ...row, inStock: e.target.checked } : row)))}
                />
                In stock
              </label>
              <button type="button" onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-600 px-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSizes((prev) => [...prev, { label: "", price: "", originalPrice: "", inStock: true }])}
          className="mt-2 text-sm text-navy hover:underline"
        >
          + Add size / variant
        </button>
        <p className="mt-1 text-xs text-muted">
          Leave a size's "Original price" empty if that specific size isn't discounted.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images (up to 5)</label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-navy text-muted">
              <Upload className="h-4 w-4 mb-1" />
              <span className="text-[10px]">{uploading ? "Uploading..." : "Add"}</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Specifications</label>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Key (e.g. RAM)"
                value={s.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Value (e.g. 16GB)"
                value={s.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeSpecRow(i)} className="text-muted hover:text-red-600 px-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSpecRow} className="mt-2 text-sm text-navy hover:underline">
          + Add spec
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In Stock
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading} className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60">
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}