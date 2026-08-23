import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Film,
  Gamepad2,
  Layers3,
  MonitorPlay,
  Sparkles,
  Star,
} from "lucide-react";

export const revalidate = 3600;

const homeDescription =
  "Browse movies, TV shows, anime, cartoons, genres, trending titles, and upcoming releases on CINRYVAN.";

export const metadata: Metadata = {
  title: "Browse Movies, TV Shows, Anime & Cartoons | CINRYVAN",
  description: homeDescription,
  keywords: [
    "browse movies",
    "browse tv shows",
    "anime",
    "cartoons",
    "movie genres",
    "top rated movies",
    "CINRYVAN",
  ],
  alternates: { canonical: "/browse" },
  openGraph: {
    title: "Browse Movies, TV Shows, Anime & Cartoons | CINRYVAN",
    description: homeDescription,
    url: "/browse",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browse CINRYVAN",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Movies, TV Shows, Anime & Cartoons | CINRYVAN",
    description: homeDescription,
    images: ["/og-image.png"],
  },
};

type TmdbTitle = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  genre_ids?: number[];
};

type Genre = {
  id: number;
  title: string;
  description: string;
};

const genres: Genre[] = [
  { id: 28, title: "Action", description: "Heroes, fights and high-stakes missions" },
  { id: 12, title: "Adventure", description: "Journeys into extraordinary worlds" },
  { id: 16, title: "Animation", description: "Illustrated worlds for every audience" },
  { id: 35, title: "Comedy", description: "Big laughs and comfort watches" },
  { id: 80, title: "Crime", description: "Heists, detectives and criminal empires" },
  { id: 18, title: "Drama", description: "Powerful and emotional stories" },
  { id: 14, title: "Fantasy", description: "Magic, legends and impossible realms" },
  { id: 27, title: "Horror", description: "Nightmares, monsters and dark secrets" },
  { id: 9648, title: "Mystery", description: "Secrets waiting to be uncovered" },
  { id: 10749, title: "Romance", description: "Love stories and complicated hearts" },
  { id: 878, title: "Sci-Fi", description: "Future technology and distant worlds" },
  { id: 53, title: "Thriller", description: "Tension, danger and unexpected turns" },
];

const destinations = [
  {
    title: "Movies",
    eyebrow: "Cinema",
    href: "/search",
    description: "Blockbusters, hidden gems, classics and new releases.",
    icon: Film,
    accent: "from-yellow-400/35",
  },
  {
    title: "TV Shows",
    eyebrow: "Series",
    href: "/search?type=tv",
    description: "Trending series, drama, fantasy, crime and more.",
    icon: MonitorPlay,
    accent: "from-blue-500/35",
  },
  {
    title: "Anime",
    eyebrow: "Japan signal",
    href: "/anime",
    description: "Action, romance, horror, comedy and anime worlds.",
    icon: Sparkles,
    accent: "from-pink-500/35",
  },
  {
    title: "Cartoons",
    eyebrow: "Animated worlds",
    href: "/cartoons",
    description: "Cartoon Network, Disney, classics and family favourites.",
    icon: Clapperboard,
    accent: "from-cyan-400/35",
  },
  {
    title: "Animation",
    eyebrow: "All animation",
    href: "/animation",
    description: "Animated movies, anime, cartoons and new discoveries.",
    icon: Layers3,
    accent: "from-violet-500/35",
  },
  {
    title: "Games",
    eyebrow: "Interactive worlds",
    href: "/games",
    description: "Discover games, platforms, deals and player favourites.",
    icon: Gamepad2,
    accent: "from-green-500/35",
  },
];

const quickLinks = [
  { title: "Top Rated", href: "/top", description: "The highest-rated titles on CINRYVAN." },
  { title: "Trending Now", href: "/trending", description: "See what audiences are discovering now." },
  { title: "Coming Soon", href: "/upcoming", description: "Track future movies, shows and animation." },
  { title: "Categories", href: "/categories", description: "Explore more genres, moods and collections." },
  { title: "Entertainment News", href: "/news", description: "Movies, TV, games, sport and culture." },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Browse CINRYVAN",
  description: homeDescription,
  url: "https://cinryvan.vercel.app/browse",
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function getBrowseArtwork(): Promise<TmdbTitle[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;

  const requests = [1, 2, 3].map(async (page) => {
    const params = new URLSearchParams({
      include_adult: "false",
      language: "en-US",
      page: String(page),
      sort_by: "popularity.desc",
    });

    if (apiKey) params.set("api_key", apiKey);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          next: { revalidate: 3600 },
        },
      );

      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data?.results) ? data.results : [];
    } catch {
      return [];
    }
  });

  return (await Promise.all(requests)).flat();
}

