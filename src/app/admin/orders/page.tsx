"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminAuth";
import { formatAED } from "@/lib/constants";

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; email: string; phone: string; address: string; city: string; emirate: string };
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    adminFetch<Order[]>("/api/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }

  async function updateStatus(id: string, status: string) {
    await adminFetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as Order["status"] } : o)));
  }

  if (loading) return <p className="text-muted">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-white overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div>
                  <div className="font-medium text-sm">{order.id}</div>
                  <div className="text-xs text-muted">
                    {order.customer.name} · {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm">{formatAED(order.total)}</span>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 capitalize ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-border bg-gray-50 p-4 text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Customer</div>
                    <div className="text-muted">{order.customer.name}</div>
                    <div className="text-muted">{order.customer.email} · {order.customer.phone}</div>
                    <div className="text-muted">{order.customer.address}, {order.customer.city}, {order.customer.emirate}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Items</div>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-muted">
                        <span>{item.quantity}× {item.name}</span>
                        <span>{formatAED(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}