import { SHOP_INFO } from "@/lib/constants";

export default function TermsConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-navy mb-2">Acceptance of Terms</h2>
          <p>By using {SHOP_INFO.name}, you agree to these Terms & Conditions. If you do not agree, please do not use the site.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Products & Pricing</h2>
          <p>All prices are listed in AED (د.إ) and may change without prior notice. We make reasonable efforts to ensure accuracy but are not liable for typographical errors.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Orders & Payment</h2>
          <p>Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including in cases of pricing errors or stock unavailability.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Delivery</h2>
          <p>We deliver across Dubai and the UAE. Delivery times are estimates and not guaranteed. Delays due to circumstances outside our control are not our responsibility.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Returns & Warranty</h2>
          <p>Most items are eligible for return within 14 days of delivery, subject to condition. New products carry a 1-year warranty unless otherwise stated on the product page.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Limitation of Liability</h2>
          <p>{SHOP_INFO.name} is not liable for indirect or consequential damages arising from use of our products or website.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Governing Law</h2>
          <p>These terms are governed by the laws of the United Arab Emirates.</p>
        </section>

        <section>
          <h2 className="font-semibold text-navy mb-2">Contact Us</h2>
          <p>Questions about these terms can be directed to {SHOP_INFO.email}.</p>
        </section>
      </div>
    </div>
  );
}