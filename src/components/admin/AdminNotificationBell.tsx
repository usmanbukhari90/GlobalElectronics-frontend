"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { adminFetch } from "@/lib/adminAuth";

interface Notification {
  id: string;
  type: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function loadUnreadCount() {
    adminFetch<{ count: number }>("/api/notifications/unread-count")
      .then((data) => setUnreadCount(data.count))
      .catch(() => {});
  }

  async function handleOpen() {
    setOpen((v) => !v);
    if (!open) {
      const data = await adminFetch<Notification[]>("/api/notifications").catch(() => []);
      setNotifications(data);
      if (unreadCount > 0) {
        adminFetch("/api/notifications/mark-read", { method: "POST" }).catch(() => {});
        setUnreadCount(0);
      }
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex items-center hover:text-accent-yellow transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-lg border border-border bg-white shadow-lg text-navy z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">Notifications</div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.orderId ? "/admin/orders" : "/admin"}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-gray-50 ${!n.read ? "bg-blue-50" : ""}`}
              >
                <p className="text-gray-800">{n.message}</p>
                <p className="text-xs text-muted mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}