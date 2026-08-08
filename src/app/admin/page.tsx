"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminAuth";
import { formatAED } from "@/lib/constants";
import { DollarSign, ShoppingBag, Package, Clock } from "lucide-react";

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  ordersByStatus: { pending: number; confirmed: number; shipped: number; delivered: number };
  topProducts: { name: string; qty: number; revenue: number }[];
  recentOrders: {
    id: string;
    customer: { name: string };
    total: number;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<Analytics>("/api/analytics")
      .then(setData)
      .catch(() => setError("Failed to load analytics"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-muted">Loading...</p>;

  const stats = [
    { label: "Total Revenue", value: formatAED(data.totalRevenue), icon: DollarSign },
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBag },
    { label: "Total Products", value: data.totalProducts, icon: Package },
    { label: "Pending Orders", value: data.ordersByStatus.pending, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-white p-5">
            <Icon className="h-5 w-5 text-navy mb-2" />
            <div className="text-xl font-bold text-navy">{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold text-navy mb-4">Recent Orders</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{o.customer.name}</div>
                    <div className="text-xs text-muted">{o.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatAED(o.total)}</div>
                    <span className="text-xs capitalize text-muted">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/orders" className="mt-4 inline-block text-sm text-navy hover:underline">
            View all orders →
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold text-navy mb-4">Top Selling Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-muted">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <div>{p.name}</div>
                  <div className="text-right">
                    <div className="font-medium">{p.qty} sold</div>
                    <span className="text-xs text-muted">{formatAED(p.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}