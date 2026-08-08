"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      saveToken(data.token);
      router.push("/admin");
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-navy mb-1">Admin Login</h1>
        <p className="text-sm text-muted mb-6">Kanz Electronics management panel</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}