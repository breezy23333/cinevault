import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
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
        (v.type === "Trailer" || v.type === "Teaser") &&
        v.site === "YouTube" &&
        v.official
    )?.key ?? videos.find((v) => v.site === "YouTube")?.key;

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
                {ytKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${ytKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-semibold text-black shadow hover:brightness-105"
                  >
                    ▶ Trailer
                  </a>
                )}

                <a
                  href="#watch-section"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 ring-1 ring-white/20 backdrop-blur hover:bg-white/15"
                >
                  Watch options
                </a>
                </div>

              <div className="mt-4">
                <UserRating movieId={id} tmdb={rating} />
              </div>
            </div>
          </div>
        </div>
      </section>

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

            <p className="text-white/70 mb-4">
              Streaming providers will appear here.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                Netflix
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                Amazon Prime
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                Disney+
              </div>
            </div>
          </section>

        <Comments movieId={id} title={title} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const tv = await getTVDetails(Number(id));

    const title = tv.name || tv.original_name || "TV Show";
    const year = tv.first_air_date ? tv.first_air_date.slice(0, 4) : "";

    return {
      title: `${title}${year ? ` (${year})` : ""} | CineVault`,
      description: tv.overview?.slice(0, 150) || `Watch ${title} on CineVault`,
    };
  } catch (error) {
    console.error("TV metadata error:", error);

    return {
      title: "TV Show | CineVault",
      description: "Watch TV shows on CineVault",
    };
  }
}