import {
  getUpcomingMovies,
  getUpcomingTvSeries,
  getUpcomingAnimation,
} from "@/lib/fetchers";
import Link from "next/link";

export const revalidate = 300;

const img = (path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : "/og-image.png";

function year(item: any) {
  return String(item.release_date || item.first_air_date || "").slice(0, 4);
}

function Card({ item, type }: { item: any; type: "movie" | "tv" }) {
  const title = item.title || item.name || "Untitled";

  return (
    <Link
      href={`/${type}/${item.id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-yellow-400/50 hover:bg-white/[0.08]"
    >
      <img
        src={img(item.poster_path)}
        alt={title}
        className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="p-4">
        <h3 className="line-clamp-1 font-black text-yellow-300">{title}</h3>
        <p className="mt-1 text-sm text-white/50">{year(item) || "Coming soon"}</p>
      </div>
    </Link>
  );
}

function Section({
  title,
  eyebrow,
  items,
  type,
}: {
  title: string;
  eyebrow: string;
  items: any[];
  type: "movie" | "tv";
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items
            .filter((item: any) => item.poster_path)
            .map((item: any) => (
                <Card key={`${type}-${item.id}`} item={item} type={type} />
        ))}
      </div>
    </section>
  );
}

export default async function UpcomingPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page || 1));

    const [movies, tv, animation] = await Promise.all([
    getUpcomingMovies(page),
    getUpcomingTvSeries(page),
    getUpcomingAnimation(page),
    ]);

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-[1500px] space-y-10">
        <section className="rounded-[34px] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-blue-500/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            CineVault Future Radar
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Upcoming Movies, TV Series & Animation
          </h1>
          <p className="mt-4 max-w-3xl text-white/65">
            Track the next cinematic releases before they arrive.
          </p>
        </section>

        <Section
          eyebrow="Coming Soon"
          title="Upcoming Movies"
          items={movies}
          type="movie"
        />

        <Section
          eyebrow="Series Radar"
          title="Upcoming TV Series"
          items={tv}
          type="tv"
        />

        <Section
          eyebrow="Animation Signal"
          title="Upcoming Animation"
          items={animation}
          type="movie"
        />

        <div className="flex items-center justify-center gap-4 pt-4">
            {page > 1 && (
                <Link
                href={`/upcoming?page=${page - 1}`}
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-bold transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
                >
                ← Previous
                </Link>
            )}

            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-black text-yellow-300">
                Page {page}
            </span>

            <Link
                href={`/upcoming?page=${page + 1}`}
                scroll={false}
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 font-bold transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
            >
                Next →
            </Link>
        </div>

      </div>
    </main>
  );
}