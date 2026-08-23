//page.tsx
import {
  getPopularMovies,
  getTrendingAll,
  getUpcomingMovies,
  getUpcomingTvSeries,
  getUpcomingAnimation,
  getMovieGenres,
  getTvByGenre,
  getTopRatedMovies,
  getHighestGrossingMovies,
  getMoviesByGenre,
  getMovie,
  fetchTmdbTitle,
} from "@/lib/fetchers";
import { getEntertainmentNews } from "@/lib/news";
import { OSCAR_BEST_PICTURE } from "@/lib/oscars";
import HeroCarousel from "@/components/HeroCarousel";   // ✅ ADD THIS BACK
import ExpandableHeroCarousel from "@/components/ExpandableHeroCarousel";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import TvHeroCarousel from "@/components/TvHeroCarousel";
import type { NewsItem } from "@/components/NewsStrip";
import CategoriesTray from "@/components/CategoriesTray";
import nextDynamic from "next/dynamic";
import type { ReactNode } from "react";
import FranchiseUniverse from "@/components/FranchiseUniverse";
import Link from "next/link";
import HomeGamingSection from "@/components/HomeGamingSection";
import type { Metadata } from "next";
import { getGamingHomeData } from "@/lib/games";
import MovieEras from "@/components/MovieEras";

// runtime/perf
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

const homeDescription =
  "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CINRYVAN. Explore ratings, casts, watch options, and cinematic discoveries.";

export const metadata: Metadata = {
  title: {
    absolute: "CINRYVAN – Movies, TV Shows, Anime, Cartoons & Games",
  },
  description: homeDescription,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "CINRYVAN – Movies, TV Shows, Anime, Cartoons & Games",
    description: homeDescription,
    url: "/",
    siteName: "CINRYVAN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN – Discover movies, shows, animation and games",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CINRYVAN – Movies, TV Shows, Anime, Cartoons & Games",
    description: homeDescription,
    images: ["/og-image.png"],
  },
};

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
  trailerKey?: string | null;
};

// images: shelves small, hero larger
const tmdbImg = (
  p?: string | null,
  size: "w342" | "w500" | "w780" | "w1280" | "original" = "w780"
) => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

// helpers
const withTimeout = <T,>(p: Promise<T>, ms = 8000, label = "fetch") =>
  Promise.race<T>([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timeout`)), ms)
    ) as any,
  ]);

const uniqueById = <T extends { id: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
};

type DiscoverAnimationOptions = {
  genres?: string;
  language?: string;
  networks?: string;
  sortBy?: string;
  firstAirDateLte?: string;
};

async function discoverAnimation({
  genres = "16",
  language,
  networks,
  sortBy = "popularity.desc",
  firstAirDateLte,
}: DiscoverAnimationOptions = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;
  const params = new URLSearchParams({
    include_adult: "false",
    include_null_first_air_dates: "false",
    language: "en-US",
    page: "1",
    sort_by: sortBy,
    with_genres: genres,
  });

  if (apiKey) params.set("api_key", apiKey);
  if (language) params.set("with_original_language", language);
  if (networks) params.set("with_networks", networks);
  if (firstAirDateLte) params.set("first_air_date.lte", firstAirDateLte);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?${params.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return { results: [] as any[] };
    const data = await response.json();
    return { results: Array.isArray(data?.results) ? data.results : [] };
  } catch {
    return { results: [] as any[] };
  }
}

const blockedAnimationText =
  /hentai|overflow|secret mission|caressing my hibernating bear|souryo to majiwaru|immoral guild|showtime!|fire in his fingertips/i;

const isGeneralAudienceAnimation = (item: any) => {
  const text = `${item?.title || item?.name || ""} ${item?.overview || ""}`;
  return item?.adult !== true && !blockedAnimationText.test(text);
};

// TMDB -> compact shelf card
type ShelfItem = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster: string | null;
  year: string;
  rating?: number;
  trailer?: string | null;
};

const toShelfMedia = (x: any): ShelfItem => ({
  id: Number(x.id),
  media: x.media_type === "tv" ? "tv" : "movie",
  title: x.title || x.name || "Untitled",
  poster:
  x.poster ??
  (x.poster_path
    ? `https://image.tmdb.org/t/p/w342${x.poster_path}`
    : x.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${x.backdrop_path}`
    : null),
  year: String(x.release_date || x.first_air_date || "").slice(0, 4),
  rating:
  typeof x.vote_average === "number"
    ? Math.round(x.vote_average * 10) / 10
    : undefined,

    
});

function norm(list: unknown[]): Norm[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter((x: any) => x && typeof x.id === "number")
    .map((x: any) => ({
      id: x.id,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: x.title || x.name || "Untitled",
      overview: x.overview || "",
      poster: tmdbImg(x.poster_path, "w500"),
      backdrop: tmdbImg(x.backdrop_path, "w1280") || tmdbImg(x.poster_path, "w780"),
      year: String(x.release_date || x.first_air_date || "").slice(0, 4),
      rating:
        typeof x.vote_average === "number"
          ? Math.round(x.vote_average * 10) / 10
          : undefined,
          
    }));
}

type HeroMovie = Norm & {
  trailerKey: string | null;
  similarMovies: Norm[];
};

// temporary TMDB -> news card
const toNews = (x: any): NewsItem => ({
  title: x.title || x.name || "Untitled",
  url: `/${x.media_type === "tv" ? "tv" : "movie"}/${x.id}`,
  source: "TMDB",
  image: x.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${x.backdrop_path}`
    : x.poster_path
    ? `https://image.tmdb.org/t/p/w780${x.poster_path}`
    : null,
});

