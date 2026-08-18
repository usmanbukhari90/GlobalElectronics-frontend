import { SHOP_INFO } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-navy mb-2">Information We Collect</h2>
          <p>
            When you place an order, create an account, or contact us, we collect information such as your name,
            email address, phone number, and delivery address. If you sign in with email or Google, we store the
            basic profile information provided by that sign-in method.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">How We Use Your Information</h2>
          <p>
            We use your information to process and deliver orders, send order confirmations and status updates,
            respond to inquiries, and improve our website. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Data Storage & Security</h2>
          <p>
            Your data is stored securely using industry-standard cloud infrastructure. Order confirmation and status
            emails are sent through a trusted transactional email provider. We take reasonable measures to protect
            your information from unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Cookies</h2>
          <p>
            We use cookies for essential site functions such as keeping you signed in and remembering your cart. See
            our <a href="/cookies-policy" className="text-navy underline hover:text-accent-yellow">Cookies Policy</a> for
            details.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any time by contacting us
            below.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Changes to This Policy</h2>
          <p>We may update this policy from time to time. Continued use of the site means you accept the current version.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Contact Us</h2>
          <p>If you have questions about this policy, contact us at {SHOP_INFO.email}.</p>
        </section>
      </div>
    </div>
  );
}