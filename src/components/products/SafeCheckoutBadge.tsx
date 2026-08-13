export default function SafeCheckoutBadge() {
    const methods = [
      { name: "Apple Pay", src: "/payments/apple-pay.svg" },
      { name: "Google Pay", src: "/payments/google-pay.svg" },
      { name: "Mastercard", src: "/payments/mastercard.svg" },
      { name: "Visa", src: "/payments/visa.svg" },
      { name: "PayPal", src: "/payments/paypal.svg" },
    ];
  
    return (
      <div className="mt-4 rounded-lg bg-gray-100 py-5 text-center">
        <p className="text-sm font-semibold text-navy">Guarantee Safe Checkout:</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          {methods.map((method) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={method.name} src={method.src} alt={method.name} className="h-8 w-auto" />
          ))}
        </div>
      </div>
    );
  }