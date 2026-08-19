"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Film,
  LoaderCircle,
  MonitorPlay,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

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
  return path.startsWith("http")
    ? path
    : `https://image.tmdb.org/t/p/w500${path}`;
}

function releaseYear(date?: string | null) {
  const year = date?.slice(0, 4);
  return year && /^\d{4}$/.test(year) ? year : "Year unknown";
}

function WatchRow({
  number,
  title,
  subtitle,
  items,
  icon,
  removingIds,
  onRemove,
}: {
  number: string;
  title: string;
  subtitle: string;
  items: WatchlistItem[];
  icon: ReactNode;
  removingIds: Set<string>;
  onRemove: (item: WatchlistItem) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const distance = Math.max((rowRef.current?.clientWidth || 800) * 0.82, 560);
    rowRef.current?.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex min-w-0 items-start gap-4">
          <span className="hidden pt-1 text-[10px] font-black tracking-[0.25em] text-yellow-400/60 sm:block">
            {number}
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-yellow-400/25 bg-yellow-400/[0.07] text-yellow-300">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-white/40">{subtitle}</p>
          </div>
        </div>

        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 scroll-smooth md:-mx-6 md:px-6"
      >
        {items.map((item, index) => {
          const image = posterUrl(item.posterPath);
          const isRemoving = removingIds.has(item.id);
          const rating =
            typeof item.voteAverage === "number" && item.voteAverage > 0
              ? item.voteAverage.toFixed(1)
              : null;

          return (
            <article
              key={item.id}
              className="group relative w-[180px] shrink-0 snap-start overflow-hidden border border-white/10 bg-[#101722] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60 sm:w-[215px]"
            >
              <Link
                href={`/${item.mediaType}/${item.tmdbId}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-[#151c27]">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${item.title} poster`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 180px, 215px"
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-4 text-center text-xs font-bold uppercase tracking-wider text-white/25">
                      Poster unavailable
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/15 opacity-70" />
                  <span className="absolute left-2 top-2 bg-[#080b12]/90 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/65 backdrop-blur">
                    {item.mediaType === "movie" ? "Movie" : "TV"}
                  </span>
                  {rating && (
                    <span className="absolute right-2 top-2 bg-yellow-400 px-2 py-1 text-[10px] font-black text-black">
                      ★ {rating}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 text-[10px] font-black tracking-[0.2em] text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="min-h-[92px] p-3.5">
                  <h3 className="line-clamp-2 text-sm font-black leading-5 transition group-hover:text-yellow-300 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-white/35">
                    {releaseYear(item.releaseDate)}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => onRemove(item)}
                disabled={isRemoving}
                aria-label={`Remove ${item.title} from watchlist`}
                className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center border border-white/10 bg-[#080b12] text-white/35 transition hover:border-red-400/60 hover:bg-red-500 hover:text-white disabled:cursor-wait disabled:opacity-60"
              >
                {isRemoving ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </article>
          );
        })}

        <Link
          href="/search"
          className="group grid min-h-[380px] w-[180px] shrink-0 snap-start place-items-center border border-dashed border-white/15 bg-white/[0.018] p-5 text-center transition hover:border-yellow-400/60 hover:bg-yellow-400/[0.04] sm:min-h-[446px] sm:w-[215px]"
        >
          <span>
            <span className="mx-auto grid h-12 w-12 place-items-center border border-white/10 text-white/40 transition group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
              <Plus size={20} />
            </span>
            <span className="mt-4 block text-sm font-black">Add another title</span>
            <span className="mt-2 block text-xs leading-5 text-white/35">Search the CINRYVAN universe</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const loadWatchlist = useCallback(async () => {
    setLoading(true);
    setError("");
    setNeedsLogin(false);

    try {
      const response = await fetch("/api/watchlist", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        setItems([]);
        setNeedsLogin(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`Watchlist request failed with ${response.status}`);
      }

      const data = await response.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (watchlistError) {
      console.error("WATCHLIST LOAD FAILED:", watchlistError);
      setError("Your watchlist could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWatchlist();
  }, [loadWatchlist]);

  async function removeItem(item: WatchlistItem) {
    if (removingIds.has(item.id)) return;

    const previousItems = items;
    setError("");
    setRemovingIds((current) => new Set(current).add(item.id));
    setItems((current) => current.filter((savedItem) => savedItem.id !== item.id));

    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: item.tmdbId,
          mediaType: item.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Watchlist delete failed with ${response.status}`);
      }
    } catch (removeError) {
      console.error("WATCHLIST REMOVE FAILED:", removeError);
      setItems(previousItems);
      setError(`“${item.title}” could not be removed. Your watchlist was restored.`);
    } finally {
      setRemovingIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  }

  const movies = useMemo(
    () => items.filter((item) => item.mediaType === "movie"),
    [items],
  );
  const tvShows = useMemo(
    () => items.filter((item) => item.mediaType === "tv"),
    [items],
  );
  const featuredPosters = items
    .filter((item) => posterUrl(item.posterPath))
    .slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] pb-24 pt-28 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative min-h-[520px] overflow-hidden border border-white/10 bg-[#101722] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(250,204,21,.17),transparent_24%),radial-gradient(circle_at_92%_90%,rgba(37,99,235,.16),transparent_28%),linear-gradient(115deg,#101722_5%,#0c121c_62%,#080b12_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080b12] to-transparent" />

          <div className="relative z-10 grid min-h-[520px] items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_.82fr] lg:p-14">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center bg-yellow-400 text-black">
                  <Bookmark size={17} fill="currentColor" />
                </span>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
                  Your CINRYVAN
                </p>
              </div>

              <h1 className="mt-6 text-6xl font-black leading-[.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Watch
                <span className="text-white/24"> / </span>
                List
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                The stories you chose not to lose—kept together and ready for
                the moment you return.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center bg-yellow-400 px-5 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  <Search size={16} className="mr-2" /> Find more titles
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
                >
                  Explore collections →
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-px overflow-hidden border border-white/10 bg-white/10">
                {[
                  [items.length, "Saved titles"],
                  [movies.length, "Movies"],
                  [tvShows.length, "TV shows"],
                ].map(([count, label]) => (
                  <div key={label} className="min-w-[130px] flex-1 bg-[#0c121c] px-5 py-4">
                    <p className="text-2xl font-black text-yellow-400">{loading ? "—" : count}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/35">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden h-[380px] lg:block" aria-hidden="true">
              {featuredPosters.length > 0 ? (
                featuredPosters.map((item, index) => (
                  <div
                    key={item.id}
                    className="absolute top-1/2 aspect-[2/3] w-[170px] overflow-hidden border border-white/15 bg-[#151c27] shadow-[0_35px_80px_rgba(0,0,0,.6)]"
                    style={{
                      left: `${index * 20}%`,
                      transform: `translateY(-50%) rotate(${(index - 1.5) * 4}deg)`,
                      zIndex: index + 1,
                    }}
                  >
                    <img
                      src={posterUrl(item.posterPath) || ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ))
              ) : (
                <div className="absolute inset-0 grid place-items-center border border-white/10 bg-white/[0.025] p-8 text-center">
                  <div>
                    <Bookmark className="mx-auto text-yellow-400/50" size={42} />
                    <p className="mt-5 text-xl font-black">Your collection starts here</p>
                    <p className="mt-2 text-sm leading-6 text-white/35">Save a title and its poster will join your wall.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" aria-live="polite" className="mt-7 flex flex-col gap-4 border-l-2 border-red-400 bg-red-500/[0.08] px-5 py-4 text-sm font-bold text-red-200 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => void loadWatchlist()} className="inline-flex w-fit items-center text-white transition hover:text-yellow-300">
              <RotateCcw size={15} className="mr-2" /> Try again
            </button>
          </div>
        )}

        {loading ? (
          <WatchlistSkeleton />
        ) : needsLogin ? (
          <StatePanel
            icon={<Bookmark size={30} />}
            eyebrow="Identity required"
            title="Your watchlist is waiting"
            text="Log in to see saved titles and keep your collection connected across CINRYVAN."
            primaryHref="/login"
            primaryLabel="Enter CINRYVAN"
            secondaryHref="/signup"
            secondaryLabel="Create account"
          />
        ) : items.length === 0 && !error ? (
          <StatePanel
            icon={<Plus size={30} />}
            eyebrow="Empty collection"
            title="Save your first story"
            text="Explore CINRYVAN and use the watchlist button on any movie or television page."
            primaryHref="/browse"
            primaryLabel="Start exploring"
            secondaryHref="/trending"
            secondaryLabel="See what is trending"
          />
        ) : (
          <>
            <WatchRow
              number="01"
              title="Movies"
              subtitle={`${movies.length} saved film${movies.length === 1 ? "" : "s"}`}
              items={movies}
              icon={<Film size={19} />}
              removingIds={removingIds}
              onRemove={removeItem}
            />
            <WatchRow
              number="02"
              title="Television"
              subtitle={`${tvShows.length} saved show${tvShows.length === 1 ? "" : "s"}`}
              items={tvShows}
              icon={<MonitorPlay size={19} />}
              removingIds={removingIds}
              onRemove={removeItem}
            />
          </>
        )}
      </div>
    </main>
  );
}

function StatePanel({
  icon,
  eyebrow,
  title,
  text,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="mt-10 grid min-h-[360px] place-items-center border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid h-16 w-16 place-items-center border border-yellow-400/25 bg-yellow-400/[0.07] text-yellow-400">{icon}</span>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
        <p className="mt-4 leading-7 text-white/50">{text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={primaryHref} className="bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300">{primaryLabel}</Link>
          <Link href={secondaryHref} className="border border-white/15 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300">{secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}

function WatchlistSkeleton() {
  return (
    <div aria-label="Loading watchlist" role="status" className="mt-14 animate-pulse">
      <div className="h-8 w-52 bg-white/[0.06]" />
      <div className="mt-3 h-4 w-72 max-w-full bg-white/[0.04]" />
      <div className="mt-7 flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="w-[180px] shrink-0 border border-white/[0.06] bg-white/[0.025] sm:w-[215px]">
            <div className="aspect-[2/3] bg-white/[0.04]" />
            <div className="space-y-3 p-4"><div className="h-4 bg-white/[0.05]" /><div className="h-3 w-1/2 bg-white/[0.04]" /></div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading your saved titles</span>
    </div>
  );
}