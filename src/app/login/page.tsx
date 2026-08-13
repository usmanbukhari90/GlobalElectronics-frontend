"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useCustomerAuth } from "@/lib/useCustomerAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useCustomerAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/account");
    }
  }, [authLoading, user, router]);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGoogleLogin() {
    setError("");
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({ email });
      if (error) throw error;
      setStep("code");
      setMessage("We sent a 6-digit code to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-navy">Sign In</h1>
        <p className="mt-2 text-sm text-muted">
          Track orders, save your cart, and checkout faster.
        </p>
      </div>

      <div className="rounded-lg border border-border p-6">
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-green-600">{message}</p>
            <div>
              <label className="block text-sm font-medium mb-1">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-muted hover:text-navy"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/shop" className="text-navy hover:underline">
          Continue shopping as guest →
        </Link>
      </p>
    </div>
  );
}