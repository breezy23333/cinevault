// components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false); // start closed

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Floating toggle (bottom-left, above everything) */}
      <button
        type="button"
        title={open ? 'Hide menu' : 'Open menu'}
        aria-label={open ? 'Hide menu' : 'Open menu'}
        onClick={() => setOpen(v => !v)}
        className="fixed left-5 bottom-6 z-[80] rounded-full px-4 py-3 text-sm font-medium
                   border border-white/15 bg-black/50 text-white/90 shadow-lg backdrop-blur
                   hover:bg-white/10 active:scale-[0.98] transition"
      >
        {open ? 'Close' : 'Menu'}
      </button>

      {/* Overlay (click to close). Keep it below the panel but above page */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200
                    ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Off-canvas panel: full height, left 0, strong z to sit above overlay */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[70] w-72
                    transform transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                    border-r border-white/10 rounded-r-2xl
                    bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))]
                    backdrop-blur-xl shadow-2xl
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full overflow-y-auto p-3 space-y-3 text-[13px]">
          <input
            placeholder="Quick find..."
            className="w-full rounded-xl bg-white/10 px-3 py-2 placeholder-zinc-200 outline-none
                       ring-1 ring-white/10 focus:ring-white/30"
          />

          <Section
            title="System"
            items={[
              { label: 'Alerts Center', badge: 3 },
              { label: 'Notifications', badge: 9 },
              { label: 'Charts & Stats' },
              { label: 'Budget Planner' },
              { label: 'Language', hint: 'EN / FR / ES' },
            ]}
          />

          <Section
            title="Favourites"
            items={[{ label: 'Sci-Fi' }, { label: 'Drama' }, { label: 'Comedy' }]}
          />

          <Section title="Settings" items={[{ label: 'Preferences' }]} />
        </div>
      </aside>
    </>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: { label: string; badge?: number; hint?: string }[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-zinc-300/80">{title}</div>
      <ul className="px-1 pb-2">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-center justify-between px-2 py-1.5 rounded-lg
                       hover:bg-white/10 transition-colors"
          >
            <span>{it.label}</span>
            {it.badge !== undefined && (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{it.badge}</span>
            )}
            {it.hint && <span className="text-[10px] opacity-60">{it.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}