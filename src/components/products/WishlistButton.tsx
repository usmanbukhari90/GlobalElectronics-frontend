"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store";

export default function WishlistButton({ productId }: { productId: string }) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(productId));

  return (
    <button
      onClick={() => toggleItem(productId)}
      className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-navy transition-colors"
      aria-label="Toggle wishlist"
    >
      <Heart
        className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
      />
      {isInWishlist ? "Saved" : "Wishlist"}
    </button>
  );
}
