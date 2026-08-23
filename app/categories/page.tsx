import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Film,
  Flame,
  Heart,
  Moon,
  Rocket,
  Sparkles,
  Star,
  Tv,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Movie & TV Categories and Genres | CINRYVAN",
  description:
    "Browse movies and TV shows by genre, including Action, Comedy, Drama, Horror, Sci-Fi, Romance, Fantasy, Thriller, Animation and more.",
  keywords: [
    "movie genres",
    "movie categories",
    "TV genres",
    "action movies",
    "comedy movies",
    "drama movies",
    "horror movies",
    "science fiction movies",
    "fantasy movies",
    "CINRYVAN genres",
  ],
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Movie & TV Categories and Genres | CINRYVAN",
    description: "Explore movies and TV shows by genre on CINRYVAN.",
    url: "/categories",
    siteName: "CINRYVAN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN Categories",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie & TV Categories and Genres | CINRYVAN",
    description:
      "Browse Action, Comedy, Drama, Horror, Sci-Fi, Fantasy and more.",
    images: ["/og-image.png"],
  },
};

type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  genre_ids?: number[];
};

type Category = {
  label: string;
  id: number;
  description: string;
  accent: string;
  featured?: boolean;
};

const MOVIE_CATEGORIES: Category[] = [
  {
    label: "Action",
    id: 28,
    description: "Heroes, battles, chases and impossible missions.",
    accent: "from-red-600/70",
    featured: true,
  },
  {
    label: "Adventure",
    id: 12,
    description: "Journeys beyond the edge of the known world.",
    accent: "from-amber-500/65",
  },
  {
    label: "Animation",
    id: 16,
    description: "Hand-drawn and computer-generated worlds.",
    accent: "from-pink-500/65",
  },
  {
    label: "Comedy",
    id: 35,
    description: "Big laughs, chaos and comfort watches.",
    accent: "from-lime-500/60",
  },
  {
    label: "Crime",
    id: 80,
    description: "Detectives, heists and criminal empires.",
    accent: "from-slate-600/75",
  },
  {
    label: "Documentary",
    id: 99,
    description: "True stories from the real world.",
    accent: "from-emerald-600/65",
  },
  {
    label: "Drama",
    id: 18,
    description: "Powerful lives, choices and consequences.",
    accent: "from-rose-600/65",
    featured: true,
  },
  {
    label: "Family",
    id: 10751,
    description: "Adventures made for everyone.",
    accent: "from-cyan-500/60",
  },
  {
    label: "Fantasy",
    id: 14,
    description: "Magic, legends and impossible kingdoms.",
    accent: "from-violet-600/70",
  },
  {
    label: "Horror",
    id: 27,
    description: "Nightmares, monsters and dark secrets.",
    accent: "from-black/90",
    featured: true,
  },
  {
    label: "Mystery",
    id: 9648,
    description: "Every clue leads deeper into the unknown.",
    accent: "from-purple-700/70",
  },
  {
    label: "Romance",
    id: 10749,
    description: "Love stories and complicated hearts.",
    accent: "from-pink-600/65",
  },
  {
    label: "Sci-Fi",
    id: 878,
    description: "Future technology and distant galaxies.",
    accent: "from-blue-600/70",
    featured: true,
  },
  {
    label: "Thriller",
    id: 53,
    description: "Danger, tension and unexpected turns.",
    accent: "from-orange-600/65",
  },
];

const TV_CATEGORIES = [
  { label: "Drama Series", id: 18 },
  { label: "Crime Shows", id: 80 },
  { label: "Comedy Series", id: 35 },
  { label: "Sci-Fi & Fantasy", id: 10765 },
  { label: "Action & Adventure", id: 10759 },
  { label: "Mystery", id: 9648 },
  { label: "Family Shows", id: 10751 },
  { label: "Animation", id: 16 },
];

