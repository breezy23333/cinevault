// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { discoverMovies, getMovieGenres } from "@/lib/fetchers";

export const revalidate = 300; // cache homepage for 5 minutes

// ---- types (minimal, to keep TS happy) ----
type TMDBItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
};

// helper to get a genre id by name (fallback to 27 = Horror)
function genresId(
  genres: { id: number; name: string }[] = [],
  name: string,
  fallback = 27
) {
  const norm = (s: string) =>
    s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
  return genres.find((g) => norm(g.name) === norm(name))?.id ?? fallback;
}

// simple href — discover endpoints here are movies
const hrefFor = (it: TMDBItem) => `/title/movie/${it.id}`;

export default async function HomePage() {
  // 1) parallel where independent
  const [genres, popular, year2024] = await Promise.all([
    getMovieGenres(),
    discoverMovies({ page: 1 }),            // Popular (popularity.desc)
    discoverMovies({ year: 2024, page: 1 }),// New in 2024
  ]);

  // 2) need genres to compute Horror id
  const horror = await discoverMovies({
    genreId: genresId(genres, "Horror"),
    page: 1,
  });

  const popularItems: TMDBItem[] = popular?.results ?? [];
  const yearItems: TMDBItem[] = year2024?.results ?? [];
  const horrorItems: TMDBItem[] = horror?.results ?? [];

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-10">
      <Hero item={popularItems[0]} />

      <Row title="Popular now" items={popularItems} />
      <Row title="New in 2024" items={yearItems} />
      <Row title="Horror hits" items={horrorItems} />
    </main>
  );
}

function Hero({ item }: { item?: TMDBItem }) {
  if (!item) return null;
  const title = item.title || item.name || "Untitled";
  const bg =
    item.backdrop_path &&
    `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;

  return (
    <Link
      href={hrefFor(item)}
      prefetch={false}
      className="block rounded-2xl overflow-hidden border border-zinc-800"
    >
      <div className="relative aspect-[16/7]">
        {bg ? (
          <Image
            src={bg}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
          <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
          {item.overview && (
            <p className="max-w-2xl mt-2 opacity-80 hidden md:block">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function Row({ title, items }: { title: string; items: TMDBItem[] }) {
  if (!items?.length) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {items.slice(0, 12).map((it, i) => {
          const name = it.title || it.name || "Untitled";
          const poster =
            it.poster_path &&
            `https://image.tmdb.org/t/p/w342${it.poster_path}`;

          return (
            <li
              key={it.id}
              className="rounded overflow-hidden border border-zinc-800 bg-zinc-900"
            >
              <Link href={hrefFor(it)} prefetch={false} className="block">
                <div className="relative aspect-[2/3]">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 45vw, (max-width:1024px) 20vw, 16vw"
                      priority={i < 4}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                </div>
                <div className="p-2 text-sm truncate">{name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}