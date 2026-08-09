import Link from "next/link";
import type { Metadata } from "next";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN ||
    process.env.NEXT_PUBLIC_TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const startYear = Number(year);
  const endYear = startYear + 9;

  return {
    title: `${startYear}s Movies | CINRYVAN`,
    description: `Explore popular movies released between ${startYear} and ${endYear} on CINRYVAN.`,
    alternates: {
      canonical: `/era/${startYear}`,
    },
    openGraph: {
      title: `${startYear}s Movies | CINRYVAN`,
      description: `Discover popular movies from the ${startYear}s era on CINRYVAN.`,
      url: `/era/${startYear}`,
      siteName: "CINRYVAN",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${startYear}s Movies | CINRYVAN`,
      description: `Explore popular movies from ${startYear} to ${endYear}.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function EraPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { year } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page || "1");

  const startYear = Number(year);
  const endYear = startYear + 9;

  const url = `${TMDB_BASE}/discover/movie?include_adult=false&language=en-US&page=${currentPage}&sort_by=popularity.desc&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;

  const res = await fetch(url, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  const movies = data.results || [];

  const eraJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${startYear}s Movies`,
    description: `Explore popular movies released between ${startYear} and ${endYear}.`,
    url: `https://cinryvan.vercel.app/era/${startYear}`,
    isPartOf: {
        "@type": "WebSite",
        name: "CINRYVAN",
        url: "https://cinryvan.vercel.app",
    },
    };

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-28 text-white">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(eraJsonLd),
            }}
        />
        <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            Cinema Through Time
        </p>

        <h1 className="mt-3 text-5xl font-black md:text-7xl">
            {startYear}s Movies
        </h1>

        <p className="mt-4 max-w-2xl text-white/60">
            Explore popular movies released between {startYear} and {endYear}.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie: any) => (
            <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-yellow-400/50"
            >
                <div className="h-[300px] bg-white/5">
                {movie.poster_path ? (
                    <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-white/40">
                    No image
                    </div>
                )}
                </div>

                <div className="p-4">
                <h3 className="line-clamp-2 font-black">{movie.title}</h3>
                <p className="mt-2 text-sm text-white/45">
                    {movie.release_date?.slice(0, 4) || "Unknown"}
                </p>
                </div>
            </Link>
            ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 && (
            <Link
                href={`/era/${startYear}?page=${currentPage - 1}`}
                className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-bold hover:border-yellow-400 hover:text-yellow-300"
            >
                ← Previous
            </Link>
            )}

            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 font-black text-yellow-300">
            Page {currentPage}
            </span>

            <Link
            href={`/era/${startYear}?page=${currentPage + 1}`}
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-bold hover:border-yellow-400 hover:text-yellow-300"
            >
            Next →
            </Link>
        </div>
        </section>
    </main>
    );
}