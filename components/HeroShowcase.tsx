import Image from "next/image";
import Link from "next/link";

type FeaturedShowcase = {
  id: number;
  title: string;
  media: "movie" | "tv";
  year: string;
  backdrop: string | null;
  poster: string | null;
};

export default function HeroShowcase({
  featured,
  genreId,
}: {
  featured: FeaturedShowcase;
  genreId: string;
}) {
  const bg = featured.backdrop
    ? `https://image.tmdb.org/t/p/w1280${featured.backdrop}`
    : "/img/placeholder.jpg";

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl min-h-[420px] ring-1 ring-white/10 bg-black">
      <Image src={bg} alt={featured.title} fill priority className="object-cover opacity-60" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      <div className="relative z-10 max-w-2xl p-6 md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-400">
          Featured Showcase
        </p>

        <h1 className="text-4xl md:text-6xl font-black text-white">
          {featured.title}
        </h1>

        <p className="mt-3 text-white/70">
          {featured.year} • {featured.media.toUpperCase()}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/title/${featured.media}/${featured.id}`}
            className="rounded-full bg-white px-5 py-3 font-bold text-black hover:bg-white/90"
          >
            View Details
          </Link>

          <Link
            href={`/search?genre=${genreId}&page=1`}
            className="rounded-full bg-white/10 px-5 py-3 font-bold text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            Explore Genre
          </Link>
        </div>
      </div>
    </section>
  );
}