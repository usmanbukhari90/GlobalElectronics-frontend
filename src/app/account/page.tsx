"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomerAuth } from "@/lib/useCustomerAuth";
import { User, Package, Heart, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, loading, signOut } = useCustomerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">Loading...</div>;
  }

  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "there";

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
      <div className="text-center mb-8">
        {user.user_metadata?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            className="mx-auto h-16 w-16 rounded-full"
          />
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy/10">
            <User className="h-8 w-8 text-navy" />
          </div>
        )}
        <h1 className="mt-4 text-2xl font-bold text-navy">Welcome back, {displayName}!</h1>
        <p className="mt-1 text-sm text-muted">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/order/track"
          className="flex items-center gap-4 rounded-lg border border-border p-5 hover:border-navy hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/5">
            <Package className="h-5 w-5 text-navy" />
          </div>
          <div>
            <p className="font-semibold text-navy">Track an Order</p>
            <p className="text-sm text-muted">Check your order status</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="flex items-center gap-4 rounded-lg border border-border p-5 hover:border-navy hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/5">
            <Heart className="h-5 w-5 text-navy" />
          </div>
          <div>
            <p className="font-semibold text-navy">Your Wishlist</p>
            <p className="text-sm text-muted">Items you've saved</p>
          </div>
        </Link>
      </div>

      <button
        onClick={handleSignOut}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </div>
  );
}