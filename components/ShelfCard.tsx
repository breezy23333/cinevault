// components/ShelfCard.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export type ShelfMedia = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  year?: string;
  rating?: number;
  trailer?: string | null;
};

export default function ShelfCard({
  item,
  href,
}: {
  item: ShelfMedia;
  href: string;
}) {
  const score =
    typeof item.rating === "number"
      ? item.rating.toFixed(1)
      : null;

  return (
    <Link
      href={href}
      aria-label={`Open ${item.title}`}
      className="
        group relative block
        w-[108px] shrink-0 snap-start
        outline-none
        sm:w-[140px]
        md:w-[160px]
        lg:w-[172px]
      "
    >
      {/* Poster is now the visual card—no extra dark container. */}
      <div
        className="
          relative aspect-[2/3] overflow-hidden
          rounded-xl border border-white/10
          bg-[#111722]
          shadow-[0_12px_30px_rgba(0,0,0,0.28)]
          transition duration-300
          group-hover:-translate-y-1
          group-hover:border-yellow-400/50
          group-hover:shadow-[0_18px_45px_rgba(250,204,21,0.14)]
          group-focus-visible:border-yellow-400
          sm:rounded-2xl
        "
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="
              h-full w-full object-cover
              transition duration-500
              group-hover:scale-[1.04]
              group-hover:brightness-110
            "
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[#111722] px-2 text-center text-[10px] text-white/35">
            Poster unavailable
          </div>
        )}

        {/* Subtle cinematic overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 opacity-70" />

        {score && (
          <span
            className="
              absolute left-1.5 top-1.5
              rounded-md border border-yellow-400/25
              bg-black/75 px-1.5 py-0.5
              text-[9px] font-black text-yellow-300
              backdrop-blur-md
              sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px]
            "
          >
            ★ {score}
          </span>
        )}

        <span
          className="
            absolute bottom-2 left-2
            hidden translate-y-2 rounded-full
            bg-yellow-400 px-2.5 py-1
            text-[9px] font-black uppercase tracking-wide text-black
            opacity-0 transition
            group-hover:translate-y-0 group-hover:opacity-100
            md:block
          "
        >
          Open
        </span>

        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-yellow-400 transition duration-300 group-hover:scale-x-100" />
      </div>

      {/* Information sits directly on the page background. */}
      <div className="px-0.5 pt-1.5 sm:pt-2">
        <h3
          className="
            line-clamp-1
            text-[11px] font-bold leading-tight text-white/90
            transition group-hover:text-yellow-300
            sm:text-sm
          "
        >
          {item.title}
        </h3>

        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-white/40 sm:text-xs">
          {item.year && <span>{item.year}</span>}

          {item.year && (
            <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          )}

          <span className="uppercase">
            {item.media === "tv" ? "TV" : "Movie"}
          </span>
        </div>
      </div>
    </Link>
  );
}