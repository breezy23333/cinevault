// components/AboutFeatures.tsx
"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Zap, Headphones } from "lucide-react";

const FEATURES = [
  {
    id: "sources",
    title: "Accurate Sources",
    blurb: "Verified links only.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
    Icon: ShieldCheck,
    panel: {
      heading: "Accuracy you can trust",
      body:
        "We track official providers so every click lands on a real, safe destination. No fake mirrors. No dead ends.",
      bullets: ["Official provider mapping", "Region-aware availability", "Spam & typo protection"],
    },
  },
  {
    id: "speed",
    title: "Fast & Seamless",
    blurb: "Snappy & smooth.",
    img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1600&auto=format&fit=crop",
    Icon: Zap,
    panel: {
      heading: "Speed that feels invisible",
      body:
        "Steam-style rows, instant search, clever caching. Browsing CineVault feels like gliding.",
      bullets: ["Optimized fetch & cache", "Row virtualization", "Smart prefetch"],
    },
  },
  {
    id: "support",
    title: "Support That Cares",
    blurb: "Human replies.",
    img: "https://images.unsplash.com/photo-1600880292089-90e8ee71d4f0?q=80&w=1600&auto=format&fit=crop",
    Icon: Headphones,
    panel: {
      heading: "Real help, real quick",
      body:
        "We actually answer. Send a message and get a useful reply—no maze, no bots.",
      bullets: ["< 24h response", "Contact form w/ anti-spam", "Admin inbox dashboard"],
    },
  },
] as const;

const AUTO_MS = 4200;

export default function AboutFeatures() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // auto-rotate; pause when hovering the whole section
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive(i => (i + 1) % FEATURES.length), AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  const a = FEATURES[active];
  const tilts = [-1.5, 0, 1.5]; // base angle per card (inner wrapper only)

  return (
    <div
      className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((c, i) => {
          const selected = active === i;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(i)} // click still works, but not required
              className={`spot-card spot-card-halo ${selected ? "selected" : ""} group rounded-2xl border border-white/10 bg-zinc-900/50 text-left outline-none ring-0 focus-visible:ring-2 focus-visible:ring-yellow-400/70`}
            >
              {/* inner tilt so outer can animate (shake/glow) */}
              <div className="tilt" style={{ transform: `rotate(${tilts[i]}deg)` }}>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt=""
                    className="h-40 w-full rounded-t-2xl object-cover opacity-90"
                    draggable={false}
                  />
                  <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-b from-black/10 via-transparent to-black/45" />
                </div>

                <div className="flex items-start gap-3 px-4 py-4">
                  <div className="spot-icon grid size-10 shrink-0 place-items-center rounded-lg bg-zinc-800/80 ring-1 ring-white/10 group-hover:bg-yellow-400/15">
                    <c.Icon className="size-5 text-yellow-400" />
                  </div>
                  <div className={`spot-text ${selected ? "opacity-100 translate-x-0" : ""}`}>
                    <div className="text-sm font-semibold text-zinc-100">{c.title}</div>
                    <div className="text-xs text-zinc-400">{c.blurb}</div>
                  </div>
                </div>
              </div>

              <div
                className={`h-[3px] w-full rounded-b-2xl transition-colors ${
                  selected ? "bg-yellow-400" : "bg-zinc-800"
                }`}
              />
              {selected && <span className="sr-only">Selected</span>}
            </button>
          );
        })}
      </div>

      {/* side panel */}
      <aside key={a.id} className="panel-animate rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-yellow-400/90">Details</p>
        <h3 className="panel-glow mt-2 text-2xl font-bold text-zinc-50">{a.panel.heading}</h3>
        <p className="mt-2 max-w-2xl text-zinc-300">{a.panel.body}</p>
        {!!a.panel.bullets?.length && (
          <ul className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
            {a.panel.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 inline-block size-1.5 rounded-full bg-yellow-400/80" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
