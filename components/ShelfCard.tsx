"use client";
import {
  isInWatchlist,
  toggleWatchlist,
} from "@/lib/watchlist";
import dynamic from "next/dynamic";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";


const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export type ShelfMedia = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  year?: string;
  rating?: number;
  trailer?: string | null;
};

export default function ShelfCard({ item, href }: { item: ShelfMedia; href: string }) {
  const score = typeof item.rating === "number" ? item.rating.toFixed(1) : null;

  const hasTrailer = Boolean(item.trailer);

  const router = useRouter();

  const [style, setStyle] = useState({
    rotateX: "0deg",
    rotateY: "0deg",
    glowX: "50%",
    glowY: "50%",
  });

  const [hovered, setHovered] = useState(false);

  const [saved, setSaved] = useState(
  isInWatchlist(item.id, item.media)
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const middleX = rect.width / 2;
    const middleY = rect.height / 2;

    const rotateY = ((x - middleX) / middleX) * 8;
    const rotateX = -((y - middleY) / middleY) * 8;

    setStyle({
      rotateX: `${rotateX}deg`,
      rotateY: `${rotateY}deg`,
      glowX: `${x}px`,
      glowY: `${y}px`,
    });
  }

  function handleMouseLeave() {
    setStyle({
      rotateX: "0deg",
      rotateY: "0deg",
      glowX: "50%",
      glowY: "50%",
    });
  }

 function handleSave(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  toggleWatchlist({
    id: item.id,
    media_type: item.media,
    title: item.title,
    poster_path: item.poster || null,
    release_date: item.year || null,
    vote_average: item.rating,
  });

  setSaved(!saved);
}

return (
  <div
    onMouseMove={handleMouseMove}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => {
      setHovered(false);
      handleMouseLeave();
    }}
    style={{
      transform: `perspective(900px) rotateX(${style.rotateX}) rotateY(${style.rotateY})`,
    }}
    className="group relative w-[140px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-[0_20px_60px_rgba(255,184,0,0.18)]"
  >
    <div
      role="link"
      tabIndex={0}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) return;
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      className="relative cursor-pointer"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/40 via-blue-500/30 to-purple-500/40 blur-sm" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${style.glowX} ${style.glowY}, rgba(255,184,0,0.22), transparent 45%)`,
        }}
      />

      <div className="relative z-20 overflow-hidden rounded-2xl bg-[#0d1117]">
        <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800 transition-all duration-500">
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-zinc-900 text-center text-xs text-white/40">
              No poster
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          {score && (
            <span className="absolute left-2 top-2 z-30 rounded-lg border border-yellow-400/30 bg-black/75 px-2 py-1 text-[11px] font-bold text-yellow-300">
              ⭐ {score}
            </span>
          )}

          <div className="absolute bottom-2 left-2 right-2 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black">
              Open
            </span>
          </div>
        </div>

        <div className="p-2">
          <p className="line-clamp-1 text-sm font-bold transition duration-300 group-hover:text-yellow-300">
            {item.title}
          </p>

          {item.year && (
            <p className="text-xs text-zinc-400 transition duration-300 group-hover:text-zinc-300">
              {item.year}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
}