// app/search/page.tsx
import Image from "next/image";
import Link from "next/link";
import { discoverMovies, searchTitles } from "@/lib/fetchers";

export const runtime = process.env.NODE_ENV === "development" ? "nodejs" : "edge";
export const revalidate = 60;

/* ---------------- helpers ---------------- */

type SP = { [key: string]: string | string[] | undefined };

const getParam = (sp: SP | undefined, k: string) => {
  const v = sp?.[k];
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
};

const tmdb = (p?: string | null, size = "w342") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  year: string;
  poster: string | null;   // can be from poster_path or (fallback) backdrop_path
  href: string;
};

/** movie/tv only; prefer poster; fallback to backdrop; return null for imageless items */
function toNorm(x: any): Norm | null {
  if (!x || x.media_type === "person") return null; // filter people

  const media: "movie" | "tv" = x.media_type === "tv" || x.first_air_date ? "tv" : "movie";
  const title = x.title || x.name || "Untitled";
  const year = String(x.release_date || x.first_air_date || "").slice(0, 4) || "—";

  // prefer poster; fallback to smaller backdrop and crop via CSS object-cover
  const poster =
    tmdb(x.poster_path, "w342") ||
    tmdb(x.backdrop_path, "w300"); // a bit wider, but we'll crop to 2:3

  if (!poster) return null; // drop imageless items entirely

  return {
    id: Number(x.id),
    media,
    title,
    year,
    poster,
    href: `/${media}/${x.id}`,
  };
}


function buildHref(nextPage: number, params: { q?: string; year?: number; genreId?: number }) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.year) usp.set("year", String(params.year));
  if (params.genreId) usp.set("genre", String(params.genreId));
  usp.set("page", String(nextPage));
  return `/search?${usp.toString()}`;
}

/* ---------------- page ---------------- */

export default async function SearchPage(
  { searchParams }: { searchParams?: SP } = {}
) {
  const qRaw = getParam(searchParams, "q");
  const yearStr = getParam(searchParams, "year");
  const genreStr = getParam(searchParams, "genre");
  const pageStr = getParam(searchParams, "page");

  const q = qRaw.trim();
  const year = yearStr ? Number(yearStr) : undefined;
  const genreId = genreStr ? Number(genreStr) : undefined;
  const page = Math.max(1, Number(pageStr || "1") || 1);

  // fetch
  let data: any = null;
  try {
    data = q ? await searchTitles(q, page) : await discoverMovies({ year, genreId, page });
  } catch {
    data = { results: [], total_pages: 1 };
  }

  const raw: any[] = Array.isArray(data?.results) ? data.results : [];

  // normalize, filter, and cap to keep the grid light
  const items: Norm[] = raw
    .map(toNorm)
    .filter((x): x is Norm => !!x)
    .sort((a, b) => (b.poster ? 1 : 0) - (a.poster ? 1 : 0))
    .slice(0, 40);

  const totalPages = Math.min(Number(data?.total_pages || 1), 500);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">
        {q ? `Results for “${q}”` : "Discover Movies"}
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-lg font-medium">No titles found.</p>
          <p className="mt-2 text-sm text-zinc-600">
            Try a different search, clear filters, or choose another page.
          </p>
          <div className="mt-4">
            <Link
              href="/search"
              className="inline-block rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Clear filters
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((it) => (
            <li key={`${it.media}-${it.id}`} className="group">
              <Link
                href={it.href}
                className="block overflow-hidden rounded-xl border border-zinc-200 transition hover:-translate-y-0.5 hover:shadow"
                prefetch
              >
                <div className="relative aspect-[2/3] bg-white/5">
                  {it.poster ? (
                     <Image
                        src={it.poster}
                        alt={it.title}
                        fill
                        sizes="180px"
                        loading="lazy"
                        placeholder="empty"
                        className="object-cover"
                      />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                      No poster
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium">{it.title}</h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    {it.year} • {it.media.toUpperCase()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* pagination */}
      <div className="mt-8 flex items-center justify-between">
        <Link
          aria-disabled={!hasPrev}
          href={hasPrev ? buildHref(page - 1, { q, year, genreId }) : "#"}
          className={`rounded-xl border px-4 py-2 text-sm ${
            hasPrev ? "hover:bg-zinc-50" : "pointer-events-none opacity-40"
          }`}
        >
          ← Prev
        </Link>
        <span className="text-sm text-zinc-600">
          Page {page} of {totalPages}
        </span>
        <Link
          aria-disabled={!hasNext}
          href={hasNext ? buildHref(page + 1, { q, year, genreId }) : "#"}
          className={`rounded-xl border px-4 py-2 text-sm ${
            hasNext ? "hover:bg-zinc-50" : "pointer-events-none opacity-40"
          }`}
        >
          Next →
        </Link>
      </div>
    </main>
  );
}
