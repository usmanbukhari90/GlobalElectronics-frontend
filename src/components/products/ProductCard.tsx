"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  const showToast = useToastStore((s) => s.show);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const displayPrice = product.sizes?.[0]?.price ?? product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md">
      {discount > 0 && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
          -{discount}%
        </span>
      )}

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`h-3.5 w-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
<button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.sizes?.[0]?.price ?? product.price,
              image: product.image,
              size: product.sizes?.[0]?.label,
            });
            showToast(`${product.name} added to cart`);
          }}
          className="absolute inset-x-3 bottom-3 z-10 flex translate-y-4 items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-xs font-semibold text-navy opacity-0 shadow-md transition-all duration-200 hover:bg-navy hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground hover:text-navy"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.round(product.rating)
                  ? "fill-accent-yellow text-accent-yellow"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="ml-1 text-[11px] text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-2.5">
          <div className="text-sm font-bold text-navy leading-tight">
            {product.sizes ? "From " : ""}{formatAED(displayPrice)}
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-muted line-through leading-tight">
              {formatAED(product.originalPrice)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}