const moodCollections = [
  {
    label: "Something intense",
    description: "Action, thrillers and crime stories.",
    href: "/search?genre=53",
    icon: Flame,
    color: "hover:bg-red-500",
  },
  {
    label: "Escape reality",
    description: "Fantasy, adventure and science fiction.",
    href: "/search?genre=14",
    icon: Rocket,
    color: "hover:bg-violet-500",
  },
  {
    label: "Feel something",
    description: "Romance, drama and emotional stories.",
    href: "/search?genre=10749",
    icon: Heart,
    color: "hover:bg-pink-500",
  },
  {
    label: "Watch after dark",
    description: "Horror, mystery and darker worlds.",
    href: "/search?genre=27",
    icon: Moon,
    color: "hover:bg-zinc-700",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Movie and TV Categories and Genres",
  description:
    "Browse movies and TV shows by genre, including Action, Comedy, Drama, Horror, Sci-Fi, Romance, Fantasy and Thriller.",
  url: "https://cinryvan.vercel.app/categories",
};

const tmdbImage = (path?: string | null, size = "w780") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function getCategoryArtwork(): Promise<TmdbItem[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;

  const requests = [1, 2, 3, 4].map(async (page) => {
    const params = new URLSearchParams({
      include_adult: "false",
      language: "en-US",
      page: String(page),
      sort_by: "popularity.desc",
      "vote_count.gte": "100",
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

export default async function CategoriesPage() {
  const artwork = await getCategoryArtwork();
  const usedArtwork = new Set<number>();

  const categories = MOVIE_CATEGORIES.map((category) => {
    const candidates = artwork.filter(
      (item) =>
        Array.isArray(item.genre_ids) &&
        item.genre_ids.includes(category.id) &&
        Boolean(item.backdrop_path || item.poster_path),
    );
    const selected =
      candidates.find((item) => !usedArtwork.has(item.id)) ?? candidates[0];

    if (selected) usedArtwork.add(selected.id);

    return {
      ...category,
      image: tmdbImage(selected?.backdrop_path || selected?.poster_path),
    };
  });

  const heroArt = categories.filter((category) => category.image).slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 pt-24 text-white md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_5%,rgba(250,204,21,0.13),transparent_28%),radial-gradient(circle_at_80%_28%,rgba(139,92,246,0.12),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <header className="grid overflow-hidden border-y border-white/10 bg-[#080b12] lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)]">
          <div className="flex min-h-[370px] flex-col justify-center p-6 sm:p-10 lg:min-h-[470px] lg:p-14">
            <div className="flex items-center gap-2 text-yellow-400">
              <Clapperboard className="h-4 w-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.38em] sm:text-xs">
                CINRYVAN Genre Vault
              </p>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[0.92] sm:text-6xl lg:text-7xl">
              Every story starts with a feeling.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-lg sm:leading-8">
              Choose a genre, follow a mood, and find the movie or series that belongs in your next world.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#movie-genres"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Explore genres
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-black transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Open Browse
              </Link>
            </div>
          </div>

          <div className="grid min-h-[330px] grid-cols-2 gap-px bg-white/10 lg:min-h-[470px]">
            {heroArt.map((category, index) => (
              <Link
                key={category.id}
                href={`/search?genre=${category.id}`}
                className="group relative overflow-hidden bg-[#0b1019]"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    priority={index < 2}
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    className="object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-75"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 text-xl font-black sm:text-2xl">
                  {category.label}
                </p>
              </Link>
            ))}
          </div>
        </header>

        <section className="py-10 sm:py-14">
          <SectionTitle
            eyebrow="Choose by mood"
            title="What do you want to feel?"
            text="Start with the experience instead of the genre name."
          />

          <div className="mt-7 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {moodCollections.map((mood) => {
              const Icon = mood.icon;
              return (
                <Link
                  key={mood.label}
                  href={mood.href}
                  className={`group min-h-[200px] bg-[#080b12] p-5 transition hover:text-black ${mood.color}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-yellow-400 group-hover:text-black" />
                    <ArrowRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-1 group-hover:text-black" />
                  </div>
                  <h2 className="mt-16 text-xl font-black sm:text-2xl">
                    {mood.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/50 group-hover:text-black/65">
                    {mood.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          id="movie-genres"
          className="scroll-mt-28 border-t border-white/10 py-10 sm:py-14"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Movie categories"
              title="Explore every movie genre"
              text="Fourteen doors into completely different cinematic worlds."
            />
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-black text-yellow-400 hover:text-yellow-300"
            >
              All movies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid auto-rows-[165px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/search?genre=${category.id}`}
                className={`group relative overflow-hidden border border-white/10 bg-[#0b1019] transition hover:-translate-y-1 hover:border-yellow-400/60 ${
                  category.featured
                    ? "sm:row-span-2 lg:col-span-2"
                    : index % 5 === 0
                      ? "lg:col-span-2"
                      : ""
                }`}
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.accent} via-black/35 to-transparent`} />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400">
                    Genre {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <h2 className={`font-black leading-none ${category.featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                        {category.label}
                      </h2>
                      <p className="mt-2 line-clamp-1 text-xs text-white/60 sm:text-sm">
                        {category.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-white/50 transition group-hover:translate-x-1 group-hover:text-yellow-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10 sm:py-14">
          <SectionTitle
            eyebrow="Television worlds"
            title="Browse TV by genre"
            text="Move from movies into series without leaving your favourite genre."
          />

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TV_CATEGORIES.map((category, index) => (
              <Link
                key={category.id}
                href={`/search?type=tv&genre=${category.id}`}
                className="group flex min-h-[125px] items-end justify-between border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-5 transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
              >
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.26em] text-yellow-400 group-hover:text-black/55">
                    TV {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-black">{category.label}</h3>
                </div>
                <Tv className="h-5 w-5 text-white/35 group-hover:text-black" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
            Continue discovering
          </p>
          <div className="mt-5 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Trending Movies", "/trending", Flame],
              ["Top Rated", "/top", Star],
              ["Anime Universe", "/anime", Sparkles],
              ["Cartoon Universe", "/cartoons", Film],
            ].map(([title, href, Icon]) => {
              const IconComponent = Icon as typeof Film;
              return (
                <Link
                  key={title as string}
                  href={href as string}
                  className="group flex min-h-[120px] items-end justify-between bg-[#080b12] p-5 text-lg font-black transition hover:bg-yellow-400 hover:text-black"
                >
                  {title as string}
                  <IconComponent className="h-5 w-5 text-yellow-400 group-hover:text-black" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-l-2 border-yellow-400 pl-4">
      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-yellow-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black sm:text-4xl">{title}</h2>
      <p className="mt-2 text-sm text-white/50 sm:text-base">{text}</p>
    </div>
  );
}