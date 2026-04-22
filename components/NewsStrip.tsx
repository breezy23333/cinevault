// components/NewsStrip.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type NewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

export default function NewsStrip({ items }: { items: NewsItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 0);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const by = Math.round(el.clientWidth * 0.9) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: by, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={ref} className="-mx-1 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
        {items.map((n, i) => (
          <Link
            key={n.url + i}
            href={n.url}
            className="group w-[320px] shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 transition"
          >
            <div className="relative h-[180px] bg-zinc-800">
              {n.image && (
                <Image src={n.image} alt={n.title} fill sizes="320px" className="object-cover" />
              )}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm">{n.title}</p>
              {n.source && <p className="mt-1 text-xs text-zinc-400">{n.source}</p>}
            </div>
          </Link>
        ))}
      </div>

      <button
        aria-label="Scroll left"
        onClick={() => nudge("left")}
        disabled={!canL}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full
                   bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => nudge("right")}
        disabled={!canR}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full
                   bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
