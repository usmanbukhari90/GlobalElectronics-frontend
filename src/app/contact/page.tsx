import { SHOP_INFO } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-navy mb-8">Contact Us</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Have a question about our products or need TV repair services? Reach
            out to our Dubai team — we&apos;re happy to help.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-navy">Address</h3>
                <p className="text-sm text-muted">{SHOP_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-navy">Phone</h3>
                <p className="text-sm text-muted">{SHOP_INFO.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-navy">Email</h3>
                <p className="text-sm text-muted">{SHOP_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-navy">Business Hours</h3>
                <p className="text-sm text-muted">
                  Sat – Thu: 9:00 AM – 9:00 PM
                  <br />
                  Fri: 2:00 PM – 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-semibold text-navy">Send us a Message</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-navy px-8 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
