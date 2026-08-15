"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatAED } from "@/lib/constants";
import { Flame } from "lucide-react";

function useCountdown(expiresAt?: string) {
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    if (!expiresAt) return;
    function tick() {
      const diff = new Date(expiresAt as string).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ h: 0, m: 0, s: 0, expired: true });
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({ h, m, s, expired: false });
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remaining;
}

export default function DailyHighlight({
  products,
  onAllExpired,
}: {
  products: Product[];
  onAllExpired?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(products);

  useEffect(() => setLive(products), [products]);

  const current = live[index] ?? null;
  const countdown = useCountdown(current?.highlightExpiresAt);

  useEffect(() => {
    if (live.length <= 1) return;
    const rotate = setInterval(() => setIndex((i) => (i + 1) % live.length), 5000);
    return () => clearInterval(rotate);
  }, [live.length]);

  useEffect(() => {
    if (countdown.expired && current) {
      setLive((prev) => {
        const next = prev.filter((p) => p.id !== current.id);
        if (next.length === 0) onAllExpired?.();
        return next;
      });
      setIndex(0);
    }
  }, [countdown.expired, current, onAllExpired]);

  if (!current) return null;

  const price = current.sizes?.[0]?.price ?? current.price;

  return (
    <div className="relative h-full overflow-hidden rounded-lg bg-gradient-to-br from-navy to-navy-light text-white shadow-lg flex flex-col">
      <div className="flex items-center justify-between px-3 pt-3 lg:px-4 lg:pt-4">
        <div className="flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-accent-yellow lg:h-4 lg:w-4" />
          <h3 className="font-bold text-xs tracking-wide lg:text-sm">HOT DEAL</h3>
        </div>
        {live.length > 1 && (
          <div className="flex gap-1">
            {live.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-accent-yellow" : "w-1.5 bg-white/30"}`}
                aria-label={`Show deal ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="hidden px-4 mt-1 text-xs text-white/70 lg:block">Limited stock — grab it before time runs out!</p>

      <div className="px-3 mt-2 lg:px-4 lg:mt-3">
        <div className="grid grid-cols-3 gap-1 rounded-md bg-black/20 p-1.5 text-center lg:gap-1.5 lg:p-2">
          {[
            { label: "H", value: countdown.h },
            { label: "M", value: countdown.m },
            { label: "S", value: countdown.s },
          ].map((t) => (
            <div key={t.label}>
              <div className="text-xs font-bold tabular-nums leading-none lg:text-lg">{String(t.value).padStart(2, "0")}</div>
              <div className="text-[8px] text-white/60 mt-0.5 lg:text-[9px]">{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Link href={`/product/${current.slug}`} className="block px-3 mt-2 group lg:px-4 lg:mt-3">
        <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-white/5 lg:aspect-video">
          <Image
            src={current.image}
            alt={current.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="300px"
          />
          {current.discountPercent && (
            <span className="absolute top-1.5 left-1.5 rounded bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold lg:top-2 lg:left-2 lg:px-2 lg:text-[10px]">
              {current.discountPercent}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="px-3 mt-2 flex-1 lg:px-4 lg:mt-3">
        <Link href={`/product/${current.slug}`}>
          <p className="text-xs font-medium line-clamp-1 hover:text-accent-yellow transition-colors lg:text-sm lg:line-clamp-2">{current.name}</p>
        </Link>
        <div className="flex items-baseline gap-1.5 mt-1 lg:gap-2">
          <p className="text-sm font-bold text-accent-yellow lg:text-xl">{formatAED(price)}</p>
          {current.originalPrice && (
            <p className="text-[10px] text-white/50 line-through lg:text-xs">{formatAED(current.originalPrice)}</p>
          )}
        </div>
        {current.sizes && current.sizes.length > 1 && (
          <p className="hidden text-xs text-white/60 mt-0.5 lg:block">
            From {current.sizes[0].label} — {current.sizes[current.sizes.length - 1].label}
          </p>
        )}
      </div>

      <Link
        href={`/product/${current.slug}`}
        className="block mx-3 mb-3 mt-2 rounded-full bg-accent-yellow py-1.5 text-center text-[11px] font-bold text-navy hover:bg-white transition-colors lg:mx-4 lg:mb-4 lg:mt-3 lg:py-2.5 lg:text-xs"
      >
        Shop Now
      </Link>
    </div>
  );
}