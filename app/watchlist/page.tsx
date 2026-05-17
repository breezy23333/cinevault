"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Film, MonitorPlay, Sparkles } from "lucide-react";

type WatchlistItem = {
  id: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  voteAverage?: number | null;
};

function posterUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w500${path}`;
}

function WatchRow({
  title,
  subtitle,
  items,
  icon,
  onRemove,
}: {
  title: string;
  subtitle: string;
  items: WatchlistItem[];
  icon: React.ReactNode;
  onRemove: (item: WatchlistItem) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    rowRef.current?.scrollBy({
      left: dir === "left" ? -700 : 700,
      behavior: "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-2 text-yellow-300">
              {icon}
            </span>
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
          <p className="mt-2 text-sm text-white/50">{subtitle}</p>
        </div>

        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-white/10 bg-white/5 p-3 hover:border-yellow-400/50 hover:bg-yellow-400/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-white/10 bg-white/5 p-3 hover:border-yellow-400/50 hover:bg-yellow-400/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[35vw] pb-8 pt-4"
      >
        {items.map((item) => {
          const img = posterUrl(item.posterPath);

          return (
            <Link
              key={item.id}
              href={`/${item.mediaType}/${item.tmdbId}`}
              className="group w-[230px] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl transition duration-300 hover:z-10 hover:-translate-y-4 hover:scale-110 hover:border-yellow-400/60 hover:bg-white/[0.08]"
            >
              <div className="relative aspect-[2/3] bg-zinc-900">
                {img ? (
                  <Image
                    src={img}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="220px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    No Poster
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3">
                  <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-yellow-300">
                    ⭐ {item.voteAverage?.toFixed(1) || "—"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <p className="line-clamp-1 font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-white/45">
                  {item.mediaType.toUpperCase()} · {item.releaseDate || "—"}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(item);
                  }}
                  className="mt-3 w-full rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20"
                >
                  Remove
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  async function loadWatchlist() {
    const res = await fetch("/api/watchlist", {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Watchlist API failed:", res.status);
      setItems([]);
      return;
    }

    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function removeItem(item: WatchlistItem) {
    await fetch("/api/watchlist", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tmdbId: item.tmdbId,
        mediaType: item.mediaType,
      }),
    });

    setItems((prev) => prev.filter((x) => x.id !== item.id));
  }

  const movies = useMemo(
    () => items.filter((item) => item.mediaType === "movie"),
    [items]
  );


  function isAnimation(item: WatchlistItem) {
  const title = item.title.toLowerCase();

  return (
    title.includes("anime") ||
    title.includes("animation") ||
    title.includes("cartoon") ||
    title.includes("dragon ball") ||
    title.includes("naruto") ||
    title.includes("one piece") ||
    title.includes("shin chan") ||
    title.includes("invincible") ||
    title.includes("solo leveling") ||
    title.includes("demon slayer") ||
    title.includes("jujutsu kaisen") ||
    title.includes("attack on titan")
  );
}

const animation = useMemo(
  () => items.filter((item) => isAnimation(item)),
  [items]
);

const tvShows = useMemo(
  () =>
    items.filter(
      (item) => item.mediaType === "tv" && !isAnimation(item)
    ),
  [items]
);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-300">
            Your Library
          </p>

          <h1 className="mt-3 text-5xl font-black">Watchlist</h1>

          <p className="mt-3 max-w-2xl text-white/60">
            Your saved movies and shows are organized into cinematic rows.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              🎬 {movies.length} Movies
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              📺 {tvShows.length} TV Shows
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              ✨ {animation.length} Animation
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-white/70">No saved titles yet.</p>
          </div>
        ) : (
          <>
            <WatchRow
              title="Movies"
              subtitle="Your saved films."
              items={movies}
              icon={<Film size={20} />}
              onRemove={removeItem}
            />

            <WatchRow
              title="TV Shows"
              subtitle="Series and shows you want to follow."
              items={tvShows}
              icon={<MonitorPlay size={20} />}
              onRemove={removeItem}
            />

            <WatchRow
              title="Animation & Anime"
              subtitle="Animated titles, anime, and cartoons."
              items={animation}
              icon={<Sparkles size={20} />}
              onRemove={removeItem}
            />
          </>
        )}
      </div>
    </main>
  );
}