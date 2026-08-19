// app/title/[type]/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTmdbTitle, fetchTmdbProviders } from "@/lib/fetchers";
import TmdbProviders from "@/components/TmdbProviders";
import YouTube from "@/components/YouTube";

const IMAGE_BASE = "https://image.tmdb.org/t/p";
const REGIONS = ["ZA", "US", "GB", "IN", "CA"];

export const metadata: Metadata = {
  title: "Title Details | CINRYVAN",
  description: "Explore title information, trailers, cast and official watch providers on CINRYVAN.",
  robots: { index: false, follow: true },
};

type PageProps = {
  params: Promise<{ type: "movie" | "tv"; id: string }>;
  searchParams: Promise<{ region?: string | string[] }>;
};

function pickBestYoutube(videos: any[] = [], region: string) {
  const score = (video: any) =>
    (video?.type === "Trailer" ? 4 : video?.type === "Teaser" ? 2 : video?.type === "Clip" ? 1 : 0) +
    (video?.official ? 1 : 0) +
    (video?.iso_3166_1?.toUpperCase?.() === region ? 0.3 : 0);

  return [...videos]
    .filter((video) => video?.site === "YouTube" && video?.key)
    .sort((first, second) => score(second) - score(first))[0]?.key ?? null;
}

function parseRegion(value?: string | string[]) {
  const candidate = (Array.isArray(value) ? value[0] : value || "ZA").toUpperCase();
  return /^[A-Z]{2}$/.test(candidate) ? candidate : "ZA";
}

