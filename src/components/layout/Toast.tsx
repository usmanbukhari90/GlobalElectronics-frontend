"use client";

import { useToastStore } from "@/lib/toastStore";
import { CheckCircle } from "lucide-react";

export default function Toast() {
  const message = useToastStore((s) => s.message);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ${
        message ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-medium text-white shadow-lg">
        <CheckCircle className="h-4 w-4 text-green-400" />
        {message}
      </div>
    </div>
  );
}