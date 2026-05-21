"use client";

import Image from "next/image";

type Season = {
  id: number;
  name: string;
  season_number: number;
  episode_count?: number;
  air_date?: string | null;
  poster_path?: string | null;
  overview?: string;
};

export default function TVSeasons({
  seasons,
  title,
}: {
  seasons: Season[];
  title: string;
}) {
  const cleanSeasons = seasons.filter((s) => s.season_number > 0);

  if (!cleanSeasons.length) return null;

  return (
    <section className="mt-14">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
        Episode Guide
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Seasons of {title}
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {cleanSeasons.map((season) => {
          const poster = season.poster_path
            ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
            : null;

          const trailerSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            `${title} ${season.name} trailer`
          )}`;

          return (
            <article
              key={season.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-yellow-400/50"
            >
              <div className="flex gap-4 p-4">
                <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-2xl bg-black/40">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={season.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-white/40">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-black text-white">
                    {season.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/50">
                    {season.episode_count || 0} episodes
                    {season.air_date ? ` • ${season.air_date.slice(0, 4)}` : ""}
                  </p>

                  {season.overview && (
                    <p className="mt-3 line-clamp-3 text-sm text-white/60">
                      {season.overview}
                    </p>
                  )}

                  <a
                    href={trailerSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-full border border-yellow-400/40 px-4 py-2 text-xs font-bold text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
                  >
                    Season trailer →
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}