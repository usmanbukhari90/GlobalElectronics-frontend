"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminAuth";
import { HeroBanner } from "@/types";
import { Upload, Image as ImageIcon } from "lucide-react";

function BannerEditor({ banner, onSaved }: { banner: HeroBanner; onSaved: () => void }) {
  const [heading, setHeading] = useState(banner.heading);
  const [subheading, setSubheading] = useState(banner.subheading ?? "");
  const [buttonText, setButtonText] = useState(banner.buttonText);
  const [linkHref, setLinkHref] = useState(banner.linkHref);
  const [imageUrl, setImageUrl] = useState(banner.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("images", file);
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImageUrl(data.urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await adminFetch(`/api/hero-banners/${banner.slot}`, {
        method: "PUT",
        body: JSON.stringify({ heading, subheading, buttonText, linkHref, imageUrl }),
      });
      onSaved();
    } catch {
      setError("Failed to save banner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <h2 className="font-semibold text-navy mb-4">
        Banner {banner.slot} {banner.slot === 1 ? "— left (bold headline style)" : "— right (with subheading)"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Background Image</label>
          <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-gray-50 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <label className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-sm text-muted cursor-pointer hover:border-navy">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Change Image"}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <input value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          {banner.slot === 2 && (
            <div>
              <label className="block text-sm font-medium mb-1">Subheading (small text above heading, optional)</label>
              <input value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Button Text</label>
            <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Button Link</label>
            <input value={linkHref} onChange={(e) => setLinkHref(e.target.value)} placeholder="/shop?category=laptop" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="mt-4 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Banner"}
      </button>
    </div>
  );
}

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    adminFetch<HeroBanner[]>("/api/hero-banners")
      .then(setBanners)
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1 flex items-center gap-2">
        <ImageIcon className="h-6 w-6" />
        Homepage Banners
      </h1>
      <p className="text-sm text-muted mb-6">Edit the two large promotional banners shown at the top of your homepage.</p>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {banners.map((b) => (
            <BannerEditor key={b.slot} banner={b} onSaved={load} />
          ))}
        </div>
      )}
    </div>
  );
}