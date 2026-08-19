// app/movie/[id]/page.tsx
import type { Metadata } from "next";
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
import MovieTickets from "@/components/MovieTickets";
import CinemaLocation from "@/components/CinemaLocation";
import AwardsSection from "@/components/AwardsSection";
import { fetchAwardsByImdbId } from "@/lib/awards";
import { fetchTmdbTitle, fetchTmdbProviders } from "@/lib/fetchers";

export const runtime = "nodejs";
export const revalidate = 86400;

type TMDBVideo = {
  key?: string;
  name?: string;
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

type Similar = {
  id: number;
  title?: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const SITE_URL = "https://cinryvan.vercel.app";

const imageUrl = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const withTimeout = <T,>(promise: Promise<T>, milliseconds = 8000, label = "fetch") =>
  Promise.race<T>([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout`)), milliseconds),
    ),
  ]);

function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes < 1) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder ? `${remainder}m` : ""}`.trim() : `${remainder}m`;
}

function formatMoney(value?: number | null) {
  if (!value || value < 1) return "Not disclosed";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function pickTrailer(videos: TMDBVideo[]) {
  return (
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official &&
        video.key,
    )?.key ?? videos.find((video) => video.site === "YouTube" && video.key)?.key
  );
}

export default async function MoviePage({ params }: PageProps) {
  const { id: idString } = await params;

  if (!/^\d+$/.test(idString)) notFound();
  const id = Number(idString);
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  const [detailsResult, providersResult] = await Promise.allSettled([
    withTimeout(fetchTmdbTitle(id, "movie"), 10000, "movie details"),
    withTimeout(fetchTmdbProviders(id, "movie"), 10000, "providers"),
  ]);

  const details: any =
    detailsResult.status === "fulfilled" ? detailsResult.value : null;
  if (!details) notFound();

  const awards = await fetchAwardsByImdbId(
    details.imdb_id || details.external_ids?.imdb_id,
  ).catch(() => null);

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

  const videos: TMDBVideo[] = Array.isArray(details.videos?.results)
    ? details.videos.results
    : [];
  const cast: Cast[] = Array.isArray(details.credits?.cast)
    ? details.credits.cast.slice(0, 12)
    : [];
  const similarSource =
    Array.isArray(details.recommendations?.results) &&
    details.recommendations.results.length > 0
      ? details.recommendations.results
      : details.similar?.results;
  const similar: Similar[] = Array.isArray(similarSource)
    ? similarSource.slice(0, 14)
    : [];

  const backdrop =
    imageUrl(details.backdrop_path, "original") ||
    imageUrl(details.poster_path, "w1280");
  const poster = imageUrl(details.poster_path, "w500");
  const year = (details.release_date || "").slice(0, 4);
  const runtime = formatRuntime(details.runtime);
  const rating =
    typeof details.vote_average === "number" && details.vote_average > 0
      ? Math.round(details.vote_average * 10) / 10
      : null;
  const ratingPercent = rating ? Math.min(Math.max(rating * 10, 0), 100) : 0;
  const trailerKey = pickTrailer(videos);
  const genres = Array.isArray(details.genres) ? details.genres : [];
  const studios = Array.isArray(details.production_companies)
    ? details.production_companies.slice(0, 6)
    : [];

  const imageBackdrops = Array.isArray(details.images?.backdrops)
    ? details.images.backdrops
        .map((image: any) => imageUrl(image.file_path, "w1280"))
        .filter(Boolean)
    : [];
  const gallery = Array.from(
    new Set(
      [backdrop, ...imageBackdrops]
        .filter(Boolean)
        .slice(0, 8) as string[],
    ),
  );

  const extras = videos
    .filter((video) => video.site === "YouTube" && video.key)
    .filter((video) =>
      ["Trailer", "Teaser", "Featurette", "Behind the Scenes", "Clip"].includes(
        video.type || "",
      ),
    )
    .slice(0, 6);

  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: details.title,
    description: details.overview,
    image: poster,
    datePublished: details.release_date,
    url: `${SITE_URL}/movie/${id}`,
    genre: genres.map((genre: any) => genre.name),
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
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Movies",
        item: `${SITE_URL}/movies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: details.title,
        item: `${SITE_URL}/movie/${id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] pb-24 text-white">
      <ContinueWatchingTracker
        id={details.id}
        media_type="movie"
        title={details.title}
        poster_path={details.poster_path}
        release_date={details.release_date}
        vote_average={details.vote_average}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* CHAPTER 01 — CINEMATIC HERO */}
      <section className="relative min-h-[760px] overflow-hidden border-b border-white/10 bg-black pt-24">
        <CineImage
          src={backdrop}
          alt={`${details.title} backdrop`}
          fallback="Backdrop unavailable"
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/72 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_35%,rgba(250,204,21,.12),transparent_26%)]" />

        <div className="relative z-10 mx-auto flex min-h-[660px] max-w-7xl items-end px-4 pb-14 md:px-6 lg:pb-20">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.42em] text-yellow-400">
              CINRYVAN Feature Presentation
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[.9] tracking-[-0.06em] sm:text-7xl lg:text-[92px]">
              {details.title}
            </h1>

            {details.tagline && (
              <p className="mt-4 text-lg font-semibold italic text-white/55 sm:text-xl">
                “{details.tagline}”
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-yellow-400 px-3 py-2 text-black">Movie</span>
              {year && (
                <span className="border border-white/15 bg-black/35 px-3 py-2 text-white/70">
                  {year}
                </span>
              )}
              {runtime && (
                <span className="border border-white/15 bg-black/35 px-3 py-2 text-white/70">
                  {runtime}
                </span>
              )}
              {details.status && (
                <span className="border border-white/15 bg-black/35 px-3 py-2 text-white/70">
                  {details.status}
                </span>
              )}
              {genres.slice(0, 4).map((genre: any) => (
                <span
                  key={genre.id ?? genre.name}
                  className="border border-white/15 bg-black/35 px-3 py-2 text-white/55"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-6 line-clamp-3 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              {details.overview ||
                `Explore ${details.title}, its cast, trailers, ratings and official watch options on CINRYVAN.`}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {trailerKey && <TrailerModal videoKey={trailerKey} />}
              <Link
                href="#watch"
                className="inline-flex items-center border border-white/20 bg-black/30 px-5 py-3 text-sm font-black backdrop-blur transition hover:border-yellow-400/70 hover:text-yellow-300"
              >
                Where to watch ↓
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
          </div>
        </div>

        <div className="absolute bottom-7 right-6 z-10 hidden items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/30 lg:flex">
          <span>Scroll to enter dossier</span>
          <span className="h-px w-16 bg-yellow-400/60" />
        </div>
      </section>

      {/* CHAPTER 02 — MOVIE DOSSIER */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
        <ChapterHeading
          number="02"
          eyebrow="The dossier"
          title={`Inside ${details.title}`}
          text="The essential information, creative team and audience response in one focused view."
        />

        <div className="mt-9 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_250px] lg:items-start">
          <div className="relative mx-auto w-full max-w-[320px] lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden border border-white/15 bg-[#111925] shadow-[0_35px_90px_rgba(0,0,0,.5)]">
              <CineImage
                src={poster}
                alt={`${details.title} poster`}
                fallback="Poster unavailable"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-yellow-400" />
            </div>
            <div className="mt-4">
              <WatchlistButton
                id={details.id}
                media_type="movie"
                title={details.title}
                poster_path={details.poster_path}
                release_date={details.release_date}
                vote_average={details.vote_average}
              />
            </div>
          </div>

          <div className="border-y border-white/10 py-6 lg:border-y-0 lg:border-l lg:border-r lg:px-7 lg:py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
              Story
            </p>
            <p className="mt-4 text-base leading-8 text-white/62 sm:text-lg">
              {details.overview ||
                "A detailed synopsis is not available yet. Explore the cast, videos and watch information below."}
            </p>

            <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              <Fact label="Original title" value={details.original_title || details.title} />
              <Fact label="Release date" value={details.release_date || "Unknown"} />
              <Fact label="Runtime" value={runtime || "Unknown"} />
              <Fact label="Language" value={details.original_language?.toUpperCase() || "Unknown"} />
              <Fact
                label="Collection"
                value={details.belongs_to_collection?.name || "Standalone movie"}
              />
              <Fact label="Status" value={details.status || "Unknown"} />
              <Fact label="Budget" value={formatMoney(details.budget)} />
              <Fact label="Revenue" value={formatMoney(details.revenue)} />
            </div>

            {studios.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Production studios
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {studios.map((studio: any) => (
                    <span
                      key={studio.id ?? studio.name}
                      className="border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/55"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="border border-white/10 bg-[#101722] p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
              Audience signal
            </p>

            <div
              className="relative mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#facc15 ${ratingPercent}%, rgba(255,255,255,.08) ${ratingPercent}% 100%)`,
              }}
            >
              <div className="grid h-[126px] w-[126px] place-items-center rounded-full bg-[#101722]">
                <div>
                  <p className="text-4xl font-black text-yellow-300">{rating ?? "—"}</p>
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
          <AwardsSection awards={awards} mediaType="movie" />
        </div>
      </section>

      {/* CHAPTER 03 — VISUAL ARCHIVE */}
      {(gallery.length > 1 || extras.length > 0) && (
        <section className="border-y border-white/10 bg-[#0c1119] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <ChapterHeading
              number="03"
              eyebrow="The visual archive"
              title="Scenes, trailers and extras"
              text="Step beyond the poster through stills, featurettes, interviews and official footage."
            />

            {gallery.length > 1 && (
              <div className="mt-9 grid auto-rows-[150px] grid-cols-2 gap-2 sm:auto-rows-[190px] md:grid-cols-4 lg:auto-rows-[220px]">
                {gallery.slice(0, 7).map((galleryImage, index) => (
                  <div
                    key={`${galleryImage}-${index}`}
                    className={`group relative overflow-hidden border border-white/10 bg-black ${
                      index === 0
                        ? "col-span-2 row-span-2"
                        : index === 3
                          ? "col-span-2"
                          : ""
                    }`}
                  >
                    <CineImage
                      src={galleryImage}
                      alt={`${details.title} scene ${index + 1}`}
                      fallback="Scene unavailable"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
                    <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-[0.24em] text-white/45">
                      Frame {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {extras.length > 0 && (
              <div className="mt-12">
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                      CINRYVAN Extras
                    </p>
                    <h3 className="mt-2 text-2xl font-black">Official videos</h3>
                  </div>
                  <span className="hidden text-xs text-white/30 sm:block">
                    Opens on YouTube ↗
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {extras.map((video, index) => (
                    <a
                      key={`${video.key}-${index}`}
                      href={`https://www.youtube.com/watch?v=${video.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-yellow-400/60"
                    >
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <CineImage
                          src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                          alt={video.name || video.type || "Movie video"}
                          fallback="Video unavailable"
                          className="object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 grid place-items-center bg-black/15">
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-yellow-400 text-sm font-black text-black transition group-hover:scale-110">
                            ▶
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-400">
                          {video.type || "Video"}
                        </p>
                        <h4 className="mt-2 line-clamp-2 font-black">
                          {video.name || `${details.title} official extra`}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CHAPTER 04 — CAST */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <ChapterHeading
            number="04"
            eyebrow="The people"
            title="Cast of characters"
            text="The performers who bring the story and its world to life."
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.map((person, index) => {
              const profile = imageUrl(person.profile_path, "w342");
              return (
                <Link
                  key={`${person.id}-${person.profile_path || index}`}
                  href={`/person/${person.id}`}
                  prefetch={false}
                  className="group relative overflow-hidden border border-white/10 bg-[#101722] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                    <CineImage
                      src={profile}
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
                    <h3 className="line-clamp-1 text-sm font-black transition group-hover:text-yellow-300">
                      {person.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                      {person.character || "Cast"}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CHAPTER 05 — WATCH */}
      <section id="watch" className="scroll-mt-28 border-y border-white/10 bg-[#0c1119] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ChapterHeading
            number="05"
            eyebrow="From discovery to screen"
            title="Watch the story"
            text={`Official provider information, cinema options and ticket discovery for ${country}.`}
          />

          <div className="mt-9 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="border border-white/10 bg-[#101722] p-5 sm:p-7">
              <WatchOptions
                title={details.title}
                watchData={watchData}
                country={country}
              />
            </div>
            <div className="grid gap-5">
              <div className="border border-white/10 bg-[#101722] p-5 sm:p-7">
                <MovieTickets title={details.title} />
              </div>
              <div className="border border-white/10 bg-[#101722] p-5 sm:p-7">
                <CinemaLocation title={details.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 06 — MORE LIKE THIS */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <ChapterHeading
            number="06"
            eyebrow="Continue the journey"
            title="More like this"
            text="Move from this story into another world with a similar signal."
          />

          <div className="hide-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 md:-mx-6 md:px-6">
            {similar.map((movie, index) => {
              const moviePoster = imageUrl(movie.poster_path, "w342");
              const movieYear = (movie.release_date || "").slice(0, 4) || "—";
              const movieRating =
                typeof movie.vote_average === "number" && movie.vote_average > 0
                  ? movie.vote_average.toFixed(1)
                  : null;

              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  prefetch={false}
                  className="group relative w-[170px] shrink-0 snap-start overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-yellow-400/60 sm:w-[205px]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                    <CineImage
                      src={moviePoster}
                      alt={movie.title || "Movie poster"}
                      fallback="Poster unavailable"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {movieRating && (
                      <span className="absolute right-2 top-2 bg-yellow-400 px-2 py-1 text-[10px] font-black text-black">
                        ★ {movieRating}
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 text-[9px] font-black tracking-[0.2em] text-white/55">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-black transition group-hover:text-yellow-300">
                      {movie.title || "Untitled"}
                    </h3>
                    <p className="mt-2 text-xs text-white/35">{movieYear}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CHAPTER 07 — COMMUNITY */}
      <section className="border-t border-white/10 bg-[#0c1119] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ChapterHeading
            number="07"
            eyebrow="The conversation"
            title="What did you think?"
            text="Rate the film, share your perspective and continue exploring with the CINRYVAN community."
          />

          <div className="mt-9 border border-white/10 bg-[#101722] p-5 sm:p-7">
            <Comments movieId={id} title={details.title} />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Trending Movies", "/trending"],
              ["Top Rated", "/top"],
              ["Upcoming Movies", "/upcoming"],
              ["Anime Collection", "/anime"],
              ["Cartoon Collection", "/cartoons"],
              ["Entertainment News", "/news"],
            ].map(([label, href], index) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between border border-white/10 bg-white/[0.025] p-4 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
              >
                <span>
                  <span className="mr-3 text-[9px] text-yellow-400/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {label}
                </span>
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ChapterHeading({
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
      <span className="text-5xl font-black leading-none text-white/[0.08] sm:text-7xl">
        {number}
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
      return {
        title: "Movie Not Found",
        robots: { index: false, follow: false },
      };
    }

    const movieId = Number(id);
    if (!Number.isSafeInteger(movieId) || movieId < 1) {
      return {
        title: "Movie Not Found",
        robots: { index: false, follow: false },
      };
    }

    const movie = await fetchTmdbTitle(movieId, "movie");
    const movieTitle = movie.title || movie.name || "Movie";
    const year = movie.release_date?.slice(0, 4) || "";
    const displayTitle = `${movieTitle}${year ? ` (${year})` : ""}`;
    const pageTitle = `${displayTitle} — Cast, Trailer & Where to Watch`;
    const seoIntro = `Explore ${displayTitle}: cast, trailer, ratings, runtime, similar movies and where to watch on CINRYVAN.`;
    const fullDescription = movie.overview?.trim()
      ? `${seoIntro} ${movie.overview.trim()}`
      : seoIntro;
    const description =
      fullDescription.length > 160
        ? `${fullDescription.slice(0, 157).replace(/\s+\S*$/, "")}...`
        : fullDescription;
    const image = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : movie.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : `${SITE_URL}/og-image.png`;
    const canonical = `${SITE_URL}/movie/${id}`;

    return {
      title: pageTitle,
      description,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: `${pageTitle} | CINRYVAN`,
        description,
        url: canonical,
        siteName: "CINRYVAN",
        images: [{ url: image, alt: `${displayTitle} movie` }],
        locale: "en_US",
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | CINRYVAN`,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Discover Movies",
      description:
        "Explore movie details, casts, trailers, ratings and where to watch on CINRYVAN.",
    };
  }
}