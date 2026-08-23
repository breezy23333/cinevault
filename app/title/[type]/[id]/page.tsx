// app/title/[type]/[id]/page.tsx
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Film,
  Globe2,
  MonitorPlay,
  Play,
  Star,
  Tv,
  UsersRound,
} from "lucide-react";
import { fetchTmdbProviders, fetchTmdbTitle } from "@/lib/fetchers";
import TmdbProviders from "@/components/TmdbProviders";
import YouTube from "@/components/YouTube";

const IMAGE_BASE = "https://image.tmdb.org/t/p";
const REGIONS = ["ZA", "US", "GB", "IN", "CA"] as const;

export const metadata: Metadata = {
  title: "Title Details | CINRYVAN",
  description:
    "Explore title information, trailers, cast and official watch providers on CINRYVAN.",
  robots: { index: false, follow: true },
};

type PageProps = {
  params: Promise<{ type: "movie" | "tv"; id: string }>;
  searchParams: Promise<{ region?: string | string[] }>;
};

function pickBestYoutube(videos: any[] = [], region: string) {
  const score = (video: any) =>
    (video?.type === "Trailer"
      ? 4
      : video?.type === "Teaser"
        ? 2
        : video?.type === "Clip"
          ? 1
          : 0) +
    (video?.official ? 1 : 0) +
    (video?.iso_3166_1?.toUpperCase?.() === region ? 0.3 : 0);

  return [...videos]
    .filter((video) => video?.site === "YouTube" && video?.key)
    .sort((a, b) => score(b) - score(a))[0]?.key ?? null;
}

function parseRegion(value?: string | string[]) {
  const candidate = (Array.isArray(value) ? value[0] : value || "ZA").toUpperCase();
  return /^[A-Z]{2}$/.test(candidate) ? candidate : "ZA";
}

function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes < 1) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours
    ? `${hours}h ${remainder ? `${remainder}m` : ""}`.trim()
    : `${remainder}m`;
}

