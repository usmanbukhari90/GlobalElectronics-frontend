"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminAuth";
import { Star, Trash2 } from "lucide-react";

interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    adminFetch<Review[]>("/api/reviews")
      .then(setReviews)
      .finally(() => setLoading(false));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    await adminFetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Reviews ({reviews.length})</h1>

      {loading ? (
        <p className="text-muted">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet.</p>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-accent-yellow text-accent-yellow" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Product: {r.productId} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 shrink-0 ml-4">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}