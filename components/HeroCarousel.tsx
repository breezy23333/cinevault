// components/HeroCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

export default function HeroCarousel({
  items,
}: {
  items: Norm[];
}) {
  // only keep heroes with a backdrop
  const heroes = useMemo(() => (items || []).filter((x) => !!x.backdrop), [items]);

  // guard: nothing to show
  if (!heroes.length) return null;

  // index state
  const [i, setI] = useState(0);

  // if heroes list changes (navigation), keep index valid
  useEffect(() => {
    if (i >= heroes.length) setI(0);
  }, [heroes.length, i]);

  const cur = heroes[i];
  const next = () => setI((p) => (p + 1) % heroes.length);
  const prev = () => setI((p) => (p - 1 + heroes.length) % heroes.length);

  const href = `/${cur.media}/${cur.id}`;

  return (
    <section className="relative z-0 w-[100svw] md:w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden">
      <div className="relative h-[68vh] md:h-[78vh] max-w-[100vw]">
        {/* Backdrop */}
        {cur.backdrop ? (
          <Image
            src={cur.backdrop}
            alt={cur.title}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority={i === 0}                 // ✅ first hero only
            loading={i === 0 ? "eager" : "lazy"}
            placeholder="empty"                 // cheaper than blurDataURL
          />
        ) : (
          <div className="h-full w-full bg-black/40" />
        )}

        {/* Left-to-right darkening (click-through) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 md:px-8 h-full flex items-center">
          <div className="max-w-[760px]">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/85">
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                {cur.media.toUpperCase()}
              </span>
              {!!cur.year && (
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                  {cur.year}
                </span>
              )}
              {typeof cur.rating === "number" && (
                <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-black font-semibold">
                  ★ {cur.rating}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{cur.title}</h1>
            {!!cur.overview && (
              <p className="mt-3 text-white/85 line-clamp-3 md:line-clamp-4">
                {cur.overview}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold px-5 py-2.5 shadow hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Play
              </Link>
              <Link
                href={`${href}?tab=trailer`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 px-5 py-2.5 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 6h16v12H4z"/></svg>
                Trailer
              </Link>
            </div>
          </div>
        </div>

        {/* Arrows */}
        {heroes.length > 1 && (
          <div className="absolute inset-0 z-10 grid grid-cols-[112px_1fr_112px] items-center pointer-events-none">
            <div className="flex pl-3">
              <button
                type="button"
                aria-label="Previous"
                onClick={prev}
                className="pointer-events-auto hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div />
            <div className="flex justify-end pr-3">
              <button
                type="button"
                aria-label="Next"
                onClick={next}
                className="pointer-events-auto hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom blend into sheet color */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0e131f]" />
      </div>
    </section>
  );
}
