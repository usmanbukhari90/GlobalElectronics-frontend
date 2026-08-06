"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Layers } from "lucide-react";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";

export default function ProductCardDetail({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  const showToast = useToastStore((s) => s.show);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const displayPrice = product.sizes?.[0]?.price ?? product.price;

  return (
    <div className="flex gap-6 border-b border-border py-6">
      <div className="relative shrink-0">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-red-400 px-3 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="relative block h-48 w-48 overflow-hidden rounded-lg bg-gray-50">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="192px" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <Link href={`/product/${product.slug}`} className="text-lg font-semibold text-navy hover:text-accent-yellow">
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-accent-yellow text-accent-yellow" : "text-gray-200"}`} />
          ))}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-navy">
            {product.sizes ? "From " : ""}{formatAED(displayPrice)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">{formatAED(product.originalPrice)}</span>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-3 max-w-2xl">{product.description}</p>

        <div className="mt-4 flex items-center gap-3">
        <button
            onClick={() => {
              addToCart({
                productId: product.id,
                name: product.name,
                price: displayPrice,
                image: product.image,
                size: product.sizes?.[0]?.label,
              });
              showToast(`${product.name} added to cart`);
            }}
            className="rounded-full bg-navy px-8 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
          >
            Add to cart
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-navy transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-navy transition-colors"
            aria-label="Compare"
          >
            <Layers className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}