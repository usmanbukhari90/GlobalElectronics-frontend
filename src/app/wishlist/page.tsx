"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useWishlistStore } from "@/lib/store";
import { Product } from "@/types";
import { API_URL } from "@/lib/api";

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((s) => s.items);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then((all: Product[]) => setProducts(all.filter((p) => wishlistIds.includes(p.id))))
      .catch(() => setProducts([]));
  }, [wishlistIds]);

  if (wishlistIds.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-6">
        <h1 className="text-2xl font-bold text-navy">Your Wishlist is Empty</h1>
        <p className="mt-2 text-muted">Save products you love for later.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
