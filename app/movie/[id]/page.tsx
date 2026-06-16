// app/movie/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
import TrailerModal from "@/components/TrailerModal";
import ContinueWatchingTracker from "@/components/ContinueWatchingTracker";
import WatchlistButton from "@/components/WatchlistButton";
import WatchOptions from "@/components/WatchOptions";
import MovieTickets from "@/components/MovieTickets";
import CinemaLocation from "@/components/CinemaLocation";
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
    url: `https://cinevault-tau-drab.vercel.app/movie/${id}`,
    genre: details.genres?.map((g: any) => g.name),
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
      <ContinueWatchingTracker
        id={details.id}
        media_type="movie"
        title={details.title}
        poster_path={details.poster_path}
        release_date={details.release_date}
        vote_average={details.vote_average}
      />
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
                    href="#where-to-watch"
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

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
        <p className="mt-4 leading-8 text-white/70">
            {details.overview}
          </p>

          <p className="mt-4 leading-8 text-white/60">
            {details.title || details.name}
            {year ? ` (${year})` : ""} delivers a visually immersive{" "}
            {details.first_air_date ? "series" : "movie"} experience filled with
            emotional storytelling, memorable characters, cinematic world-building,
            and high-impact moments that continue to resonate with audiences.
          </p>

          <p className="mt-4 leading-8 text-white/60">
            From performances and atmosphere to action, drama, and visual design,
            this title stands out as one of the most talked-about entertainment
            experiences currently featured on CineVault.
          </p>
      </section> 

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

        <div id="where-to-watch">
          <WatchOptions title={details.title} />
        </div>

        <MovieTickets title={details.title} />

        <CinemaLocation title={details.title} />

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Explore More
          </p>

          <Link href="/categories">
            Categories
          </Link>

          <h2 className="mt-2 text-3xl font-black">
            Continue Exploring CineVault
          </h2>

          <p className="mt-3 max-w-2xl text-white/60">
            Discover more trending movies, top-rated worlds, anime adventures,
            cartoons, and cinematic universes.
          </p>

         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/trending"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-yellow-400/50 hover:bg-white/10"
          >
            Trending Movies
          </Link>

          <Link
            href="/top"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-yellow-400/50 hover:bg-white/10"
          >
            Top Rated Movies
          </Link>

          <Link
            href="/anime"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-pink-400/50 hover:bg-white/10"
          >
            Anime Collection
          </Link>

          <Link
            href="/cartoons"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            Cartoon Collection
          </Link>

          <Link
            href="/news"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-green-400/50 hover:bg-white/10"
          >
            Latest Entertainment News
          </Link>

          <Link
            href="/upcoming"
            className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-orange-400/50 hover:bg-white/10"
          >
            Upcoming Movies
          </Link>
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
    const image =
      movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : movie.poster_path
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
        url: `https://cinevault-tau-drab.vercel.app/movie/${id}`,
        siteName: "CineVault",
        images: image ? [image] : [],
        locale: "en_US",
        type: "video.movie",
      },
       twitter: {
        card: "summary_large_image",
        title: `${movie.title} (${year}) – CineVault`,
        description:
          movie.overview ||
          `Watch ${movie.title} online on CineVault.`,
        images: image ? [image] : [],
      },     
    };
  } catch {
    return {
      title: "Watch Movies Online | CineVault",
      description: "Discover and watch movies on CineVault.",
    };
  }
}