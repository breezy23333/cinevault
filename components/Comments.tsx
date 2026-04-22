"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  name?: string;
  message: string;
  ts: number;
};

export default function Comments({ movieId, title }: { movieId: number; title: string }) {
  const k = `cv:comments:${movieId}`;
  const [list, setList] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(k) : null;
      setList(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      setList([]);
    }
  }, [k]);

  function saveList(next: Comment[]) {
    setList(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(k, JSON.stringify(next));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    try {
      const c: Comment = {
        id: Math.random().toString(36).slice(2),
        name: name.trim() || undefined,
        message: message.trim(),
        ts: Date.now(),
      };
      const next = [c, ...list].slice(0, 200); // cap
      saveList(next);
      setMessage("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold">Comments</h2>

      <form onSubmit={onSubmit} className="mb-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[180px_1fr]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-white/30"
            placeholder="Your name (optional)"
          />
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-white/30"
              placeholder={`Share your thoughts on “${title}”...`}
            />
            <button
              type="submit"
              disabled={saving || !message.trim()}
              className="rounded-md bg-amber-400 px-4 py-2 font-semibold text-black hover:brightness-105 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-white/70 text-sm">Be the first to comment.</div>
        ) : (
          list.map((c) => (
            <div key={c.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
              <div className="mb-1 text-sm text-white/70">
                <b>{c.name || "Guest"}</b> • {new Date(c.ts).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{c.message}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
