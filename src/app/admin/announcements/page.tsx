"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminAuth";
import { AnnouncementMessage } from "@/types";
import { Trash2, Pencil, Plus, Megaphone } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [messages, setMessages] = useState<AnnouncementMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    adminFetch<AnnouncementMessage[]>("/api/announcements")
      .then(setMessages)
      .finally(() => setLoading(false));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setSaving(true);
    setError("");
    try {
      await adminFetch("/api/announcements", { method: "POST", body: JSON.stringify({ text: newText }) });
      setNewText("");
      load();
    } catch {
      setError("Failed to add message");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(m: AnnouncementMessage) {
    setEditingId(m.id);
    setEditingText(m.text);
  }

  async function saveEdit(id: string) {
    if (!editingText.trim()) return;
    await adminFetch(`/api/announcements/${id}`, { method: "PUT", body: JSON.stringify({ text: editingText }) });
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement line?")) return;
    await adminFetch(`/api/announcements/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1 flex items-center gap-2">
        <Megaphone className="h-6 w-6" />
        Announcement Bar
      </h1>
      <p className="text-sm text-muted mb-6">
        These lines rotate automatically in the red bar at the very top of your website. Add, edit, or remove lines below.
      </p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 max-w-2xl">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="e.g. 🎁 New Year Sale — Up to 40% off!"
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy-light transition-colors disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted">No announcement lines yet — the bar will be hidden on the site until you add one.</p>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {messages.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded-lg border border-border bg-white p-3">
              {editingId === m.id ? (
                <>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 rounded-md border border-border px-3 py-1.5 text-sm"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(m.id)} className="text-sm font-medium text-navy hover:underline">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-sm text-muted hover:underline">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm">{m.text}</p>
                  <button onClick={() => startEdit(m)} className="text-navy hover:text-accent-yellow">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}