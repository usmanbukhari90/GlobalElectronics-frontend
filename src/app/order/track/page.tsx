"use client";

import { useState } from "react";
import { formatAED } from "@/lib/constants";
import { CheckCircle, Circle, Package, Truck, Home } from "lucide-react";

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; email: string; address: string; city: string; emirate: string };
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Circle },
  { key: "confirmed", label: "Confirmed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/orders/${orderId.trim()}?email=${encodeURIComponent(email.trim())}`);
      if (!res.ok) {
        setError("Order not found. Please check your Order ID and email.");
        return;
      }
      const data: Order = await res.json();
      setOrder(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-2">Track Your Order</h1>
      <p className="text-sm text-muted mb-8">
        Enter your Order ID and the email you used at checkout to see your order status.
      </p>

      <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row rounded-lg border border-border p-4 mb-8">
        <input
          placeholder="Order ID (e.g. ORD-XXXXXX)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email used at checkout"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

      {order && (
        <div className="rounded-lg border border-border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-muted">Order ID</p>
              <p className="font-mono font-semibold">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Placed on</p>
              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-navy transition-all duration-500"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((step, i) => {
              const Icon = i <= currentStepIndex ? CheckCircle : Circle;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 bg-white px-1">
                  <Icon
                    className={`h-8 w-8 transition-colors duration-300 ${
                      i <= currentStepIndex ? "text-navy fill-navy/10" : "text-gray-300"
                    }`}
                  />
                  <span className={`text-[11px] text-center font-medium ${i <= currentStepIndex ? "text-navy" : "text-muted"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-navy mb-2 text-sm">Items</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{item.quantity}× {item.name}</span>
                <span>{formatAED(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold border-t border-border mt-2 pt-2">
              <span>Total</span>
              <span>{formatAED(order.total)}</span>
            </div>
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <h3 className="font-semibold text-navy mb-1 text-sm">Delivering To</h3>
            <p className="text-sm text-gray-600">
              {order.customer.name}<br />
              {order.customer.address}, {order.customer.city}, {order.customer.emirate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}