function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes < 1) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder ? `${remainder}m` : ""}`.trim() : `${remainder}m`;
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
  const poster = titleData.poster_path ? `${IMAGE_BASE}/w500${titleData.poster_path}` : null;
  const backdrop = titleData.backdrop_path ? `${IMAGE_BASE}/w1280${titleData.backdrop_path}` : null;
  const genres = Array.isArray(titleData.genres) ? titleData.genres : [];
  const runtimeMinutes = titleData.runtime ?? titleData.episode_run_time?.[0] ?? null;
  const runtime = formatRuntime(runtimeMinutes);
  const rating =
    typeof titleData.vote_average === "number" && titleData.vote_average > 0
      ? titleData.vote_average.toFixed(1)
      : null;
  const voteCount =
    typeof titleData.vote_count === "number" ? titleData.vote_count.toLocaleString() : null;
  const cast = Array.isArray(titleData.credits?.cast) ? titleData.credits.cast.slice(0, 10) : [];
  const videos = Array.isArray(titleData.videos?.results) ? titleData.videos.results : [];
  const youtubeKey = pickBestYoutube(videos, region);
  const providers = providersByRegion?.[region];
  const mediaLabel = tmdbType === "tv" ? "TV Series" : "Movie";
  const certification = titleData.adult ? "18+" : null;
  const seasons = tmdbType === "tv" && titleData.number_of_seasons ? `${titleData.number_of_seasons} season${titleData.number_of_seasons === 1 ? "" : "s"}` : null;
  const moreTrailersUrl =
    "https://www.youtube.com/results?" +
    new URLSearchParams({ q: `${title} ${year} official trailer` }).toString();

  return (
    <main className="min-h-screen bg-[#080b12] pb-24 text-white">
      <section className="relative min-h-[680px] overflow-hidden border-b border-white/10 bg-[#0a0e15] pt-24">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/88 to-[#080b12]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(250,204,21,.12),transparent_28%)]" />

        <div className="relative z-10 mx-auto grid min-h-[590px] max-w-7xl items-end gap-8 px-4 pb-12 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 lg:pb-16">
          <div className="hidden lg:block">
            <div className="relative aspect-[2/3] overflow-hidden border border-white/15 bg-[#111925] shadow-[0_35px_90px_rgba(0,0,0,.65)]">
              {poster ? (
                <img src={poster} alt={`${title} poster`} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center p-5 text-center text-sm text-white/35">Poster unavailable</div>
              )}
              <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-yellow-400" />
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]">
              <span className="bg-yellow-400 px-3 py-1.5 text-black">{mediaLabel}</span>
              {year && <span className="border border-white/15 bg-black/30 px-3 py-1.5 text-white/65">{year}</span>}
              {runtime && <span className="border border-white/15 bg-black/30 px-3 py-1.5 text-white/65">{runtime}</span>}
              {seasons && <span className="border border-white/15 bg-black/30 px-3 py-1.5 text-white/65">{seasons}</span>}
              {certification && <span className="border border-white/15 bg-black/30 px-3 py-1.5 text-white/65">{certification}</span>}
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            {originalTitle && originalTitle !== title && (
              <p className="mt-3 text-sm font-semibold text-white/35">Original title: {originalTitle}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {rating && (
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-yellow-400 bg-black/40 text-sm font-black text-yellow-300">
                    {rating}
                  </span>
                  <span className="text-xs font-bold leading-5 text-white/45">
                    TMDB rating
                    {voteCount && <span className="block">{voteCount} votes</span>}
                  </span>
                </div>
              )}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.slice(0, 5).map((genre: any) => (
                    <span key={genre.id ?? genre.name} className="text-sm font-bold text-white/55">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {titleData.overview && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
                {titleData.overview}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {youtubeKey && (
                <a href="#trailer" className="inline-flex bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300">
                  Watch trailer <span className="ml-2">▶</span>
                </a>
              )}
              <a href="#watch" className="inline-flex border border-white/15 bg-black/25 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300">
                Where to watch ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-14">
            <section id="trailer" className="scroll-mt-28">
              <SectionHeading eyebrow="Official video" title="Watch the trailer" />
              <div className="mt-6 overflow-hidden border border-white/10 bg-black shadow-[0_28px_80px_rgba(0,0,0,.4)]">
                {youtubeKey ? (
                  <YouTube id={youtubeKey} title={`${title} — Official Trailer`} />
                ) : (
                  <div className="grid min-h-[360px] place-items-center px-6 py-14 text-center">
                    <div>
                      <p className="text-xl font-black">No embeddable trailer found</p>
                      <p className="mt-2 text-sm text-white/45">More videos may be available directly on YouTube.</p>
                      <a
                        href={moreTrailersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex border border-white/15 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
                      >
                        Search YouTube ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {cast.length > 0 && (
              <section>
                <SectionHeading eyebrow="People behind the story" title="Top cast" />
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {cast.map((person: any, index: number) => {
                    const profile = person.profile_path ? `${IMAGE_BASE}/w342${person.profile_path}` : null;
                    return (
                      <article
                        key={person.credit_id ?? person.cast_id ?? person.id ?? index}
                        className="group overflow-hidden border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-yellow-400/60"
                      >
                        <div className="aspect-[2/3] overflow-hidden bg-white/5">
                          {profile ? (
                            <img
                              src={profile}
                              alt={person.name || "Cast member"}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="grid h-full place-items-center p-3 text-center text-xs text-white/30">Photo unavailable</div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="line-clamp-1 text-sm font-black">{person.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">{person.character || "Cast"}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside id="watch" className="scroll-mt-28 border border-white/10 bg-[#101722] p-5 shadow-[0_25px_70px_rgba(0,0,0,.3)] sm:p-6 lg:sticky lg:top-28">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Availability</p>
            <h2 className="mt-2 text-2xl font-black">Where to watch</h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Provider information for <strong className="text-white/70">{region}</strong>. Availability can change.
            </p>

            <div className="mt-6 border-y border-white/10 py-5">
              <TmdbProviders pv={providers} />
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Change region</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {REGIONS.map((regionCode) => (
                  <Link
                    key={regionCode}
                    href={`?region=${regionCode}`}
                    aria-current={regionCode === region ? "true" : undefined}
                    className={`grid h-9 min-w-11 place-items-center px-2 text-xs font-black transition ${
                      regionCode === region
                        ? "bg-yellow-400 text-black"
                        : "border border-white/10 bg-black/20 text-white/45 hover:border-yellow-400/60 hover:text-yellow-300"
                    }`}
                  >
                    {regionCode}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/30">
              CINRYVAN does not host premium films or episodes. Provider links open official external services.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-white/10 pb-5">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
    </div>
  );
}