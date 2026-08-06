"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types";
import { submitReview } from "@/lib/api";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  productRating: number;
  reviewCount: number;
}

export default function ReviewSection({
  productId,
  initialReviews,
  productRating,
  reviewCount,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const newReview = await submitReview({ productId, author, rating, comment });
      setReviews([newReview, ...reviews]);
      setAuthor("");
      setComment("");
      setRating(5);
      setMessage("Thank you for your review!");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-navy">Customer Reviews</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(productRating)
                  ? "fill-accent-yellow text-accent-yellow"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted">
          {productRating.toFixed(1)} out of 5 ({reviewCount + reviews.length - initialReviews.length} reviews)
        </span>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-border p-6">
        <h3 className="font-semibold text-navy mb-4">Write a Review</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < rating
                        ? "fill-accent-yellow text-accent-yellow"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
        {message && (
          <p className={`mt-3 text-sm ${message.includes("Thank") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50 transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews List */}
      <div className="mt-8 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-navy">{review.author}</span>
                <span className="text-xs text-muted">
                  {new Date(review.createdAt).toLocaleDateString("en-AE")}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating
                        ? "fill-accent-yellow text-accent-yellow"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
