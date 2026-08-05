"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PROMO_MESSAGES } from "@/lib/constants";

export default function TopAnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % PROMO_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-red-600 text-white text-sm relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-10 py-2 text-center font-medium">
        {PROMO_MESSAGES[index]}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
