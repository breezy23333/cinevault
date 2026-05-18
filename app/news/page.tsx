import Image from "next/image";
import Link from "next/link";
import { discoverMovies } from "@/lib/fetchers";

export const revalidate = 300;

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

const hrefFor = (it: TMDBItem) => `/title/movie/${it.id}`;

export default async function NewsPage() {
  const [trending, releases] = await Promise.all([
    discoverMovies({ page: 1 }),
    discoverMovies({ year: 2024, page: 1 }),
  ]);

  const trendingItems: TMDBItem[] = trending?.results ?? [];
  const releaseItems: TMDBItem[] = releases?.results ?? [];

  const hero = trendingItems[0];
  const cards = [...trendingItems.slice(1, 7), ...releaseItems.slice(0, 6)];

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Industry Radar
        </p>

        <h1 className="text-5xl font-black">Top News</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Latest movie, TV, streaming, celebrity, and entertainment updates.
        </p>

        {hero && <HeroNews item={hero} />}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => (
            <NewsCard key={`${item.id}-${item.title}`} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function HeroNews({ item }: { item: TMDBItem }) {
  const title = item.title || item.name || "Untitled";
  const bg =
    item.backdrop_path &&
    `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;

  return (
    <Link
      href={hrefFor(item)}
      prefetch={false}
      className="mt-10 block overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-white/[0.04]"
    >
      <div className="relative aspect-[16/6]">
        {bg ? (
          <Image
            src={bg}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-white/10" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-8 left-8 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Breaking Story
          </p>

          <h2 className="text-4xl font-black md:text-6xl">{title}</h2>

          {item.overview && (
            <p className="mt-4 line-clamp-3 text-white/70">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ item }: { item: TMDBItem }) {
  const title = item.title || item.name || "Untitled";
  const img =
    item.backdrop_path &&
    `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;

  return (
    <Link
      href={hrefFor(item)}
      prefetch={false}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
    >
      <div className="relative h-56 bg-white/5">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Entertainment
        </p>

        <h2 className="mt-3 line-clamp-2 text-2xl font-black transition group-hover:text-yellow-300">
          {title}
        </h2>

        {item.overview && (
          <p className="mt-3 line-clamp-3 text-sm text-white/60">
            {item.overview}
          </p>
        )}

        <p className="mt-5 text-xs text-white/40">
          {item.release_date || item.first_air_date || "Latest update"}
        </p>
      </div>
    </Link>
  );
}