export default async function TitlePage({ params, searchParams }: PageProps) {
  const [{ type, id }, query] = await Promise.all([params, searchParams]);
  const tmdbType: "movie" | "tv" = type === "tv" ? "tv" : "movie";
  const tmdbId = Number(id);

  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) notFound();

  const region = parseRegion(query.region);
  const [titleData, providersByRegion] = await Promise.all([
    fetchTmdbTitle(tmdbId, tmdbType).catch(() => null),
    fetchTmdbProviders(tmdbId, tmdbType).catch(() => ({})),
  ]);

  if (!titleData) notFound();

  const title = titleData.title || titleData.name || "Untitled";
  const originalTitle = titleData.original_title || titleData.original_name || "";
  const releaseDate = titleData.release_date || titleData.first_air_date || "";
  const year = releaseDate.slice(0, 4);
  const poster = titleData.poster_path
    ? `${IMAGE_BASE}/w500${titleData.poster_path}`
    : null;
  const backdrop = titleData.backdrop_path
    ? `${IMAGE_BASE}/original${titleData.backdrop_path}`
    : null;
  const genres = Array.isArray(titleData.genres) ? titleData.genres : [];
  const runtimeMinutes = titleData.runtime ?? titleData.episode_run_time?.[0] ?? null;
  const runtime = formatRuntime(runtimeMinutes);
  const rating =
    typeof titleData.vote_average === "number" && titleData.vote_average > 0
      ? titleData.vote_average.toFixed(1)
      : null;
  const voteCount =
    typeof titleData.vote_count === "number"
      ? titleData.vote_count.toLocaleString()
      : null;
  const cast = Array.isArray(titleData.credits?.cast)
    ? titleData.credits.cast.slice(0, 12)
    : [];
  const videos = Array.isArray(titleData.videos?.results)
    ? titleData.videos.results
    : [];
  const youtubeKey = pickBestYoutube(videos, region);
  const providers = providersByRegion?.[region];
  const mediaLabel = tmdbType === "tv" ? "TV Series" : "Movie";
  const seasons =
    tmdbType === "tv" && titleData.number_of_seasons
      ? `${titleData.number_of_seasons} season${titleData.number_of_seasons === 1 ? "" : "s"}`
      : null;
  const status = titleData.status || null;
  const language = titleData.original_language?.toUpperCase?.() || null;
  const moreTrailersUrl =
    "https://www.youtube.com/results?" +
    new URLSearchParams({ q: `${title} ${year} official trailer` }).toString();

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070b] pb-20 text-white">
      <section className="relative border-b border-white/10 pt-24">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070b] via-[#05070b]/90 to-[#05070b]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(250,204,21,.16),transparent_24%)]" />

        <div className="relative mx-auto grid min-h-[640px] max-w-[1500px] gap-8 px-4 pb-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end lg:pb-12">
          <div className="flex min-w-0 items-end gap-7">
            <div className="relative hidden w-[230px] shrink-0 overflow-hidden rounded-[4px] border border-white/15 bg-[#121722] shadow-[0_30px_90px_rgba(0,0,0,.65)] md:block">
              <div className="aspect-[2/3]">
                {poster ? (
                  <img src={poster} alt={`${title} poster`} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-white/30">
                    Poster unavailable
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-400 to-transparent" />
            </div>

            <div className="max-w-4xl pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 bg-yellow-400 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  {tmdbType === "tv" ? <Tv className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
                  {mediaLabel}
                </span>
                {genres.slice(0, 4).map((genre: any) => (
                  <span
                    key={genre.id ?? genre.name}
                    className="border border-white/15 bg-black/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/65 backdrop-blur"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-[88px]">
                {title}
              </h1>
              {originalTitle && originalTitle !== title && (
                <p className="mt-3 text-sm font-semibold text-white/35">
                  {originalTitle}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-bold text-white/55">
                {rating && (
                  <span className="inline-flex items-center gap-2 text-yellow-300">
                    <Star className="h-4 w-4 fill-current" /> {rating}
                    <span className="font-medium text-white/30">/ 10</span>
                  </span>
                )}
                {year && <span>{year}</span>}
                {runtime && <span>{runtime}</span>}
                {seasons && <span>{seasons}</span>}
                {titleData.adult && <span>18+</span>}
              </div>

              {titleData.overview && (
                <p className="mt-6 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                  {titleData.overview}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {youtubeKey && (
                  <a
                    href="#trailer"
                    className="inline-flex items-center gap-2 bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                  >
                    <Play className="h-4 w-4 fill-current" /> Play trailer
                  </a>
                )}
                <a
                  href="#watch"
                  className="inline-flex items-center gap-2 border border-white/20 bg-black/30 px-6 py-3.5 text-sm font-black backdrop-blur transition hover:border-yellow-400/70 hover:text-yellow-300"
                >
                  Where to watch <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <aside
            id="watch"
            className="scroll-mt-28 border border-white/12 bg-[#0b1018]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,.48)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                  Watch command center
                </p>
                <h2 className="mt-2 text-2xl font-black">Streaming in {region}</h2>
              </div>
              <MonitorPlay className="h-6 w-6 text-white/30" />
            </div>

            <div className="min-h-[110px] py-6">
              <TmdbProviders pv={providers} />
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                  Change region
                </p>
                <Globe2 className="h-4 w-4 text-white/25" />
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {REGIONS.map((regionCode) => (
                  <Link
                    key={regionCode}
                    href={`?region=${regionCode}`}
                    aria-current={regionCode === region ? "true" : undefined}
                    className={`grid h-10 place-items-center text-xs font-black transition ${
                      regionCode === region
                        ? "bg-yellow-400 text-black"
                        : "border border-white/10 bg-white/[0.03] text-white/45 hover:border-yellow-400/60 hover:text-yellow-300"
                    }`}
                  >
                    {regionCode}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 text-[11px] leading-5 text-white/30">
              CINRYVAN links to official services and does not host premium films or episodes.
            </p>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <section className="grid border-x border-b border-white/10 bg-[#080c12] sm:grid-cols-2 lg:grid-cols-5">
          <Fact icon={CalendarDays} label="Release" value={releaseDate || "Unknown"} />
          <Fact icon={Clock3} label="Runtime" value={runtime || seasons || "Unknown"} />
          <Fact icon={Star} label="Audience score" value={rating ? `${rating} / 10` : "Not rated"} />
          <Fact icon={UsersRound} label="TMDB votes" value={voteCount || "No votes"} />
          <Fact icon={Globe2} label="Language" value={language || "Unknown"} />
        </section>

        <section id="trailer" className="scroll-mt-28 py-14 lg:py-20">
          <SectionHeading
            number="01"
            eyebrow="Official video"
            title="Watch the trailer"
            icon={<Play className="h-5 w-5 fill-current" />}
          />
          <div className="mt-7 overflow-hidden border border-white/10 bg-black shadow-[0_35px_100px_rgba(0,0,0,.45)]">
            {youtubeKey ? (
              <YouTube id={youtubeKey} title={`${title} — Official Trailer`} />
            ) : (
              <div className="grid min-h-[360px] place-items-center px-6 py-14 text-center">
                <div>
                  <Play className="mx-auto h-10 w-10 text-white/20" />
                  <p className="mt-4 text-xl font-black">No embeddable trailer found</p>
                  <p className="mt-2 text-sm text-white/45">
                    More official videos may be available directly on YouTube.
                  </p>
                  <a
                    href={moreTrailersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
                  >
                    Search YouTube <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {cast.length > 0 && (
          <section className="border-t border-white/10 py-14 lg:py-20">
            <SectionHeading
              number="02"
              eyebrow="Faces of the story"
              title="Top cast"
              icon={<UsersRound className="h-5 w-5" />}
            />
            <div className="mt-7 flex snap-x gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cast.map((person: any, index: number) => {
                const profile = person.profile_path
                  ? `${IMAGE_BASE}/w342${person.profile_path}`
                  : null;
                return (
                  <article
                    key={person.credit_id ?? person.cast_id ?? person.id ?? index}
                    className="group w-[150px] shrink-0 snap-start overflow-hidden border border-white/10 bg-[#0b1018] transition hover:-translate-y-1 hover:border-yellow-400/60 sm:w-[180px]"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-white/5">
                      {profile ? (
                        <img
                          src={profile}
                          alt={person.name || "Cast member"}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="grid h-full place-items-center p-3 text-center text-xs text-white/30">
                          Photo unavailable
                        </div>
                      )}
                    </div>
                    <div className="min-h-[84px] border-t border-white/10 p-3">
                      <h3 className="line-clamp-1 text-sm font-black">{person.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                        {person.character || "Cast"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="border-y border-white/10 py-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                Keep exploring
              </p>
              <h2 className="mt-2 text-3xl font-black">
                More {tmdbType === "tv" ? "series" : "movies"} await.
              </h2>
              {status && <p className="mt-2 text-sm text-white/40">Current status: {status}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={tmdbType === "tv" ? "/tv" : "/movie"}
                className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 text-sm font-black text-black hover:bg-yellow-300"
              >
                Browse {tmdbType === "tv" ? "TV" : "Movies"} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/trending"
                className="border border-white/15 px-5 py-3 text-sm font-black hover:border-yellow-400/60 hover:text-yellow-300"
              >
                Trending now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[95px] items-center gap-4 border-white/10 px-5 py-4 sm:border-r sm:last:border-r-0">
      <Icon className="h-5 w-5 shrink-0 text-yellow-400" />
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30">{label}</p>
        <p className="mt-1 truncate text-sm font-black text-white/80">{value}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  number,
  eyebrow,
  title,
  icon,
}: {
  number: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-5">
      <div className="flex items-end gap-4">
        <span className="text-4xl font-black tracking-[-0.06em] text-white/10 sm:text-6xl">{number}</span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">{eyebrow}</p>
          <h2 className="mt-1 text-3xl font-black sm:text-4xl">{title}</h2>
        </div>
      </div>
      <span className="text-yellow-400">{icon}</span>
    </div>
  );
}