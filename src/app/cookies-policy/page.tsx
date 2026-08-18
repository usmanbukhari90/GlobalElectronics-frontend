import { SHOP_INFO } from "@/lib/constants";

export default function CookiesPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-2">Cookies Policy</h1>
      <p className="text-sm text-muted mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-navy mb-2">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device that help websites function properly and remember your preferences.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">How We Use Cookies</h2>
          <p>
            We use essential cookies to keep you signed in, remember items in your cart and wishlist, and maintain
            basic site functionality. We do not currently use third-party advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Managing Cookies</h2>
          <p>You can disable cookies through your browser settings, though some site features (like staying signed in or a saved cart) may not work correctly without them.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Changes to This Policy</h2>
          <p>We may update this policy from time to time as our site evolves.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Contact Us</h2>
          <p>Questions about our use of cookies can be directed to {SHOP_INFO.email}.</p>
        </section>
      </div>
    </div>
  );
}