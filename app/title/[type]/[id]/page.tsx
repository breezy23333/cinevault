// app/title/[type]/[id]/page.tsx
import {
  fetchTmdbTitle,
  fetchTmdbProviders,
  searchWatchmodeByTmdb,
} from "@/lib/fetchers";
import TmdbProviders from "@/components/TmdbProviders";
import YouTube from "@/components/YouTube"; // client component; safe to import here


type PageProps = {
  params: { type: "movie" | "tv"; id: string };
  // In Next 15, searchParams is async in Server Components
  searchParams: Promise<{ region?: string }>;
};

// Pick the best YouTube trailer (Official Trailer > Trailer > Teaser > Clip, prefer region)
function pickBestYoutube(videos: any[] = [], region: string) {
  const isYT = (v: any) => v?.site === "YouTube";
  const score = (v: any) =>
    (v?.type === "Trailer" ? 4 : v?.type === "Teaser" ? 2 : v?.type === "Clip" ? 1 : 0) +
    (v?.official ? 1 : 0) +
    (v?.iso_3166_1?.toUpperCase?.() === region ? 0.3 : 0);
  const best = (videos || []).filter(isYT).sort((a, b) => score(b) - score(a))[0];
  return best?.key ?? null;
}

export default async function TitlePage({ params, searchParams }: PageProps) {
  const type: "movie" | "tv" = params.type === "tv" ? "tv" : "movie";
  const tmdbId = Number(params.id);

  // ✅ await the dynamic API before using it (Next 15 rule)
  const sp = await searchParams;
  const region = (sp?.region ?? "ZA").toUpperCase();

  // Fetch data in parallel
  const [t, w, providersByRegion] = await Promise.all([
    fetchTmdbTitle(tmdbId, type),
    searchWatchmodeByTmdb(tmdbId),
    fetchTmdbProviders(tmdbId, type),
  ]);

  // Basics
  const titleStr: string = t?.title || t?.name || "";
  const yearStr: string = (t?.release_date || t?.first_air_date || "").slice(0, 4);
  const poster = t?.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : "";
  const genres = (t?.genres || []).map((g: any) => g.name).join(" • ");
  const runtime = t?.runtime ?? (t?.episode_run_time?.[0] ?? null);
  const cast = (t?.credits?.cast || []).slice(0, 8);

  // Trailer
  const videos = Array.isArray(t?.videos?.results) ? t.videos.results : [];
  const ytKey = pickBestYoutube(videos, region);
  const moreUrl =
    "https://www.youtube.com/results?" +
    new URLSearchParams({ q: `${titleStr} trailer ${yearStr || ""}` }).toString();

  // Providers
  const tmdbPv = providersByRegion?.[region];
  const wmSources = (w?.sources || []).filter(
    (s: any) => !s.region || s.region.toUpperCase() === region
  );

  return (
    <main className="mx-auto max-w-6xl p-6">
      <section className="grid md:grid-cols-[280px,1fr] gap-8 items-start">
        {/* Poster */}
        {poster ? (
          <img
            src={poster}
            alt={`${titleStr} poster`}
            className="rounded-2xl shadow w-[280px] border border-zinc-200"
          />
        ) : (
          <div className="h-[420px] w-[280px] rounded-2xl bg-zinc-100 border border-zinc-200" />
        )}

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold">
            {titleStr} {yearStr && <span className="text-zinc-500">({yearStr})</span>}
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            {genres} {runtime ? `• ${runtime} min` : ""}
          </p>

          {t?.overview && (
            <p className="mt-4 text-zinc-800/90 leading-relaxed">{t.overview}</p>
          )}

          {/* Where to watch */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Where to watch ({region})</h2>

            {wmSources.length ? (
              <ul className="space-y-2">
                {wmSources.map((p: any, i: number) => (
                  <li key={`${p.name}-${i}`}>
                    <a
                      className="underline hover:opacity-80"
                      href={p.web_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.name} — {p.type} {p.price ? `• ${p.price}` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <TmdbProviders pv={tmdbPv} />
            )}

            {/* Quick region switchers */}
            <div className="mt-4 text-sm opacity-80 flex gap-2">
              {["ZA", "US", "GB", "IN", "CA"].map((r) => (
                <a
                  key={r}
                  href={`?region=${r}`}
                  className={`rounded px-2 py-1 border ${
                    r === region ? "border-zinc-600" : "border-zinc-300"
                  }`}
                >
                  {r}
                </a>
              ))}
            </div>
          </div>

          {/* Trailer */}
          <section className="mt-8" id="trailer">
            <h2 className="text-xl font-semibold mb-2">Trailer</h2>

            {ytKey ? (
              // Your client component is nicer (lazy + privacy settings)
              <YouTube id={ytKey} title={`${titleStr} — Trailer`} />
            ) : (
              <>
                <p className="text-sm text-zinc-600">No embeddable trailer found.</p>
                <div className="mt-3">
                  <a
                    href={moreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg border border-zinc-300 px-3 py-2 hover:bg-zinc-50"
                  >
                    More trailers on YouTube ↗
                  </a>
                </div>
              </>
            )}
          </section>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Top cast</h2>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cast.map((c: any, i: number) => (
                  <li
                    key={c.credit_id ?? c.cast_id ?? c.id ?? i}
                    className="rounded-lg border border-zinc-200 p-3 bg-white/80"
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-zinc-600">{c.character}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}