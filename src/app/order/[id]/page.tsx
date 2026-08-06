import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api";
import { formatAED } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  let order;
  try {
    order = await getOrder(id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold text-navy">Order Confirmed!</h1>
      <p className="mt-2 text-muted">
        Thank you, {order.customer.name}. Your order has been placed successfully.
      </p>

      <div className="mt-8 rounded-lg border border-border p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Order ID</span>
          <span className="font-mono font-medium">{order.id}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">Status</span>
          <span className="capitalize font-medium text-green-600">{order.status}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">Total</span>
          <span className="font-bold text-navy">{formatAED(order.total)}</span>
        </div>

        <hr className="my-4 border-border" />

        <h3 className="font-semibold text-navy mb-2">Items</h3>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatAED(item.price * item.quantity)}</span>
          </div>
        ))}

        <hr className="my-4 border-border" />

        <h3 className="font-semibold text-navy mb-2">Delivery To</h3>
        <p className="text-sm text-gray-600">
          {order.customer.name}<br />
          {order.customer.address}<br />
          {order.customer.city}, {order.customer.emirate}<br />
          {order.customer.phone}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/order/track"
          className="inline-block rounded-full border border-navy px-8 py-3 text-sm font-semibold text-navy hover:bg-gray-50 transition-colors"
        >
          Track This Order
        </Link>
      </div>
    </div>
  );
}