export default async function BrowsePage() {
  const artwork = await getBrowseArtwork();
  const usedImages = new Set<number>();

  const genreCards = genres.map((genre) => {
    const matching = artwork.filter(
      (movie) =>
        Array.isArray(movie.genre_ids) &&
        movie.genre_ids.includes(genre.id) &&
        Boolean(movie.backdrop_path || movie.poster_path),
    );
    const imageMovie =
      matching.find((movie) => !usedImages.has(movie.id)) ?? matching[0];

    if (imageMovie) usedImages.add(imageMovie.id);

    return {
      ...genre,
      image: tmdbImage(imageMovie?.backdrop_path || imageMovie?.poster_path),
    };
  });

  const destinationArtwork = destinations.map((destination, index) => ({
    ...destination,
    image: tmdbImage(
      artwork[index]?.backdrop_path || artwork[index]?.poster_path,
      "w780",
    ),
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 pt-24 text-white md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(59,130,246,0.12),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <header className="relative overflow-hidden border-y border-white/10 py-10 sm:py-14 lg:py-16">
          <div className="absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-yellow-400/15 shadow-[0_0_100px_rgba(250,204,21,0.12)]" />
          <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
            CINRYVAN Discovery
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] sm:text-6xl lg:text-8xl">
            Find your next world.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60 sm:text-lg sm:leading-8">
            Move between cinema, television, animation and games—or explore a movie genre built around your mood.
          </p>
        </header>

        <section className="py-10 sm:py-14">
          <SectionHeading
            eyebrow="Choose a universe"
            title="What do you want to explore?"
            description="Every corner of CINRYVAN starts here."
          />

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinationArtwork.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative min-h-[210px] overflow-hidden border border-white/10 bg-[#0a0e17] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/55 sm:min-h-[240px] sm:p-7"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-35 transition duration-700 group-hover:scale-105 group-hover:opacity-50"
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} via-[#070a12]/80 to-[#070a12]`} />

                  <div className="relative z-10 flex h-full min-h-[160px] flex-col">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-yellow-400" />
                      <ArrowRight className="h-5 w-5 text-white/45 transition group-hover:translate-x-1 group-hover:text-yellow-400" />
                    </div>
                    <div className="mt-auto">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                        {item.eyebrow}
                      </p>
                      <h2 className="mt-2 text-3xl font-black">{item.title}</h2>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-10 sm:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Movie categories"
              title="Browse movies by genre"
              description="Choose a cinematic world, style or feeling."
            />
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-black text-yellow-400 hover:text-yellow-300"
            >
              Explore every category
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {genreCards.map((genre) => (
              <Link
                key={genre.id}
                href={`/search?genre=${genre.id}`}
                className="group relative min-h-[150px] overflow-hidden border border-white/15 bg-[#0b1019] sm:min-h-[175px]"
              >
                {genre.image && (
                  <Image
                    src={genre.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-75"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.32em] text-yellow-400">
                    Movie category
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black leading-none">{genre.title}</h3>
                      <p className="mt-2 line-clamp-1 text-xs text-white/55">
                        {genre.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-white/50 transition group-hover:translate-x-1 group-hover:text-yellow-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
            <span>{genreCards.length} movie categories</span>
            <span className="hidden sm:block">Select a world to start exploring</span>
          </div>
        </section>

        <section className="border-t border-white/10 py-10 sm:py-14">
          <SectionHeading
            eyebrow="Discovery channels"
            title="Go deeper"
            description="More ways to find what deserves your time."
          />

          <div className="mt-7 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {quickLinks.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group min-h-[170px] bg-[#080b12] p-5 transition hover:bg-yellow-400 hover:text-black"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-yellow-400 group-hover:text-black/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index === 0 ? (
                    <Star className="h-4 w-4 text-yellow-400 group-hover:text-black" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-black" />
                  )}
                </div>
                <h3 className="mt-10 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50 group-hover:text-black/65">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-yellow-400 pl-4">
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black sm:text-4xl">{title}</h2>
      <p className="mt-2 text-sm text-white/50 sm:text-base">{description}</p>
    </div>
  );
}