"use client";
import { useState } from "react";

const DEFAULTS = [
  { q: "Why doesn't a title have a streaming link?",
    a: "Some titles aren't available in your region yet or the provider data hasn't synced. Try again in a few hours and make sure your region is set correctly in Settings." },
  { q: "Search shows results from other countries.",
    a: "CineVault uses your region setting to filter providers. Go to Settings → Region and pick your country, then refresh the page." },
  { q: "My page layout looks broken.",
    a: "Clear cache (Ctrl/Cmd+Shift+R) and ensure you're on the latest Chrome/Edge. If it persists, send us the page URL and a screenshot via the form." },
  { q: "Is CineVault free?",
    a: "Yes. We link you to official providers. Some providers require their own subscription." },
];

type Item = { q: string; a: string };

export default function FAQ({ items = DEFAULTS }: { items?: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="rounded-2xl border border-yellow-400/20 bg-[#0b0f14] divide-y divide-yellow-400/20">
      {items.map((it, i) => (
        <details
          key={i}
          open={open === i}
          onToggle={(e) =>
            (e.target as HTMLDetailsElement).open ? setOpen(i) : setOpen(null)
          }
          className="group"
        >
          <summary
            className="flex w-full cursor-pointer list-none items-center justify-between px-4 py-3
                       text-zinc-100 font-medium transition-colors rounded-xl
                       hover:bg-yellow-400 hover:text-zinc-900
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                       group-open:bg-yellow-400/10 group-open:text-yellow-300"
          >
            <span>{it.q}</span>
            <span className="ml-4 text-lg transition group-open:rotate-45 group-hover:text-zinc-900">＋</span>
          </summary>

          <div className="px-4 pb-4 pt-2 text-sm text-zinc-300">
            {it.a}
          </div>
        </details>
      ))}
    </div>
  );
}