const MAX_HEROES = 10;
const MAX_SHELF = 14;
const MAX_NEWS = 8;


// ✅ dynamic imports (no duplicate identifiers)
const ShelfRow = nextDynamic(() => import("@/components/ShelfRow"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});
const NewsStrip = nextDynamic(() => import("@/components/NewsStrip"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});

export default async function Home() {
  const [popularRes, trendingRes, genreRes, newsRes] = await Promise.allSettled([
    withTimeout(getPopularMovies(1), 8000, "popular"),
    withTimeout(getTrendingAll(1), 8000, "trending"),
    withTimeout(getMovieGenres(), 8000, "genres"),
    withTimeout(getEntertainmentNews(), 8000, "news"),
  ]);

  const gamingDataPromise = getGamingHomeData();

  const popularRaw: any[] =
    popularRes.status === "fulfilled" && Array.isArray((popularRes.value as any)?.results)
      ? (popularRes.value as any).results
      : [];

  const trendingRaw: any[] =
    trendingRes.status === "fulfilled" && Array.isArray((trendingRes.value as any)?.results)
      ? (trendingRes.value as any).results
      : [];

  const genres: any[] =
    genreRes.status === "fulfilled" && Array.isArray(genreRes.value as any)
      ? (genreRes.value as any)
      : [];

  const newsItems =
  newsRes.status === "fulfilled" && Array.isArray(newsRes.value)
    ? newsRes.value
    : [];  

  const [
  upcomingMovies,
  upcomingTv,
  upcomingAnimation,
  topRatedMovies,
  highestGrossingMovies,
  dramaMovies,
  comedyMovies,
  horrorMovies,
  sciFiMovies,
  familyMovies,
  superheroMovies,
] = await Promise.all([
  getUpcomingMovies(),
  getUpcomingTvSeries(),
  getUpcomingAnimation(),
  getTopRatedMovies(),
  getHighestGrossingMovies(),
  getMoviesByGenre(18),
  getMoviesByGenre(35),
  getMoviesByGenre(27),
  getMoviesByGenre(878),
  getMoviesByGenre(10751),
  getMoviesByGenre(28),
]);  

  // TV and animation categories
  const [
    dramaTv,
    fantasyTv,
    crimeTv,
    animationTv,
    japaneseAnime,
    chineseAnimation,
    actionAnime,
    horrorAnime,
    romanceAnime,
    comedyAnime,
    cartoonNetwork,
    disneyAnimation,
    nickelodeonAnimation,
    adultSwimAnimation,
    superheroAnimation,
    familyAnimation,
    classicAnimation,
  ] = await Promise.all([
    getTvByGenre(18),
    getTvByGenre(10765),
    getTvByGenre(80),
    getTvByGenre(16),
    discoverAnimation({ language: "ja" }),
    discoverAnimation({ language: "zh" }),
    discoverAnimation({ genres: "16,10759", language: "ja" }),
    discoverAnimation({ genres: "16,9648", language: "ja" }),
    discoverAnimation({ genres: "16,18", language: "ja" }),
    discoverAnimation({ genres: "16,35", language: "ja" }),
    discoverAnimation({ networks: "56" }),
    discoverAnimation({ networks: "44|54|2739" }),
    discoverAnimation({ networks: "13" }),
    discoverAnimation({ networks: "80" }),
    discoverAnimation({ genres: "16,10759", language: "en" }),
    discoverAnimation({ genres: "16,10751" }),
    discoverAnimation({
      language: "en",
      sortBy: "vote_average.desc",
      firstAirDateLte: "2005-12-31",
    }),
  ]);
  const gamingData = await gamingDataPromise;
  

  // Ten movie heroes with trailers and closely related movies.
  const movieCandidates = uniqueById([
    ...norm(trendingRaw),
    ...norm(popularRaw),
  ])
    .filter(
      (movie) =>
        movie.media === "movie" && Boolean(movie.backdrop),
    )
    .slice(0, MAX_HEROES);

  const heroMovies: HeroMovie[] = await Promise.all(
    movieCandidates.map(async (movie) => {
      try {
        const details = await fetchTmdbTitle(movie.id, "movie");
        const videos = Array.isArray(details?.videos?.results)
          ? details.videos.results
          : [];
        const trailer =
          videos.find(
            (video: any) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official === true,
          ) ??
          videos.find(
            (video: any) =>
              video.site === "YouTube" && video.type === "Trailer",
          ) ??
          videos.find(
            (video: any) =>
              video.site === "YouTube" && video.type === "Teaser",
          );

        const recommendations = Array.isArray(
          details?.recommendations?.results,
        )
          ? details.recommendations.results
          : [];
        const similar = Array.isArray(details?.similar?.results)
          ? details.similar.results
          : [];
        const relatedRaw = uniqueById([...recommendations, ...similar]);
        const featuredGenres = Array.isArray(details?.genres)
          ? details.genres.map((genre: any) => genre.id)
          : [];
        const isAnimation = featuredGenres.includes(16);
        const closelyRelated = relatedRaw.filter((related: any) => {
          const relatedGenres = Array.isArray(related.genre_ids)
            ? related.genre_ids
            : [];
          return isAnimation
            ? relatedGenres.includes(16)
            : relatedGenres.some((genreId: number) =>
                featuredGenres.includes(genreId),
              );
        });
        const finalRelated = uniqueById([
          ...closelyRelated,
          ...relatedRaw,
        ])
          .filter(
            (related: any) =>
              related.id !== movie.id &&
              Boolean(related.backdrop_path || related.poster_path),
          )
          .slice(0, 12);

        return {
          ...movie,
          trailerKey: trailer?.key ?? null,
          similarMovies: norm(
            finalRelated.map((related: any) => ({
              ...related,
              media_type: "movie",
            })),
          ),
        };
      } catch {
        return {
          ...movie,
          trailerKey: null,
          similarMovies: [],
        };
      }
    }),
  );

  const seriesHeroes = uniqueById(norm(trendingRaw))
  .filter((x) => x.media === "tv" && x.backdrop)
  .slice(0, 10);

  const animationHeroes = uniqueById(
    norm(
      animationTv.results
        .filter(isGeneralAudienceAnimation)
        .map((x: any) => ({ ...x, media_type: "tv" })),
    )
  )
    .filter((x) => x.backdrop)
    .slice(0, MAX_HEROES);


  // shelves
  const popularShelf = await Promise.all(
  popularRaw.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia(x);
    
    return {
      ...m,
      
      href: `/${m.media}/${m.id}`,
    };
  })
);

  const trendingMoviesShelf = await Promise.all(
  trendingRaw
    .filter((x: any) => x.media_type !== "tv")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia(x);
      
      return {
        ...m,
        
        href: `/movie/${m.id}`,
      };
    })
);

