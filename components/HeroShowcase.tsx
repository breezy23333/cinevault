// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import HeroShowcase from "@/components/HeroShowcase";
import { getPopularMovies, getTrendingAll } from "@/lib/fetchers";
import type { Title } from "@/lib/fetchers";

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  backdrop?: string | null;
  year: string;
};

// ------- helpers -------
function norm(list: unknown[]): Norm[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter((x: any) => x && typeof x.id === "number")
    .map((x: any) => ({
      id: x.id as number,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: (x.title || x.name || "Untitled") as string,
      poster: x.poster_path ?? null,
      backdrop: x.backdrop_path ?? null,
      year: ((x.release_date || x.first_air_date || "") as string).slice(0, 4),
    }));
}
function img(path?: string | null, size: "w500" | "w1280" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/img/placeholder.jpg";
}
function fallback(n: number): Title[] {
  const posters = [
    "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    "/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    "/wImh3pd3mFNVIDtZycsYO9wP4a0.jpg",
    "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  ];
  return Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    media_type: i % 3 === 0 ? "tv" : "movie",
    title: ["Dune", "Oppenheimer", "Arcane", "Barbie", "Inception"][i % 5],
    name: ["Arcane", "The Bear", "Silo"][i % 3],
    poster_path: posters[i % posters.length],
    backdrop_path: posters[(i + 2) % posters.length],
    release_date: "2023-07-21",
    first_air_date: "2023-12-01",
  }));
}

export const revalidate = 120;

export default async function Home() {
  // ------- fetch -------
  let popularRaw: Title[] = [];
  let trendingRaw: Title[] = [];
  try {
    [popularRaw, trendingRaw] = await Promise.all([getPopularMovies(), getTrendingAll()]);
  } catch {
    popularRaw = fallback(18);
    trendingRaw = fallback(12);
  }

  // Normalize for grids
  const popular = norm(popularRaw).slice(0, 18);
  const trending = norm(trendingRaw).slice(0, 12);

  // Build the featured item directly from RAW so we have TMDB paths available
  const heroRaw: any =
    (Array.isArray(trendingRaw) && (trendingRaw as any[]).find((t) => t?.backdrop_path)) ||
    popularRaw[0] ||
    trendingRaw[0];

  const featuredShowcase =
    heroRaw && {
      id: heroRaw.id as number,
      title: (heroRaw.title || heroRaw.name || "Featured") as string,
      media: heroRaw.media_type === "tv" ? "tv" : "movie",
      year: ((heroRaw.release_date || heroRaw.first_air_date || "") as string).slice(0, 4),
      backdrop: (heroRaw.backdrop_path || heroRaw.poster_path || null) as string | null,
      poster: (heroRaw.poster_path || null) as string | null,
    };

  // ------- render -------
  return (
    <main className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 py-6 md:px-8">
      {/* NEW: hero + fun facts (replace the old hero section with this) */}
      {featuredShowcase && <HeroShowcase featured={featuredShowcase} genreId="27" />}

      {/* Quick explore (kept) */}
      <QuickExplore />

      {/* Popular */}
      <Section title="Popular now">
        <Grid>
          {popular.map((m) => (
            <Card key={`p-${m.id}`} item={m} />
          ))}
        </Grid>
      </Section>

      {/* Trending */}
      <Section title="Trending">
        <Grid>
          {trending.map((m) => (
            <Card key={`t-${m.id}`} item={m} />
          ))}
        </Grid>
      </Section>
    </main>
  );
}

// ------- local UI bits (unchanged) -------
function QuickExplore() {
  const items = [
    { label: "Horror Night", emoji: "😱", href: "/search?genre=27&page=1", grad: "from-rose-500/40 to-fuchsia-500/30" },
    { label: "Laugh Out Loud", emoji: "😂", href: "/search?genre=35&page=1", grad: "from-amber-400/40 to-orange-500/30" },
    { label: "Sci-Fi Worlds", emoji: "🚀", href: "/search?genre=878&page=1", grad: "from-sky-500/40 to-indigo-500/30" },
    { label: "Drama Gems", emoji: "🎭", href: "/search?genre=18&page=1", grad: "from-rose-400/40 to-purple-500/30" },
  ];
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Quick explore</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className="group relative overflow-hidden rounded-2xl p-4 ring-1 ring-white/10 bg-white/5 backdrop-blur hover:ring-white/20 hover:shadow-xl hover:shadow-black/30 transition"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${it.grad} opacity-40 group-hover:opacity-60 transition`} />
            <div className="relative flex items-center gap-3">
              <span className="text-2xl">{it.emoji}</span>
              <span className="font-semibold">{it.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 rounded-3xl ring-1 ring-white/10 bg-white/5 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <a className="text-sm text-white/70 hover:underline" href="#">
          See more
        </a>
      </div>
      <div className="px-4 pb-4 md:px-6">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">{children}</div>;
}

function Card({ item }: { item: Norm }) {
  const href = `/title/${item.media}/${item.id}`;
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/30 hover:bg-black/40 transition"
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={img(item.poster)}
          alt={item.title}
          fill
          sizes="(min-width:1536px) 14vw, (min-width:1280px) 16vw, (min-width:1024px) 19vw, (min-width:640px) 28vw, 44vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3>
        <p className="mt-1 text-xs text-white/60">
          {item.year ? `${item.year} • ${item.media.toUpperCase()}` : item.media.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}