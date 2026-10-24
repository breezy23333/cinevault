// app/collections/oscars/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { fetchTmdbTitle, getMovie } from "@/lib/fetchers";
import {
  OSCAR_2026,
  OSCAR_BEST_PICTURE,
  OSCAR_GROUPS,
} from "@/lib/oscars";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Oscars 2026: Winners, Nominees & Red Carpet | CINRYVAN",
  description:
    "Explore the 98th Academy Awards: Best Picture, acting winners, animation, nominees, film photography and Oscars history on CINRYVAN.",
  alternates: { canonical: "/collections/oscars" },
};

type Person = {
  id?: number;
  name?: string;
  profile_path?: string | null;
};
type MovieData = {
  id?: number;
  title?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  poster?: string | null;
  backdrop?: string | null;
  release_date?: string;
  credits?: { cast?: Person[]; crew?: Person[] };
};

const DETAILED_MOVIES = new Set([1054867, 1233413, 858024, 1078605]);

const RED_CARPET = [
  { name: "Michael B. Jordan", role: "Best Actor", film: "Sinners", movieId: 1233413 },
  { name: "Jessie Buckley", role: "Best Actress", film: "Hamnet", movieId: 858024 },
  { name: "Sean Penn", role: "Best Supporting Actor", film: "One Battle After Another", movieId: 1054867 },
  { name: "Amy Madigan", role: "Best Supporting Actress", film: "Weapons", movieId: 1078605 },
  { name: "Paul Thomas Anderson", role: "Best Director", film: "One Battle After Another", movieId: 1054867 },
] as const;

const FEATURED_FILMS = [
  { id: 1054867, name: "One Battle After Another", label: "BEST PICTURE" },
  { id: 1233413, name: "Sinners", label: "BEST ACTOR" },
  { id: 803796, name: "KPop Demon Hunters", label: "BEST ANIMATED FEATURE" },
] as const;

function imageUrl(movie: MovieData | null | undefined, kind: "poster" | "backdrop") {
  const path = kind === "poster"
    ? movie?.poster_path ?? movie?.poster
    : movie?.backdrop_path ?? movie?.backdrop;

  if (!path || typeof path !== "string") return null;
  if (path.startsWith("https://")) return path;
  if (!path.startsWith("/")) return null;
  return `https://image.tmdb.org/t/p/${kind === "poster" ? "w500" : "w1280"}${path}`;
}

function portraitUrl(movie: MovieData | null | undefined, name: string) {
  const people = [...(movie?.credits?.cast ?? []), ...(movie?.credits?.crew ?? [])];
  const normalise = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const person = people.find((item) => normalise(item.name ?? "") === normalise(name));
  const path = person?.profile_path;
  return path?.startsWith("/") ? `https://image.tmdb.org/t/p/w500${path}` : null;
}

function sectionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default async function OscarsPage() {
  // Film IDs come directly from the Oscars data, so this page stays in sync.
  const movieIds = Array.from(new Set([
    ...OSCAR_BEST_PICTURE,
    ...OSCAR_2026.flatMap((award) => award.movieId ? [award.movieId] : []),
  ]));

  const results = await Promise.all(movieIds.map(async (id) => {
    try {
      // Four film details include the cast/crew needed for winner portraits.
      const movie = DETAILED_MOVIES.has(id)
        ? await fetchTmdbTitle(id, "movie")
        : await getMovie(id);
      return [id, movie as MovieData] as const;
    } catch {
      return [id, null] as const;
    }
  }));

  const movies = new Map<number, MovieData | null>(results);
  const bestPicture = movies.get(1054867);
  const heroBackdrop = imageUrl(bestPicture, "backdrop");

  return (
    <main className="min-h-screen bg-[#090609] pb-20 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-7 md:px-8">
        <Link href="/" className="text-sm font-semibold text-white/50 hover:text-amber-300">
          ← CINRYVAN Home
        </Link>

        {/* RED CARPET / CEREMONY HERO */}
        <header className="relative mt-6 overflow-hidden rounded-[2rem] border border-red-700/40 bg-[#18080d] shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
          {heroBackdrop && (
            <img src={heroBackdrop} alt="One Battle After Another film backdrop" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#100608] via-[#16070d]/95 to-[#240913]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(234,179,8,0.18),transparent_45%)]" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-950 via-red-500 to-red-950" />

          <div className="relative grid gap-10 p-7 py-12 md:p-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-900/35 px-4 py-2 text-xs font-black uppercase tracking-[0.19em] text-red-200">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                The 98th Academy Awards · 2026
              </p>
              <div className="mb-2 text-3xl text-amber-400">✦ ✧ ✦</div>
              <h1 className="text-6xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">
                OSCARS <span className="block text-amber-400">2026</span>
              </h1>
              <p className="mt-6 text-2xl font-bold sm:text-3xl">A night of cinematic greatness.</p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
                Step onto the red carpet. Explore the best performances, animation,
                music and filmmaking of the year — with official winners and nominees
                from the March 15, 2026 ceremony.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#red-carpet" className="rounded-full bg-[#bf132b] px-6 py-3 text-sm font-black shadow-lg shadow-red-950/40 transition hover:bg-red-500">
                  Enter the Red Carpet ↓
                </a>
                <a href="#headliners" className="rounded-full border border-amber-400/60 bg-black/30 px-6 py-3 text-sm font-bold text-amber-200 hover:bg-amber-400/10">
                  See Winners
                </a>
              </div>
              <p className="mt-9 text-xs font-black uppercase tracking-[0.18em] text-amber-100/65">
                24 categories <span className="mx-2 text-red-400">✦</span> Nominees <span className="mx-2 text-red-400">✦</span> Hall of Fame
              </p>
            </div>

            <div className="grid grid-cols-3 items-center gap-2.5 sm:gap-4">
              {FEATURED_FILMS.map((film, index) => {
                const poster = imageUrl(movies.get(film.id), "poster");
                return (
                  <Link key={film.id} href={`/movie/${film.id}`} className={`group relative block overflow-hidden rounded-xl border border-amber-400/40 bg-black/50 shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-amber-300 ${index === 1 ? "translate-y-7" : ""}`}>
                    {poster ? (
                      <img src={poster} alt={`${film.name} poster`} className="aspect-[2/3] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex aspect-[2/3] items-center justify-center text-4xl text-amber-400">✦</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-2 pb-3 pt-10 text-center">
                      <p className="text-[9px] font-black tracking-wide text-amber-300 sm:text-[11px]">{film.label}</p>
                      <p className="mt-1 hidden text-xs font-bold sm:block">{film.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="relative h-2 bg-gradient-to-r from-[#4c080f] via-[#e23442] to-[#4c080f]" />
        </header>

        {/* RED CARPET PORTRAITS — images come from TMDB cast / crew profiles */}
        <section id="red-carpet" className="mt-16 scroll-mt-24">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">The faces behind the films</p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">Red Carpet <span className="text-amber-400">Spotlight</span></h2>
              <p className="mt-3 text-sm text-white/50">Meet the talent honoured in 2026.</p>
            </div>
            <a href="#animation-international" className="text-sm font-bold text-amber-300 hover:underline">Explore Animation →</a>
          </div>

          <div className="rounded-[1.75rem] border border-red-700/25 bg-gradient-to-b from-[#330b15] via-[#1a080d] to-[#10070a] p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {RED_CARPET.map((person) => {
                const film = movies.get(person.movieId);
                const portrait = portraitUrl(film, person.name);
                return (
                  <div key={person.name} className="overflow-hidden rounded-2xl border border-white/10 bg-black/45">
                    <div className="relative aspect-[3/4] bg-[#281820]">
                      {portrait ? (
                        <img src={portrait} alt={`${person.name} portrait`} loading="lazy" className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-5xl text-amber-400/60"><span>✦</span><span className="mt-3 px-2 text-center text-xs text-white/60">{person.name}</span></div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-md bg-red-700/90 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">Winner</span>
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] font-black uppercase tracking-wide text-amber-400">{person.role}</p>
                      <h3 className="mt-1 text-base font-black sm:text-lg">{person.name}</h3>
                      <Link href={`/movie/${person.movieId}`} className="mt-2 block text-xs text-white/55 hover:text-amber-300">{person.film} →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FILM PHOTOGRAPHY */}
        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">A year on the big screen</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">The Films That Took the Stage</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {FEATURED_FILMS.map((film) => {
              const still = imageUrl(movies.get(film.id), "backdrop") ?? imageUrl(movies.get(film.id), "poster");
              return (
                <Link href={`/movie/${film.id}`} key={film.id} className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#190d12] hover:border-amber-400/60">
                  {still && <img src={still} alt={`${film.name} film artwork`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black tracking-widest text-amber-300">{film.label}</p>
                    <h3 className="mt-1 text-xl font-black">{film.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CATEGORY LINKS */}
        <nav aria-label="Oscar categories" className="mt-16 flex gap-2 overflow-x-auto border-y border-white/10 py-5">
          {OSCAR_GROUPS.map((group) => (
            <a key={group} href={`#${sectionId(group)}`} className="shrink-0 rounded-full border border-red-900/80 bg-[#1b0c12] px-5 py-3 text-sm font-bold text-white/75 transition hover:border-amber-400 hover:text-amber-300">
              {group}
            </a>
          ))}
          <a href="#hall-of-fame" className="shrink-0 rounded-full border border-amber-400/50 px-5 py-3 text-sm font-bold text-amber-300 hover:bg-amber-400/10">Hall of Fame</a>
        </nav>

        {/* ALL 24 AWARD CATEGORIES */}
        {OSCAR_GROUPS.map((group) => {
          const awards = OSCAR_2026.filter((award) => award.group === group);
          return (
            <section key={group} id={sectionId(group)} className="mt-16 scroll-mt-24">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">98th Academy Awards · Winners & Nominees</p>
              <div className="mb-7 mt-2 flex items-end justify-between gap-3 border-b border-amber-400/20 pb-5">
                <h2 className="text-3xl font-black sm:text-4xl">{group}</h2>
                <span className="shrink-0 text-sm text-white/40">{awards.length} awards</span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {awards.map((award) => {
                  const movie = award.movieId ? movies.get(award.movieId) : null;
                  const castPortrait = movie && (group === "Headliners") ? portraitUrl(movie, award.winner) : null;
                  const banner = castPortrait ?? imageUrl(movie, "backdrop") ?? imageUrl(movie, "poster");
                  return (
                    <article key={award.category} className="overflow-hidden rounded-2xl border border-white/10 bg-[#151013] transition hover:border-amber-400/35">
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#3b0a16] to-[#0c0a0e]">
                        {banner ? (
                          <img src={banner} alt={`${award.film} artwork`} loading="lazy" className={`h-full w-full ${castPortrait ? "object-cover object-[center_25%]" : "object-cover"}`} />
                        ) : (
                          <div className="flex h-full items-center justify-center text-6xl text-amber-400/35">✦</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151013] via-black/5 to-transparent" />
                        <span className="absolute left-4 top-4 rounded-full border border-amber-300/50 bg-black/75 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300">★ Oscar Winner</span>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-black uppercase tracking-[0.13em] text-red-400">{award.category}</p>
                        <h3 className="mt-2 text-xl font-black leading-tight">{award.winner}</h3>
                        <p className="mt-2 text-sm text-white/55">{award.film}</p>
                        {award.movieId && (
                          <Link href={`/movie/${award.movieId}`} className="mt-4 inline-block text-sm font-bold text-amber-400 hover:underline">Discover the film →</Link>
                        )}
                      </div>
                      {award.nominees.length > 0 && (
                        <details className="group border-t border-white/10">
                          <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-white/70 hover:text-amber-300">View other nominees ({award.nominees.length})</summary>
                          <ul className="space-y-2 border-t border-white/10 px-5 py-4 text-sm text-white/60">
                            {award.nominees.map((nominee) => <li key={nominee} className="flex gap-2"><span className="text-amber-400">◇</span>{nominee}</li>)}
                          </ul>
                        </details>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* BEST PICTURE HISTORY */}
        <section id="hall-of-fame" className="mt-20 scroll-mt-24 border-t border-amber-400/20 pt-12">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">The legends of cinema</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Best Picture <span className="text-amber-400">Hall of Fame</span></h2>
          <p className="mt-3 max-w-2xl text-sm text-white/55">Revisit films that claimed Hollywood's biggest prize.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {OSCAR_BEST_PICTURE.map((id) => {
              const movie = movies.get(id);
              const poster = imageUrl(movie, "poster");
              return (
                <Link key={id} href={`/movie/${id}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#171015] hover:border-amber-400/50">
                  {poster ? (
                    <img src={poster} alt={`${movie?.title ?? "Best Picture winner"} poster`} loading="lazy" className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-[#290a16] text-4xl text-amber-400">✦</div>
                  )}
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-amber-400">★ Best Picture</p>
                    <h3 className="mt-1 text-sm font-bold group-hover:text-amber-300">{movie?.title ?? `Film #${id}`}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-7 text-center text-xs leading-relaxed text-white/40">
          <p>CINRYVAN is independent and not affiliated with the Academy of Motion Picture Arts and Sciences.</p>
          <p className="mt-2">Movie and performer imagery provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          <a href="https://www.oscars.org/oscars/ceremonies/2026" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold text-amber-400 hover:underline">Official Oscars 2026 results ↗</a>
        </footer>
      </div>
    </main>
  );
}
