// app/movie/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
import TrailerModal from "@/components/TrailerModal";
import WatchlistButton from "@/components/WatchlistButton";
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
} from "@/lib/fetchers";


export const runtime = "nodejs";
export const revalidate = 300;

type TMDBVideo = { key?: string; site?: string; type?: string; official?: boolean };
type Cast = { id: number; name: string; character?: string; profile_path?: string | null };
type Similar = { id: number; title?: string; poster_path?: string | null; release_date?: string | null };

const img = (p?: string | null, size: string = "w780") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

const withTimeout = <T,>(p: Promise<T>, ms = 8000, label = "fetch") =>
  Promise.race<T>([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${label} timeout`)), ms)) as any,
  ]);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: PageProps) {
  const { id: idStr } = await params;

  if (!idStr) return notFound();

  const id = Number(idStr);
  if (!Number.isFinite(id)) return notFound();

  // ---------- data ----------
  const [detailsRes, videosRes, creditsRes, similarRes] = await Promise.allSettled([
    withTimeout(getMovieDetails(id), 8000, "details"),
    withTimeout(getMovieVideos(id), 8000, "videos"),
    withTimeout(getMovieCredits(id), 8000, "credits"),
    withTimeout(getSimilarMovies(id), 8000, "similar"),
  ]);
  

  const details: any =
    detailsRes.status === "fulfilled" ? detailsRes.value : null;
  if (!details) return notFound();

  const videos: TMDBVideo[] =
    videosRes.status === "fulfilled" && Array.isArray((videosRes.value as any)?.results)
      ? (videosRes.value as any).results
      : [];

  const cast: Cast[] =
    creditsRes.status === "fulfilled" && Array.isArray((creditsRes.value as any)?.cast)
      ? (creditsRes.value as any).cast.slice(0, 12)
      : [];

  const similar: Similar[] =
    similarRes.status === "fulfilled" && Array.isArray((similarRes.value as any)?.results)
      ? (similarRes.value as any).results.slice(0, 12)
      : [];

  // ---------- derived ----------
  const backdrop = img(details.backdrop_path, "w1280") || img(details.poster_path, "w780");
  const poster = img(details.poster_path, "w500");
  const year = (details.release_date || "").slice(0, 4);
  const rating = typeof details.vote_average === "number" ? Math.round(details.vote_average * 10) / 10 : undefined;

  // prefer Official YouTube Trailer/Teaser
  const ytKey =
    videos.find(v => v.type === "Trailer" && v.site === "YouTube" && v.official)?.key
    ?? videos.find(v => v.site === "YouTube")?.key;

  const movieJsonLd = {
  "@context": "https://schema.org",
  "@type": "Movie",
  name: details.title,
  description: details.overview,
  image: poster,
  datePublished: details.release_date,
  aggregateRating: rating
    ? {
        "@type": "AggregateRating",
        ratingValue: rating,
        bestRating: 10,
        worstRating: 0,
      }
    : undefined,
};


const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cinevault-tau-drab.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Movies",
      item: "https://cinevault-tau-drab.vercel.app/movies",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: details.title,
      item: `https://cinevault-tau-drab.vercel.app/movie/${id}`,
    },
  ],
};

  // ---------- UI ----------
  return (
    <main className="pb-12">
      {/* HERO */}
      <section className="relative w-[100svw] left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="relative h-[54vh] md:h-[64vh]">
          {backdrop ? (
            <Image
              src={backdrop}
              alt={details.title}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-black/40" />
          )}

          {/* gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0e131f]" />

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-6 h-full flex items-end md:items-center">
            {/* Poster */}
            <div className="hidden md:block -mb-10 md:mb-0 md:mr-6 shrink-0">
              <div className="relative h-[320px] w-[220px] rounded-xl overflow-hidden ring-1 ring-white/15 bg-black/30">
                {poster ? (
                  <Image src={poster} alt={details.title} fill sizes="220px" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/70 text-sm">No poster</div>
                )}
              </div>
            </div>

            {/* Text + Actions */}
            <div className="pb-6 md:pb-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-white/85">
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">MOVIE</span>
                {!!year && <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">{year}</span>}
                {rating && (
                  <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-black font-semibold">★ {rating}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{details.title}</h1>
              {!!details.overview && (
                <p className="mt-3 max-w-2xl text-white/85">{details.overview}</p>
              )}

              {/* Actions (one clear block) */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                  {ytKey && <TrailerModal videoKey={ytKey} />}

                  <Link
                    href={`/movie/${id}/watch`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 px-5 py-2.5 hover:bg-white/15"
                  >
                    Watch options
                  </Link>

                  <WatchlistButton
                    id={details.id}
                    media_type="movie"
                    title={details.title}
                    poster_path={details.poster_path}
                    release_date={details.release_date}
                    vote_average={details.vote_average}
                    />
                </div>

              {/* User rating (TMDB + your stars) */}
              <div className="mt-4">
                <UserRating movieId={id} tmdb={rating} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* BODY */}
      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-6 mt-8 space-y-10">
        {/* Cast */}
        {cast.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((c) => {
                const profile = img(c.profile_path, "w185");
                return (
                  <div key={c.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                    <div className="relative aspect-[2/3] bg-black/20">
                      {profile ? (
                        <Image src={profile} alt={c.name} fill sizes="185px" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-white/50 text-xs">No photo</div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="line-clamp-1 font-medium">{c.name}</div>
                      {!!c.character && <div className="text-xs text-white/70">{c.character}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* More like this */}
        {similar.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">More like this</h2>
            <div className="-mx-2 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar px-2">
              {similar.map((s) => {
                const p = img(s.poster_path, "w342");
                const y = (s.release_date || "").slice(0, 4) || "—";
                return (
                  <Link
                    key={s.id}
                    href={`/movie/${s.id}`}
                    className="group relative w-[180px] shrink-0 snap-start rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20"
                  >
                    <div className="relative aspect-[2/3] bg-white/5">
                      {p ? (
                        <Image src={p} alt={s.title || "Untitled"} fill sizes="180px" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-xs text-white/60">No poster</div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="line-clamp-1 font-medium">{s.title || "Untitled"}</div>
                      <div className="text-xs text-white/70">{y}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <section id="watch-section" className="mt-12">
          <h2 className="mb-3 text-xl font-bold">Where to Watch</h2>

          <p className="mb-4 text-white/70">
            Search this movie on popular streaming platforms.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[
              {
                name: "Netflix",
                url: `https://www.netflix.com/search?q=${encodeURIComponent(details.title)}`,
                color: "bg-red-600",
              },
              {
                name: "Disney+",
                url: `https://www.disneyplus.com/search?q=${encodeURIComponent(details.title)}`,
                color: "bg-blue-600",
              },
              {
                name: "Prime",
                url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(details.title)}`,
                color: "bg-cyan-600",
              },
              {
                name: "Apple TV",
                url: `https://tv.apple.com/search?term=${encodeURIComponent(details.title)}`,
                color: "bg-zinc-700",
              },
              {
                name: "YouTube",
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(details.title + " movie")}`,
                color: "bg-red-500",
              },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-yellow-400 hover:text-black"
              >
                <span
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white ${p.color}`}
                >
                  ▶
                </span>

                <span className="block text-sm font-bold">{p.name}</span>

                <span className="mt-1 block text-xs text-white/45 group-hover:text-black/60">
                  Search movie
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Comments */}
        <Comments movieId={id} title={details.title} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params;
    const movie = await getMovieDetails(Number(id));

    const year = movie.release_date?.slice(0, 4) || "";
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : null;

    return {
      title: `${movie.title} (${year}) – CineVault`,
      description:
        movie.overview ||
        `Watch ${movie.title} online on CineVault.`,

        alternates: {
        canonical: `https://cinevault-tau-drab.vercel.app/movie/${id}`,
      },

      openGraph: {
        title: `${movie.title} (${year}) – CineVault`,
        description:
          movie.overview ||
          `Watch ${movie.title} online on CineVault.`,
        images: poster ? [poster] : [],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: `${movie.title} (${year}) – CineVault`,
        description:
          movie.overview ||
          `Watch ${movie.title} online on CineVault.`,
        images: poster ? [poster] : [],
      },
    };
  } catch {
    return {
      title: "Watch Movies Online | CineVault",
      description: "Discover and watch movies on CineVault.",
    };
  }
}