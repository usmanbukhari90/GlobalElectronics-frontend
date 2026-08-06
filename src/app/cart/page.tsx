"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatAED } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-6">
        <h1 className="text-2xl font-bold text-navy">Your Cart is Empty</h1>
        <p className="mt-2 text-muted">Add some products to get started.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size ?? ""}`}
              className="flex gap-4 rounded-lg border border-border p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-medium text-navy">{item.name}</p>
                {item.size && <p className="text-xs text-muted">Size: {item.size}</p>}
                {item.color && <p className="text-xs text-muted">Color: {item.color}</p>}
                <p className="mt-auto font-bold text-navy">{formatAED(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 rounded-full border border-border">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                    className="p-1.5 hover:bg-gray-50 rounded-l-full"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                    className="p-1.5 hover:bg-gray-50 rounded-r-full"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border p-6 h-fit">
          <h2 className="font-bold text-navy text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatAED(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery (Dubai)</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-navy">{formatAED(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-navy py-3 text-center text-sm font-semibold text-white hover:bg-navy-light transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
