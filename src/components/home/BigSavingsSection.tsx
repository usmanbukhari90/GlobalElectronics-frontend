"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";

export default function BigSavingsSection({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const rotate = setInterval(() => setIndex((i) => (i + 1) % products.length), 4000);
    return () => clearInterval(rotate);
  }, [products.length]);

  if (products.length === 0) return null;
  const current = products[index];
  const price = current.sizes?.[0]?.price ?? current.price;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <div className="grid gap-4 md:grid-cols-2 rounded-lg overflow-hidden border border-border">
        <div className="relative min-h-[300px] md:min-h-[420px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * (100 / products.length)}%)`, width: `${products.length * 100}%` }}
          >
            {products.map((p, i) => (
              <div key={p.id} className="relative h-full shrink-0" style={{ width: `${100 / products.length}%` }}>
                <Image src={p.image} alt={p.name} fill className="object-cover" priority={i === 0} sizes="(max-width:768px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50">
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">Save 50—85% Electronics</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">Small Prices Big Savings</h2>
          <p className="mt-3 text-sm text-muted max-w-xs">
            We run huge discounts every now and then. Keep an eye on the discounts we offer on Smart TVs and Laptops.
          </p>

          <Link
            href={`/product/${current.slug}`}
            className="mt-6 flex w-full max-w-sm items-center gap-3 rounded-full border border-border bg-white p-2 pr-5 hover:border-navy hover:shadow-md transition-all"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-50">
              <Image src={current.image} alt={current.name} fill className="object-cover transition-opacity duration-500" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium text-navy line-clamp-1">{current.name}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-bold text-red-500">{formatAED(price)}</span>
                {current.originalPrice && (
                  <span className="text-xs text-muted line-through">{formatAED(current.originalPrice)}</span>
                )}
              </div>
            </div>
          </Link>

          {products.length > 1 && (
            <div className="flex gap-2 mt-5">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Show deal ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-navy" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}