const cleanMovieShelf = (data: any) =>
  (data?.results || [])
    .filter((x: any) => x.poster_path)
    .slice(0, MAX_SHELF)
    .map((x: any) => ({
      ...toShelfMedia(x),
      href: `/movie/${x.id}`,
    }));

const topRatedMovieShelf = cleanMovieShelf(topRatedMovies);
const highestGrossingShelf = cleanMovieShelf(highestGrossingMovies);
const dramaMovieShelf = cleanMovieShelf(dramaMovies);
const comedyMovieShelf = cleanMovieShelf(comedyMovies);
const horrorMovieShelf = cleanMovieShelf(horrorMovies);
const sciFiMovieShelf = cleanMovieShelf(sciFiMovies);
const superheroShelf = cleanMovieShelf(superheroMovies);
const familyMovieShelf = cleanMovieShelf(familyMovies);

const trendingTvShelf = await Promise.all(
  trendingRaw
    .filter((x: any) => x.media_type === "tv")
    .slice(0, MAX_SHELF)
    .map(async (x: any) => {
      const m = toShelfMedia(x);
      
      return {
        ...m,
        
        href: `/tv/${m.id}`,
      };
    })
);

const dramaShelf = await Promise.all(
  dramaTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    
    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const fantasyShelf = await Promise.all(
  fantasyTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    
    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const crimeShelf = await Promise.all(
  crimeTv.results.slice(0, MAX_SHELF).map(async (x: any) => {
    const m = toShelfMedia({ ...x, media_type: "tv" });
    
    return {
      ...m,
      
      href: `/tv/${m.id}`,
    };
  })
);

const animationShelf = (
  data: any,
  options: { safe?: boolean; excludeJapanese?: boolean } = {},
) =>
  uniqueById(Array.isArray(data?.results) ? data.results : [])
    .filter((item: any) => item.poster_path || item.backdrop_path)
    .filter((item: any) => !options.safe || isGeneralAudienceAnimation(item))
    .filter((item: any) => !options.excludeJapanese || item.original_language !== "ja")
    .slice(0, MAX_SHELF)
    .map((item: any) => {
      const media = toShelfMedia({ ...item, media_type: "tv" });
      return { ...media, href: `/tv/${media.id}` };
    });

const japaneseAnimeShelf = animationShelf(japaneseAnime, { safe: true });
const chineseAnimationShelf = animationShelf(chineseAnimation, { safe: true });
const actionAnimeShelf = animationShelf(actionAnime, { safe: true });
const horrorAnimeShelf = animationShelf(horrorAnime, { safe: true });
const romanceAnimeShelf = animationShelf(romanceAnime, { safe: true });
const comedyAnimeShelf = animationShelf(comedyAnime, { safe: true });

const cartoonNetworkShelf = animationShelf(cartoonNetwork, { safe: true });
const disneyAnimationShelf = animationShelf(disneyAnimation, { safe: true });
const nickelodeonShelf = animationShelf(nickelodeonAnimation, { safe: true });
const adultSwimShelf = animationShelf(adultSwimAnimation);
const superheroAnimationShelf = animationShelf(superheroAnimation, { safe: true });
const familyAnimationShelf = animationShelf(familyAnimation, {
  safe: true,
  excludeJapanese: true,
});
const classicAnimationShelf = animationShelf(classicAnimation, {
  safe: true,
  excludeJapanese: true,
});

const oscarShelf = await Promise.all(
  OSCAR_BEST_PICTURE.map(async (id) => {
    const movie = await getMovie(id);
    const m = toShelfMedia(movie);

    return {
      ...m,
      href: `/movie/${m.id}`,
    };
  })
);

 return (
  <main className="relative overflow-x-hidden bg-[#05070d] text-white">
    {/* cosmic background */}
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,190,0,0.16),transparent_35%),radial-gradient(circle_at_75%_30%,rgba(100,80,255,0.2),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,13,0.25),#05070d_85%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,white_0px,white_1px,transparent_1px,transparent_90px)]" />
    </div>

    <div className="relative z-10">
      {heroMovies.length > 0 && <HeroCarousel items={heroMovies} />}

      <Surface>
        <div className="space-y-6 sm:space-y-8">
          <ContinueWatchingRow />
          <section className="border-b border-white/[0.08] pb-6 sm:pb-8">
            <div className="mb-4 flex items-center justify-between border-l-2 border-yellow-400/70 pl-3 sm:pl-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-yellow-400">
                  CINRYVAN System
                </p>
                <h1 className="mt-2 text-2xl font-black md:text-4xl">
                  Explore worlds beyond cinema
                </h1>
              </div>
              <div className="hidden text-xs font-bold uppercase tracking-[0.18em] text-white/35 md:block">
                Live TMDB universe
              </div>
            </div>

            {Array.isArray(genres) && genres.length > 0 && (
              <CategoriesTray genres={genres} />
            )}
          </section>

          <MovieEras />

          <FranchiseUniverse />

          <Panel eyebrow="Popular galaxy" title="More movies">
            <ShelfRow items={popularShelf} />
          </Panel>

          <Panel eyebrow="Heat signal" title="Trending movies">
            <ShelfRow items={trendingMoviesShelf} />
          </Panel>

          <Panel eyebrow="Top cinema" title="IMDb Top 250 Style">
            <ShelfRow items={topRatedMovieShelf} />
          </Panel>

          <Panel eyebrow="Box office giants" title="Highest Grossing Movies">
            <ShelfRow items={highestGrossingShelf} />
          </Panel>

          <Panel eyebrow="Emotional cinema" title="Best Drama Movies">
            <ShelfRow items={dramaMovieShelf} />
          </Panel>

          <Panel eyebrow="Laugh zone" title="Best Comedy Movies">
            <ShelfRow items={comedyMovieShelf} />
          </Panel>

          <Panel eyebrow="Nightmare vault" title="Horror Collection">
            <ShelfRow items={horrorMovieShelf} />
          </Panel>

          <Panel eyebrow="Future signal" title="Science Fiction">
            <ShelfRow items={sciFiMovieShelf} />
          </Panel>

          <Panel eyebrow="Hero zone" title="Superhero Universe">
            <ShelfRow items={superheroShelf} />
          </Panel>

          <Panel eyebrow="Family night" title="Family Favorites">
            <ShelfRow items={familyMovieShelf} />
          </Panel>  

          <Panel
              eyebrow="Coming Soon"
              title={
                <div className="flex items-center justify-between">
                  <span>Upcoming Movies</span>
                  <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                    View all →
                  </a>
                </div>
              }
            >
            <ShelfRow
              items={upcomingMovies
                .slice(0, MAX_SHELF)
                .map((movie: any) => ({
                  ...toShelfMedia(movie),
                  href: `/movie/${movie.id}`,
                }))}
            />
          </Panel>

          <Panel
              eyebrow="Academy Awards"
              title={
                <div className="flex items-center justify-between">
                  <span>Oscar Winners</span>

                  <Link
                    href="/collections/oscars"
                    className="text-sm text-yellow-400 hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              }
            >
              <ShelfRow items={oscarShelf} />
            </Panel>

          <FeatureBreak
            title="Series Dimension"
            text="A second cinematic layer for TV worlds, drama, fantasy, and crime stories."
          />

          <TvHeroCarousel items={seriesHeroes} />

          <Panel eyebrow="Broadcast pulse" title="Trending TV shows">
            <ShelfRow items={trendingTvShelf} />
          </Panel>

          <Panel eyebrow="Emotional worlds" title="Drama TV shows">
            <ShelfRow items={dramaShelf} />
          </Panel>

          <Panel eyebrow="Magic zone" title="Fantasy TV shows">
            <ShelfRow items={fantasyShelf} />
          </Panel>

          <Panel eyebrow="Dark files" title="Crime TV shows">
            <ShelfRow items={crimeShelf} />
          </Panel>

          <Panel
              eyebrow="Coming Soon"
              title={
                <div className="flex items-center justify-between">
                  <span>Upcoming TV Series</span>
                  <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                    View all →
                  </a>
                </div>
              }
            >
            <ShelfRow
              items={upcomingTv
                .slice(0, MAX_SHELF)
                .map((show: any) => ({
                  ...toShelfMedia({ ...show, media_type: "tv" }),
                  href: `/tv/${show.id}`,
                }))}
            />
          </Panel>

          <FeatureBreak
            title="Animation Universe"
            text="Anime and cartoons separated into their own cinematic stream."
          />

          <ExpandableHeroCarousel
              eyebrow="Animation Universe"
              title="Animated Worlds"
              items={animationHeroes}
            />

          <Panel
            eyebrow="Japan signal"
            title={
              <div className="flex items-center justify-between">
                <span>Japanese Anime</span>
                <a href="/anime" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow items={japaneseAnimeShelf} />
          </Panel>

          <Panel eyebrow="Eastern animation" title="Chinese Animation · Donghua">
            <ShelfRow items={chineseAnimationShelf} />
          </Panel>

          <Panel eyebrow="Battle zone" title="Action Anime">
            <ShelfRow items={actionAnimeShelf} />
          </Panel>

          <Panel eyebrow="Dark animation" title="Horror & Supernatural Anime">
            <ShelfRow items={horrorAnimeShelf} />
          </Panel>

          <Panel eyebrow="Heart stories" title="Romance Anime">
            <ShelfRow items={romanceAnimeShelf} />
          </Panel>

          <Panel eyebrow="Laugh signal" title="Comedy Anime">
            <ShelfRow items={comedyAnimeShelf} />
          </Panel>

          <FeatureBreak
            title="Cartoon Multiverse"
            text="Classic channels, family worlds, superheroes, and animation for older audiences."
          />

          <Panel
            eyebrow="CN classics"
            title={
              <div className="flex items-center justify-between">
                <span>Cartoon Network</span>
                <a href="/cartoons" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow items={cartoonNetworkShelf} />
          </Panel>

          <Panel eyebrow="Magic kingdom" title="Disney Animation">
            <ShelfRow items={disneyAnimationShelf} />
          </Panel>

          <Panel eyebrow="Orange universe" title="Nickelodeon Cartoons">
            <ShelfRow items={nickelodeonShelf} />
          </Panel>

          <Panel eyebrow="After dark" title="Adult Swim Animation">
            <ShelfRow items={adultSwimShelf} />
          </Panel>

          <Panel eyebrow="Hero animation" title="Superhero Cartoons">
            <ShelfRow items={superheroAnimationShelf} />
          </Panel>

          <Panel eyebrow="All ages" title="Family Animation">
            <ShelfRow items={familyAnimationShelf} />
          </Panel>

          <Panel eyebrow="Animation archive" title="Classic Cartoons">
            <ShelfRow items={classicAnimationShelf} />
          </Panel>

          <Panel
            eyebrow="Coming Soon"
            title={
              <div className="flex items-center justify-between">
                <span>Upcoming Animation</span>
                <a href="/upcoming" className="text-sm text-yellow-400 hover:underline">
                  View all →
                </a>
              </div>
            }
          >
            <ShelfRow
              items={upcomingAnimation
                .slice(0, MAX_SHELF)
                .map((movie: any) => ({
                  ...toShelfMedia(movie),
                  href: `/movie/${movie.id}`,
                }))}
            />
          </Panel>

          <HomeGamingSection gamingData={gamingData} />

          <section className="border-b border-white/[0.08] pb-6 sm:pb-8">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              News Channels
            </p>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Explore News Categories
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
              <Link
                href="/news/entertainment"
                className="border-l-2 border-yellow-400/70 bg-white/[0.025] p-3 transition hover:bg-yellow-400 hover:text-black sm:p-6"
              >
                <h3 className="text-sm font-black sm:text-xl">Entertainment</h3>
                <p className="mt-2 hidden text-sm opacity-70 sm:block">
                  Movies, celebrities, streaming and culture.
                </p>
              </Link>

              <Link
                href="/news/gaming"
                className="border-l-2 border-cyan-400/70 bg-white/[0.025] p-3 transition hover:bg-cyan-400 hover:text-black sm:p-6"
              >
                <h3 className="text-sm font-black sm:text-xl">Gaming</h3>
                <p className="mt-2 hidden text-sm opacity-70 sm:block">
                  Games, consoles, esports and industry updates.
                </p>
              </Link>

              <Link
                href="/news/sports"
                className="border-l-2 border-green-400/70 bg-white/[0.025] p-3 transition hover:bg-green-400 hover:text-black sm:p-6"
              >
                <h3 className="text-sm font-black sm:text-xl">Sports</h3>
                <p className="mt-2 hidden text-sm opacity-70 sm:block">
                  Live headlines, major games and sports stories.
                </p>
              </Link>
            </div>
          </section>

          <Panel eyebrow="Industry radar" title="Top news">
            <NewsStrip items={newsItems.slice(0, MAX_NEWS)} />
          </Panel>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/trending"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-yellow-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Trending Movies & TV</h3>
              <p className="mt-2 text-sm text-white/60">
                Explore what is hot across movies and shows.
              </p>
            </Link>

            

            <Link
              href="/top"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-yellow-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Top Rated</h3>
              <p className="mt-2 text-sm text-white/60">
                Discover the highest-rated films and series.
              </p>
            </Link>

            <Link
              href="/anime"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-pink-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Anime Universe</h3>
              <p className="mt-2 text-sm text-white/60">
                Browse anime adventures, action, fantasy, and drama.
              </p>
            </Link>

            <Link
              href="/cartoons"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Cartoon Collection</h3>
              <p className="mt-2 text-sm text-white/60">
                Explore animated worlds and family-friendly discoveries.
              </p>
            </Link>

            <Link
              href="/news"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-green-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Entertainment News</h3>
              <p className="mt-2 text-sm text-white/60">
                Read movie, TV, gaming, sports, and entertainment updates.
              </p>
            </Link>

            <Link
              href="/upcoming"
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-orange-400/50 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold">Upcoming Releases</h3>
              <p className="mt-2 text-sm text-white/60">
                See upcoming movies, shows, and animation releases.
              </p>
            </Link>
          </div>

        </div>
      </Surface>
    </div>
  </main>
);
}

/* ---------- UI helpers ---------- */

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative border-b border-white/[0.08] pb-6 sm:pb-8">
      <div className="mb-3 border-l-2 border-yellow-400/70 pl-3 sm:mb-4 sm:pl-4">
        {eyebrow && (
          <p className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400/75 sm:text-[10px] sm:tracking-[0.32em]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-black sm:text-xl md:text-2xl">{title}</h2>
      </div>

      <div>{children}</div>
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 -mt-6 w-full md:-mt-10">
      <div className="relative bg-gradient-to-b from-[#070a12]/95 via-[#05070d] to-[#05070d]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-3 pb-0 pt-5 sm:px-4 sm:pt-6 md:px-8 md:pt-8">
          {children}
        </div>
      </div>
    </section>
  );
}

function FeatureBreak({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.08] bg-gradient-to-r from-yellow-400/[0.07] via-transparent to-blue-500/[0.07] px-3 py-5 sm:px-5 sm:py-6 md:p-8">
      <div className="absolute right-8 top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full border border-yellow-400/20 shadow-[0_0_60px_rgba(255,184,0,0.25)] md:block" />
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        CINRYVAN Layer
      </p>
      <h2 className="mt-2 text-2xl font-black md:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">{text}</p>
    </section>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[270px] w-[180px] rounded-2xl bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

