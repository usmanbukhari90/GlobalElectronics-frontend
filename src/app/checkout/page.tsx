"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { createOrder } from "@/lib/api";
import { formatAED, SHOP_INFO } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dubai",
    emirate: "Dubai",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-6">
        <h1 className="text-2xl font-bold text-navy">Nothing to Checkout</h1>
        <p className="mt-2 text-muted">Your cart is empty.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name + (item.size ? ` (${item.size})` : ""),
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    try {
      const order = await createOrder({
        items: orderItems,
        customer: form,
        subtotal: total,
        total,
      });
      clearCart();
      router.push(`/order/${order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-navy">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                required
                placeholder="+971 5X XXX XXXX"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emirate</label>
              <select
                required
                value={form.emirate}
                onChange={(e) => updateField("emirate", e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              >
                {SHOP_INFO.emirates.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50 transition-colors"
          >
            {submitting ? "Placing Order..." : `Place Order — ${formatAED(total)}`}
          </button>
        </form>

        <div className="rounded-lg border border-border p-6 h-fit">
          <h2 className="font-bold text-navy mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                <span>{item.name}{item.size ? ` (${item.size})` : ""} × {item.quantity}</span>
                <span>{formatAED(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
            <span>Total</span>
            <span className="text-navy">{formatAED(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
