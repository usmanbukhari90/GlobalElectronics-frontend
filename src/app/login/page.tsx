import Link from "next/link";
import { User } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-6">
      <div className="text-center mb-8">
        <User className="mx-auto h-12 w-12 text-navy" />
        <h1 className="mt-4 text-2xl font-bold text-navy">Login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to track orders and manage your account.
        </p>
      </div>

      <form className="space-y-4 rounded-lg border border-border p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
        >
          Sign In
        </button>
        <p className="text-center text-xs text-muted">
          Authentication coming soon. You can shop and checkout as a guest.
        </p>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/shop" className="text-navy hover:underline">
          Continue shopping as guest →
        </Link>
      </p>
    </div>
  );
}
