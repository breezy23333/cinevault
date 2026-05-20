import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
import TrailerModal from "@/components/TrailerModal";
import WatchlistButton from "@/components/WatchlistButton";
import {
  getTVDetails,
  getTVVideos,
  getTVCredits,
  getSimilarTV,
} from "@/lib/fetchers";

export const runtime = "nodejs";
export const revalidate = 300;

type PageProps = {
  params: Promise<{ id: string }>;
};

type TMDBVideo = {
  key?: string;
  site?: string;
  type?: string;
  official?: boolean;
};

type Cast = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

type SimilarTV = {
  id: number;
  name?: string;
  poster_path?: string | null;
  first_air_date?: string | null;
};

const img = (p?: string | null, size: string = "w780") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

const withTimeout = <T,>(p: Promise<T>, ms = 8000, label = "fetch") =>
  Promise.race<T>([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timeout`)), ms)
    ) as any,
  ]);

export default async function TvPage({ params }: PageProps) {
  const { id: idStr } = await params;

  if (!idStr) return notFound();

  const id = Number(idStr);
  if (!Number.isFinite(id)) return notFound();

  const [detailsRes, videosRes, creditsRes, similarRes] =
    await Promise.allSettled([
      withTimeout(getTVDetails(id), 8000, "details"),
      withTimeout(getTVVideos(id), 8000, "videos"),
      withTimeout(getTVCredits(id), 8000, "credits"),
      withTimeout(getSimilarTV(id), 8000, "similar"),
    ]);

  const details: any =
    detailsRes.status === "fulfilled" ? detailsRes.value : null;

  if (!details) return notFound();

  const videos: TMDBVideo[] =
    videosRes.status === "fulfilled" &&
    Array.isArray((videosRes.value as any)?.results)
      ? (videosRes.value as any).results
      : [];

  const cast: Cast[] =
    creditsRes.status === "fulfilled" &&
    Array.isArray((creditsRes.value as any)?.cast)
      ? (creditsRes.value as any).cast.slice(0, 12)
      : [];

  const similar: SimilarTV[] =
    similarRes.status === "fulfilled" &&
    Array.isArray((similarRes.value as any)?.results)
      ? (similarRes.value as any).results.slice(0, 12)
      : [];

  const title = details.name || details.original_name || "Untitled";
  const backdrop = img(details.backdrop_path, "w1280") || img(details.poster_path, "w780");
  const poster = img(details.poster_path, "w500");
  const year = (details.first_air_date || "").slice(0, 4);

  const rating =
    typeof details.vote_average === "number"
      ? Math.round(details.vote_average * 10) / 10
      : undefined;

  const meta = [
    details.number_of_seasons ? `${details.number_of_seasons} season(s)` : "",
    details.number_of_episodes ? `${details.number_of_episodes} episodes` : "",
  ]
    .filter(Boolean)
    .join(" • ");

  const ytKey =
    videos.find(
      (v) =>
        v.type === "Trailer" &&
        v.site === "YouTube" &&
        v.official
    )?.key ?? videos.find((v) => v.site === "YouTube")?.key;

    const tvJsonLd = {
  "@context": "https://schema.org",
  "@type": "TVSeries",
  name: title,
  description: details.overview,
  image: poster,
  genre: details.genres?.map((g: any) => g.name),
  datePublished: details.first_air_date,
  aggregateRating: rating
  ? {
      "@type": "AggregateRating",
      ratingValue: rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: details.vote_count || 1,
    }
  : undefined,
  potentialAction: {
    "@type": "WatchAction",
    target: `https://cinevault-tau-drab.vercel.app/tv/${id}`,
  },
  
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
      name: "TV Shows",
      item: "https://cinevault-tau-drab.vercel.app/tv",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: title,
      item: `https://cinevault-tau-drab.vercel.app/tv/${id}`,
    },
  ],
};

  return (
    <main className="pb-12">
      <section className="relative left-1/2 w-[100svw] -translate-x-1/2 overflow-hidden">
        <div className="relative h-[54vh] md:h-[64vh]">
          {backdrop ? (
            <Image
              src={backdrop}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-black/40" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0e131f]" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-end px-4 md:items-center md:px-6">
            <div className="hidden shrink-0 md:mb-0 md:mr-6 md:block">
              <div className="relative h-[320px] w-[220px] overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/15">
                {poster ? (
                  <Image
                    src={poster}
                    alt={title}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
                    No poster
                  </div>
                )}
              </div>
            </div>

            <div className="pb-6 md:pb-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-white/85">
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                  TV SHOW
                </span>

                {!!year && (
                  <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                    {year}
                  </span>
                )}

                {rating && (
                  <span className="rounded-md bg-yellow-400 px-2.5 py-1 font-semibold text-black">
                    ★ {rating}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                {title}
              </h1>

              {!!meta && (
                <p className="mt-2 text-sm text-white/70">{meta}</p>
              )}

              {!!details.overview && (
                <p className="mt-3 max-w-2xl text-white/85">
                  {details.overview}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {ytKey && <TrailerModal videoKey={ytKey} />}

                <a
                  href="#watch-section"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 ring-1 ring-white/20 backdrop-blur hover:bg-white/15"
                >
                  Watch options
                </a>

                <WatchlistButton
                  id={details.id}
                  media_type="tv"
                  title={title}
                  poster_path={details.poster_path}
                  release_date={details.first_air_date}
                  vote_average={details.vote_average}
                />
              </div>

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
          __html: JSON.stringify(tvJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <section className="mx-auto mt-8 w-full max-w-[1200px] space-y-10 px-4 md:px-6">
        {cast.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">Cast</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((c) => {
                const profile = img(c.profile_path, "w185");

                return (
                  <div
                    key={c.id}
                    className="overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
                  >
                    <div className="relative aspect-[2/3] bg-black/20">
                      {profile ? (
                        <Image
                          src={profile}
                          alt={c.name}
                          fill
                          sizes="185px"
                          loading="lazy"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-xs text-white/50">
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="p-2">
                      <div className="line-clamp-1 font-medium">{c.name}</div>
                      {!!c.character && (
                        <div className="text-xs text-white/70">
                          {c.character}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">More like this</h2>

            <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2">
              {similar.map((s) => {
                const p = img(s.poster_path, "w342");
                const y = (s.first_air_date || "").slice(0, 4) || "—";

                return (
                  <Link
                    key={s.id}
                    href={`/tv/${s.id}`}
                    className="group relative w-[180px] shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-white/10 hover:ring-white/20"
                  >
                    <div className="relative aspect-[2/3] bg-white/5">
                      {p ? (
                        <Image
                          src={p}
                          alt={s.name || "Untitled"}
                          fill
                          sizes="180px"
                          loading="lazy"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                          No poster
                        </div>
                      )}
                    </div>

                    <div className="p-2">
                      <div className="line-clamp-1 font-medium">
                        {s.name || "Untitled"}
                      </div>
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
              Best match is highlighted based on this show.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {[
                {
                  name: "Netflix",
                  url: `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
                  color: "bg-red-600",
                  active: false,
                },
                {
                  name: "Disney+",
                  url: `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
                  color: "bg-blue-600",
                  active: false,
                },
                {
                  name: "Prime",
                  url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}`,
                  color: "bg-cyan-600",
                  active: title.toLowerCase().includes("boys"),
                },
                {
                  name: "Apple TV",
                  url: `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
                  color: "bg-zinc-700",
                  active: false,
                },
                {
                  name: "YouTube",
                  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`,
                  color: "bg-red-500",
                  active: false,
                },
              ].map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                    p.active
                      ? "border-yellow-400 bg-yellow-400 text-black shadow-[0_0_35px_rgba(250,204,21,0.35)]"
                      : "border-white/10 bg-white/5 text-white hover:border-yellow-400/50 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white ${p.color}`}
                  >
                    ▶
                  </span>

                  <span className="block text-sm font-bold">{p.name}</span>

                  <span
                    className={`mt-1 block text-xs ${
                      p.active ? "text-black/70" : "text-white/45"
                    }`}
                  >
                    {p.active ? "Best match" : "Search provider"}
                  </span>
                </a>
              ))}
            </div>
          </section>

        <Comments movieId={id} title={title} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const tv = await getTVDetails(Number(id));

    const title = tv.name || tv.original_name || "TV Show";
    const year = tv.first_air_date?.slice(0, 4) || "";
    const poster = tv.poster_path
      ? `https://image.tmdb.org/t/p/w780${tv.poster_path}`
      : null;

    return {
      title: `${title} (${year}) – CineVault`,
      description:
        tv.overview ||
        `Watch ${title} online on CineVault.`,
      alternates: {
          canonical: `https://cinevault-tau-drab.vercel.app/tv/${id}`,
        },


      openGraph: {
        title: `${title} (${year}) – CineVault`,
        description:
          tv.overview ||
          `Watch ${title} online on CineVault.`,
        images: poster ? [poster] : [],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: `${title} (${year}) – CineVault`,
        description:
          tv.overview ||
          `Watch ${title} online on CineVault.`,
        images: poster ? [poster] : [],
      },
    };
  } catch {
    return {
      title: "Watch TV Shows Online | CineVault",
      description: "Discover and watch TV shows on CineVault.",
    };
  }
}