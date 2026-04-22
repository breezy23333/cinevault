"use client";

import { useEffect, useRef, useState } from "react";
import CapsuleCard, { RawItem } from "./CapsuleCard";

type MediaKind = "movie" | "tv";

export default function SteamRow({
  title,
  items = [],
  kind = "movie",
  width = 420,
  height = 220,
  gap = 16,
  showPeek = true, // peeks next card under the right fade
}: {
  title: string;
  items?: RawItem[];
  kind?: MediaKind;      // fallback if media_type missing
  width?: number;        // capsule width
  height?: number;       // capsule height
  gap?: number;          // space between capsules (px)
  showPeek?: boolean;
}) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && typeof x.id === "number");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const hrefOf = (it: RawItem) => `/title/${(it.media_type || kind)}/${it.id}`;

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    const r = new ResizeObserver(updateButtons);
    r.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      r.disconnect();
    };
  }, []);

  const scrollByCards = (n: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: n * (width + gap), behavior: "smooth" });
  };

  if (!list.length) return null;

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between px-1 md:px-2">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>

      <div className="relative">
        {/* left/right fades like Steam */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0e131f] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0e131f] to-transparent z-10" />

        {/* arrows */}
        <button
          aria-label="Previous"
          onClick={() => scrollByCards(-3)}
          disabled={atStart}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/20 disabled:opacity-40"
        >
          {/* left chevron */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <button
          aria-label="Next"
          onClick={() => scrollByCards(3)}
          disabled={atEnd}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/20 disabled:opacity-40"
        >
          {/* right chevron */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="hide-scrollbar -mx-1 md:-mx-2 flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ gap }}
        >
          <div className="px-1 md:px-2 h-0 w-0 shrink-0" />
          {list.map((it) => (
            <div key={it.id} className="snap-start shrink-0" style={{ width }}>
              <CapsuleCard item={it} href={hrefOf(it)} width={width} height={height} />
            </div>
          ))}
          {showPeek && <div className="px-6 h-0 w-0 shrink-0" />} {/* right peek space */}
        </div>
      </div>
    </section>
  );
}