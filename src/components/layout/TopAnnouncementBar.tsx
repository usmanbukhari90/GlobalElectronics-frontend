"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnnouncementMessage } from "@/types";
import { getAnnouncements } from "@/lib/api";

export default function TopAnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<AnnouncementMessage[]>([]);

  useEffect(() => {
    getAnnouncements().then(setMessages).catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (!visible || messages.length === 0) return null;

  return (
    <div className="bg-red-600 text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 py-1.5 text-center font-medium text-[11px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis sm:px-10 sm:py-2 sm:text-sm">
        {messages[index].text}
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