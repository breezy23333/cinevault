// app/tv/[id]/page.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import CineImage from "@/components/CineImage";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
import TrailerModal from "@/components/TrailerModal";
import ContinueWatchingTracker from "@/components/ContinueWatchingTracker";
import WatchlistButton from "@/components/WatchlistButton";
import WatchOptions from "@/components/WatchOptions";
import TVSeasons from "@/components/TVSeasons";
import AwardsSection from "@/components/AwardsSection";
import { fetchAwardsByImdbId } from "@/lib/awards";
import {
  getTVDetails,
  getTVVideos,
  getTVCredits,
  getSimilarTV,
  fetchTmdbProviders,
} from "@/lib/fetchers";

export const runtime = "nodejs";
export const revalidate = 86400;

const SITE_URL = "https://cinryvan.vercel.app";

type PageProps = { params: Promise<{ id: string }> };

type TMDBVideo = {
  key?: string;
  name?: string;
  site?: string;
  type?: string;
  official?: boolean;
  published_at?: string;
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
  vote_average?: number | null;
};

const imageUrl = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const withTimeout = <T,>(promise: Promise<T>, milliseconds = 8000, label = "fetch") =>
  Promise.race<T>([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout`)), milliseconds),
    ),
  ]);

function pickTrailer(videos: TMDBVideo[]) {
  return (
    videos.find(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube" &&
        video.official &&
        video.key,
    )?.key ?? videos.find((video) => video.site === "YouTube" && video.key)?.key
  );
}

function formatEpisodeRuntime(values?: number[]) {
  const minutes = Array.isArray(values) ? values.find((value) => value > 0) : null;
  return minutes ? `${minutes} min episodes` : null;
}

function cleanSeoText(value?: string | null) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSeoText(value: string, maximumLength = 158) {
  if (value.length <= maximumLength) return value;

  const shortened = value
    .slice(0, maximumLength - 1)
    .replace(/\s+\S*$/, "")
    .replace(/[,:;.!?\s]+$/, "");

  return `${shortened}…`;
}

function toIsoDuration(minutes?: number | null) {
  if (!minutes || minutes < 1) return undefined;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours ? `${hours}H` : ""}${
    remainingMinutes ? `${remainingMinutes}M` : ""
  }`;
}

export default async function TvPage({ params }: PageProps) {
  const { id: idString } = await params;
  if (!/^\d+$/.test(idString)) notFound();
  const id = Number(idString);
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  const [detailsResult, videosResult, creditsResult, similarResult, providersResult] =
    await Promise.allSettled([
      withTimeout(getTVDetails(id), 9000, "details"),
      withTimeout(getTVVideos(id), 8000, "videos"),
      withTimeout(getTVCredits(id), 8000, "credits"),
      withTimeout(getSimilarTV(id), 8000, "similar"),
      withTimeout(fetchTmdbProviders(id, "tv"), 8000, "providers"),
    ]);

  const details: any =
    detailsResult.status === "fulfilled" ? detailsResult.value : null;
  if (!details) notFound();

  const awards = await fetchAwardsByImdbId(
    details.external_ids?.imdb_id,
  ).catch(() => null);
  const videos: TMDBVideo[] =
    videosResult.status === "fulfilled" &&
    Array.isArray((videosResult.value as any)?.results)
      ? (videosResult.value as any).results
      : [];
  const cast: Cast[] =
    creditsResult.status === "fulfilled" &&
    Array.isArray((creditsResult.value as any)?.cast)
      ? (creditsResult.value as any).cast.slice(0, 12)
      : [];
  const similar: SimilarTV[] =
    similarResult.status === "fulfilled" &&
    Array.isArray((similarResult.value as any)?.results)
      ? (similarResult.value as any).results.slice(0, 14)
      : [];
  const providersData: any =
    providersResult.status === "fulfilled" ? providersResult.value : null;

  const requestHeaders = await headers();
  const detectedCountry = requestHeaders
    .get("x-vercel-ip-country")
    ?.trim()
    .toUpperCase();
  const country =
    detectedCountry && /^[A-Z]{2}$/.test(detectedCountry)
      ? detectedCountry
      : "US";
  const watchData = providersData?.results?.[country] ?? null;

  const title = details.name || details.original_name || "Untitled";
  const backdrop =
    imageUrl(details.backdrop_path, "original") ||
    imageUrl(details.poster_path, "w1280");
  const poster = imageUrl(details.poster_path, "w500");
  const year = (details.first_air_date || "").slice(0, 4);
  const rating =
    typeof details.vote_average === "number" && details.vote_average > 0
      ? Math.round(details.vote_average * 10) / 10
      : null;
  const ratingPercent = rating ? Math.min(Math.max(rating * 10, 0), 100) : 0;
  const trailerKey = pickTrailer(videos);
  const trailerVideo = videos.find(
    (video) => video.key === trailerKey,
  );
  const genres = Array.isArray(details.genres) ? details.genres : [];
  const seasons = Array.isArray(details.seasons) ? details.seasons : [];
  const networks = Array.isArray(details.networks) ? details.networks.slice(0, 6) : [];
  const studios = Array.isArray(details.production_companies)
    ? details.production_companies.slice(0, 6)
    : [];
  const creators = Array.isArray(details.created_by) ? details.created_by.slice(0, 5) : [];
  const episodeRuntime = formatEpisodeRuntime(details.episode_run_time);
  const extras = videos
    .filter((video) => video.site === "YouTube" && video.key)
    .filter((video) =>
      ["Trailer", "Teaser", "Featurette", "Behind the Scenes", "Clip"].includes(
        video.type || "",
      ),
    )
    .slice(0, 6);

    const tvImages = Array.from(
    new Set(
      [poster, backdrop]
        .filter(Boolean) as string[],
    ),
  );

  const imdbId =
    details.external_ids?.imdb_id ||
    null;

  const episodeMinutes =
    Array.isArray(details.episode_run_time)
      ? details.episode_run_time.find(
          (value: number) => value > 0,
        )
      : null;

  const firstAirYear =
    details.first_air_date?.slice(0, 4) || "";

  const lastAirYear =
    details.last_air_date?.slice(0, 4) || "";

  const tvJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "@id": `${SITE_URL}/tv/${id}#series`,

    name: title,

    alternateName:
      details.original_name &&
      details.original_name !== title
        ? details.original_name
        : undefined,

    description:
      cleanSeoText(details.overview) ||
      `Discover ${title} on CINRYVAN.`,

    url: `${SITE_URL}/tv/${id}`,
    mainEntityOfPage: `${SITE_URL}/tv/${id}`,

    image:
      tvImages.length > 0
        ? tvImages
        : [`${SITE_URL}/og-image.png`],

    thumbnailUrl:
      poster ||
      backdrop ||
      `${SITE_URL}/og-image.png`,

    datePublished:
      details.first_air_date || undefined,

    startDate:
      details.first_air_date || undefined,

    endDate:
      details.status === "Ended"
        ? details.last_air_date || undefined
        : undefined,

    duration:
      toIsoDuration(episodeMinutes),

    genre:
      genres.map((genre: any) => genre.name),

    inLanguage:
      details.original_language || undefined,

    numberOfSeasons:
      details.number_of_seasons || undefined,

    numberOfEpisodes:
      details.number_of_episodes || undefined,

    sameAs:
      imdbId
        ? `https://www.imdb.com/title/${imdbId}/`
        : undefined,

    creator:
      creators.map((person: any) => ({
        "@type": "Person",
        name: person.name,
      })),

    actor:
      cast.slice(0, 10).map((person) => ({
        "@type": "Person",
        name: person.name,
        url: `${SITE_URL}/person/${person.id}`,
        characterName:
          person.character || undefined,
      })),

    productionCompany:
      studios.map((studio: any) => ({
        "@type": "Organization",
        name: studio.name,
      })),

    containsSeason:
      seasons
        .filter(
          (season: any) =>
            typeof season.season_number === "number",
        )
        .slice(0, 30)
        .map((season: any) => ({
          "@type": "TVSeason",
          name:
            season.name ||
            `Season ${season.season_number}`,
          seasonNumber: season.season_number,
          numberOfEpisodes:
            season.episode_count || undefined,
          datePublished:
            season.air_date || undefined,
          url:
            `${SITE_URL}/tv/${id}#season-${season.season_number}`,
        })),

    trailer:
      trailerKey
        ? {
            "@type": "VideoObject",
            name: `${title} official trailer`,
            description:
              `Watch the official trailer for ${title}.`,
            thumbnailUrl:
              `https://i.ytimg.com/vi/${trailerKey}/hqdefault.jpg`,
            embedUrl:
              `https://www.youtube-nocookie.com/embed/${trailerKey}`,
            contentUrl:
              `https://www.youtube.com/watch?v=${trailerKey}`,
            uploadDate: trailerVideo?.published_at || undefined,
          }
        : undefined,

    aggregateRating:
      rating && details.vote_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            ratingCount: details.vote_count,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,

    temporalCoverage:
      firstAirYear
        ? lastAirYear && lastAirYear !== firstAirYear
          ? `${firstAirYear}/${lastAirYear}`
          : firstAirYear
        : undefined,

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "TV Shows",
        item: `${SITE_URL}/tv`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}/tv/${id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] pb-24 text-white">
      <ContinueWatchingTracker
        id={details.id}
        media_type="tv"
        title={title}
        poster_path={details.poster_path}
        release_date={details.first_air_date}
        vote_average={details.vote_average}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* BROADCAST 01 — HERO */}
      <section className="relative min-h-[600px] overflow-hidden border-b border-red-500/20 bg-black pt-24 sm:min-h-[640px] lg:min-h-[680px]">
        <CineImage
          src={backdrop}
          alt=""
          fallback="Backdrop unavailable"
          className="scale-105 object-cover object-center opacity-30 blur-xl"
        />
        <CineImage
          src={backdrop}
          alt={`${title} backdrop`}
          fallback="Backdrop unavailable"
          className="object-contain object-right opacity-95"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute left-0 top-1/3 h-px w-36 bg-red-500/80" />

        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-end px-4 pb-9 sm:min-h-[540px] md:px-6 lg:min-h-[580px] lg:pb-12">
          <div className="max-w-3xl bg-black/45 p-5 backdrop-blur-[2px] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,.45)]" />
              <p className="text-xs font-black uppercase tracking-[0.42em] text-red-400">
                CINRYVAN Broadcast
              </p>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-[.92] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
              {title}
            </h1>
            {details.tagline && (
              <p className="mt-4 text-lg font-semibold italic text-white/55 sm:text-xl">
                “{details.tagline}”
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-red-500 px-3 py-2 text-white">TV Series</span>
              {year && <MetaChip>{year}</MetaChip>}
              {details.number_of_seasons && (
                <MetaChip>
                  {details.number_of_seasons} season{details.number_of_seasons === 1 ? "" : "s"}
                </MetaChip>
              )}
              {details.number_of_episodes && (
                <MetaChip>{details.number_of_episodes} episodes</MetaChip>
              )}
              {episodeRuntime && <MetaChip>{episodeRuntime}</MetaChip>}
              {genres.slice(0, 3).map((genre: any) => (
                <MetaChip key={genre.id ?? genre.name}>{genre.name}</MetaChip>
              ))}
            </div>

            <p className="mt-5 line-clamp-2 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {details.overview ||
                `Explore ${title}, its seasons, episodes, cast, videos and official watch options on CINRYVAN.`}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {trailerKey && <TrailerModal videoKey={trailerKey} />}
              <Link
                href="#seasons"
                className="inline-flex items-center border border-red-400/45 bg-red-500/10 px-5 py-3 text-sm font-black text-red-200 backdrop-blur transition hover:bg-red-500 hover:text-white"
              >
                Explore seasons ↓
              </Link>
              <Link
                href="#watch"
                className="inline-flex items-center border border-white/20 bg-black/30 px-5 py-3 text-sm font-black backdrop-blur transition hover:border-yellow-400/70 hover:text-yellow-300"
              >
                Where to watch
              </Link>

               {similar.length > 0 && (
                  <Link
                    href="#similar-series"
                    className="inline-flex items-center border border-red-400/45 bg-red-500/10 px-5 py-3 text-sm font-black text-red-200 backdrop-blur transition hover:bg-red-500 hover:text-white"
                  >
                    Explore similar series ↓
                  </Link>
                )}   

              <WatchlistButton
                id={details.id}
                media_type="tv"
                title={title}
                poster_path={details.poster_path}
                release_date={details.first_air_date}
                vote_average={details.vote_average}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 right-6 z-10 hidden items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/30 lg:flex">
          <span>Transmission active</span>
          <span className="h-px w-16 bg-red-500/70" />
        </div>
      </section>

            {similar.length > 0 && (
        <section className="relative z-20 border-b border-red-500/20 bg-[#0b1018]">
          <div className="mx-auto max-w-7xl px-4 py-7 md:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                  Continue watching
                </p>

                <h2 className="mt-2 text-xl font-black sm:text-2xl">
                  If you like {title}
                </h2>
              </div>

              <Link
                href="#similar-series"
                className="hidden text-xs font-black text-white/45 transition hover:text-red-300 sm:block"
              >
                View all related series ↓
              </Link>
            </div>

            <div className="hide-scrollbar -mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
              {similar.slice(0, 8).map((series) => {
                const earlyPoster = imageUrl(series.poster_path, "w185");
                const earlyYear =
                  (series.first_air_date || "").slice(0, 4) || "Discover";

                return (
                  <Link
                    key={`early-tv-${series.id}`}
                    href={`/tv/${series.id}`}
                    prefetch={false}
                    className="group flex w-[220px] shrink-0 snap-start items-center gap-3 border border-white/10 bg-white/[0.035] p-2 transition hover:-translate-y-1 hover:border-red-400/65 hover:bg-white/[0.06] sm:w-[250px]"
                  >
                    <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-white/5">
                      <CineImage
                        src={earlyPoster}
                        alt={series.name || "Related TV series"}
                        fallback="Poster unavailable"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-black transition group-hover:text-red-300">
                        {series.name || "Untitled series"}
                      </h3>

                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                        {earlyYear}
                      </p>

                      <span className="mt-3 inline-block text-xs font-black text-red-400">
                        Open series →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BROADCAST 02 — SERIES DOSSIER */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
        <BroadcastHeading
          number="02"
          eyebrow="Series dossier"
          title={`The world of ${title}`}
          text="Story, broadcast history, creators, networks and audience response in one connected record."
        />

        <div className="mt-9 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_250px] lg:items-start">
          <div className="mx-auto w-full max-w-[320px] lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden border border-red-400/25 bg-[#111925] shadow-[0_35px_90px_rgba(0,0,0,.5)]">
              <CineImage
                src={poster}
                alt={`${title} poster`}
                fallback="Poster unavailable"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-red-500" />
            </div>
            <div className="mt-4">
              <WatchlistButton
                id={details.id}
                media_type="tv"
                title={title}
                poster_path={details.poster_path}
                release_date={details.first_air_date}
                vote_average={details.vote_average}
              />
            </div>
          </div>

          <div className="border-y border-white/10 py-6 lg:border-y-0 lg:border-l lg:border-r lg:px-7 lg:py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
              Synopsis
            </p>
            <p className="mt-4 text-base leading-8 text-white/62 sm:text-lg">
              {details.overview ||
                "A series synopsis is not available yet. Explore its seasons, cast and videos below."}
            </p>

            <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              <Fact label="Original title" value={details.original_name || title} />
              <Fact label="Status" value={details.status || "Unknown"} />
              <Fact label="First aired" value={details.first_air_date || "Unknown"} />
              <Fact label="Last aired" value={details.last_air_date || "Unknown"} />
              <Fact label="Seasons" value={String(details.number_of_seasons || "Unknown")} />
              <Fact label="Episodes" value={String(details.number_of_episodes || "Unknown")} />
              <Fact label="Episode length" value={episodeRuntime || "Unknown"} />
              <Fact label="Language" value={details.original_language?.toUpperCase() || "Unknown"} />
            </div>

            {creators.length > 0 && (
              <TagGroup title="Created by" items={creators} />
            )}
            {networks.length > 0 && <TagGroup title="Networks" items={networks} />}
            {studios.length > 0 && <TagGroup title="Studios" items={studios} />}
          </div>

          <aside className="border border-red-400/20 bg-[#101722] p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
              Audience signal
            </p>
            <div
              className="relative mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#ef4444 ${ratingPercent}%, rgba(255,255,255,.08) ${ratingPercent}% 100%)`,
              }}
            >
              <div className="grid h-[126px] w-[126px] place-items-center rounded-full bg-[#101722]">
                <div>
                  <p className="text-4xl font-black text-red-300">{rating ?? "—"}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                    TMDB / 10
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/35">
              {details.vote_count
                ? `${details.vote_count.toLocaleString()} recorded votes`
                : "No rating data available"}
            </p>
            <div className="mt-6 border-t border-white/10 pt-5 text-left">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400">
                Your rating
              </p>
              <UserRating movieId={id} tmdb={rating ?? undefined} />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <AwardsSection awards={awards} mediaType="tv" />
        </div>
      </section>

      {/* BROADCAST 03 — SEASONS */}
      <section id="seasons" className="scroll-mt-28 border-y border-red-500/20 bg-[#0c1018] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <BroadcastHeading
            number="03"
            eyebrow="Season archive"
            title="Every chapter of the series"
            text={`${details.number_of_seasons || seasons.length || "All"} seasons and ${details.number_of_episodes || "every available"} episodes collected in broadcast order.`}
          />

          <div className="mt-9 border border-white/10 bg-[#101722] p-4 sm:p-6 lg:p-8">
            <TVSeasons seasons={seasons} title={title} />
          </div>
        </div>
      </section>

      {/* BROADCAST 04 — OFFICIAL VIDEOS */}
      {extras.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <BroadcastHeading
            number="04"
            eyebrow="Transmission archive"
            title="Trailers, clips and featurettes"
            text="Official footage that expands the series beyond its episodes."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((video, index) => (
              <a
                key={`${video.key}-${index}`}
                href={`https://www.youtube.com/watch?v=${video.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-red-400/65"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <CineImage
                    src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name || video.type || "TV video"}
                    fallback="Video unavailable"
                    className="object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/15">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-red-500 text-sm font-black text-white transition group-hover:scale-110">
                      ▶
                    </span>
                  </div>
                  <span className="absolute left-3 top-3 text-[9px] font-black tracking-[0.2em] text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-400">
                    {video.type || "Video"}
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-black">
                    {video.name || `${title} official extra`}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* BROADCAST 05 — CAST */}
      {cast.length > 0 && (
        <section className="border-y border-white/10 bg-[#0c1018] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <BroadcastHeading
              number="05"
              eyebrow="The ensemble"
              title="Cast of the series"
              text="The performers behind the characters, conflicts and stories across every season."
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((person, index) => (
                <Link
                  key={`${person.id}-${index}`}
                  href={`/person/${person.id}`}
                  prefetch={false}
                  className="group relative overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-red-400/65"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                    <CineImage
                      src={imageUrl(person.profile_path, "w342")}
                      alt={person.name}
                      fallback="Actor photo unavailable"
                      className="object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent opacity-70" />
                    <span className="absolute left-2 top-2 text-[9px] font-black tracking-[0.2em] text-white/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-black transition group-hover:text-red-300">
                      {person.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                      {person.character || "Cast"}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BROADCAST 06 — WATCH */}
      <section id="watch" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
        <BroadcastHeading
          number="06"
          eyebrow="Now available"
          title="Where to watch"
          text={`Official streaming, rental and purchase information detected for ${country}.`}
        />
        <div className="mt-9 border border-white/10 bg-[#101722] p-5 sm:p-7">
          <WatchOptions title={title} watchData={watchData} country={country} />
        </div>
      </section>

      {/* BROADCAST 07 — RELATED SERIES */}
      {similar.length > 0 && (
        <section
          id="similar-series"
          className="scroll-mt-28 border-y border-white/10 bg-[#0c1018] py-16 lg:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <BroadcastHeading
              number="07"
              eyebrow="Next transmission"
              title="More series like this"
              text="Continue from this world into another story with a similar signal."
            />
            <div className="hide-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 md:-mx-6 md:px-6">
              {similar.map((series, index) => {
                const seriesYear = (series.first_air_date || "").slice(0, 4) || "—";
                const seriesRating =
                  typeof series.vote_average === "number" && series.vote_average > 0
                    ? series.vote_average.toFixed(1)
                    : null;
                return (
                  <Link
                    key={series.id}
                    href={`/tv/${series.id}`}
                    prefetch={false}
                    className="group relative w-[170px] shrink-0 snap-start overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-red-400/65 sm:w-[205px]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                      <CineImage
                        src={imageUrl(series.poster_path, "w342")}
                        alt={series.name || "TV poster"}
                        fallback="Poster unavailable"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      {seriesRating && (
                        <span className="absolute right-2 top-2 bg-red-500 px-2 py-1 text-[10px] font-black text-white">
                          ★ {seriesRating}
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 text-[9px] font-black tracking-[0.2em] text-white/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-black transition group-hover:text-red-300">
                        {series.name || "Untitled"}
                      </h3>
                      <p className="mt-2 text-xs text-white/35">{seriesYear}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BROADCAST 08 — COMMUNITY */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
        <BroadcastHeading
          number="08"
          eyebrow="After the episode"
          title="Join the conversation"
          text="Rate the series, share your perspective and continue exploring with the CINRYVAN community."
        />
        <div className="mt-9 border border-white/10 bg-[#101722] p-5 sm:p-7">
          <Comments movieId={id} title={title} />
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Trending TV Shows", "/trending"],
            ["Top Rated Shows", "/top"],
            ["Upcoming Series", "/upcoming"],
            ["Anime Series", "/anime"],
            ["Animated Shows", "/cartoons"],
            ["TV News", "/news"],
          ].map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between border border-white/10 bg-white/[0.025] p-4 text-sm font-black transition hover:border-red-400/65 hover:text-red-300"
            >
              <span>
                <span className="mr-3 text-[9px] text-red-400/65">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </span>
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="border border-white/15 bg-black/35 px-3 py-2 text-white/65">
      {children}
    </span>
  );
}

function BroadcastHeading({
  number,
  eyebrow,
  title,
  text,
}: {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-5 border-b border-white/10 pb-6 sm:grid-cols-[auto_1fr] sm:items-end">
      <span className="text-5xl font-black leading-none text-red-500/[0.14] sm:text-7xl">
        {number}
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-400">
          {eyebrow}
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-6 text-white/42">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0c121c] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/28">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white/75">{value}</p>
    </div>
  );
}

function TagGroup({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="mt-7">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id ?? item.name}
            className="border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/55"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return {
      title: "TV Show Not Found",
      description: "The requested TV show could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const tvId = Number(id);

  if (!Number.isSafeInteger(tvId) || tvId < 1) {
    return {
      title: "TV Show Not Found",
      description: "The requested TV show could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `${SITE_URL}/tv/${tvId}`;

  try {
    const tv = await withTimeout(
      getTVDetails(tvId),
      10000,
      "TV metadata",
    );

    if (!tv) {
      return {
        title: "TV Show Not Found",
        description: "The requested TV show could not be found on CINRYVAN.",
        alternates: {
          canonical,
        },
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const tvTitle = cleanSeoText(
      tv.name || tv.original_name || "TV Show",
    );

    const year = tv.first_air_date?.slice(0, 4) || "";

    const displayTitle = year
      ? `${tvTitle} (${year})`
      : tvTitle;

    /*
     * Root layout automatically adds: | CINRYVAN
     */
    const pageTitle = `${displayTitle}: Where to Watch`;

    const overview = cleanSeoText(tv.overview);
    const tagline = cleanSeoText(tv.tagline);

    const seasonCount =
      typeof tv.number_of_seasons === "number" &&
      tv.number_of_seasons > 0
        ? `${tv.number_of_seasons} ${
            tv.number_of_seasons === 1 ? "season" : "seasons"
          }`
        : "seasons and episodes";

    const discoveryText =
      `See the cast, trailer, ratings, ${seasonCount} and where to watch ${displayTitle} on CINRYVAN.`;

    const descriptionSource = overview
      ? `${overview} ${discoveryText}`
      : tagline
        ? `${tagline}. ${discoveryText}`
        : discoveryText;

    const description = truncateSeoText(
      descriptionSource,
      158,
    );

    const backdropImage = tv.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`
      : null;

    const posterImage = tv.poster_path
      ? `https://image.tmdb.org/t/p/w780${tv.poster_path}`
      : null;

    const socialImage =
      backdropImage ||
      posterImage ||
      `${SITE_URL}/og-image.png`;

    return {
      title: pageTitle,
      description,

      category: "Entertainment",

      alternates: {
        canonical,
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },

      openGraph: {
        title: `${pageTitle} | CINRYVAN`,
        description,
        url: canonical,
        siteName: "CINRYVAN",
        type: "video.tv_show",
        locale: "en_US",
        images: [
          {
            url: socialImage,
            alt: `${displayTitle} — TV series details on CINRYVAN`,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | CINRYVAN`,
        description,
        images: [
          {
            url: socialImage,
            alt: `${displayTitle} — TV series details on CINRYVAN`,
          },
        ],
      },
    };
  } catch {
    return {
      title: `TV Show ${tvId}: Details and Where to Watch`,
      description:
        "Discover TV show trailers, casts, seasons, episodes, ratings and watch options on CINRYVAN.",
      alternates: {
        canonical,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}
