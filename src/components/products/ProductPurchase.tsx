"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";
import WishlistButton from "./WishlistButton";

export default function ProductPurchase({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedSizeData = product.sizes?.find((s) => s.label === selectedSize);
  const currentPrice = selectedSizeData?.price ?? product.price;
  const currentOriginalPrice = selectedSizeData?.originalPrice ?? product.originalPrice;

  function handleAddToCart() {
    if (product.sizes?.length && !selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);
    showToast(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-navy">{formatAED(currentPrice)}</span>
        {currentOriginalPrice && (
          <span className="text-lg text-muted line-through">
            {formatAED(currentOriginalPrice)}
          </span>
        )}
        {product.discountPercent && (
          <span className="rounded bg-pink-500 px-2 py-0.5 text-xs font-bold text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-navy mb-2">SIZE</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                disabled={!size.inStock}
                className={`min-w-[3rem] rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size.label
                    ? "border-navy bg-navy text-white"
                    : "border-border hover:border-navy"
                } ${!size.inStock ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colorSwatches && product.colorSwatches.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-navy mb-2">COLOR</p>
          <div className="flex gap-2">
            {product.colorSwatches.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                title={c.name}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColor === c.name ? "border-navy scale-110" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "Added!" : "Add to Cart"}
        </button>
        <WishlistButton productId={product.id} />
      </div>

      <div className="mt-2 text-sm">
        {product.inStock ? (
          <span className="text-green-600 font-medium">✓ In Stock — Ready to ship across UAE</span>
        ) : (
          <span className="text-red-500 font-medium">Out of Stock</span>
        )}
      </div>
    </div>
  );
}