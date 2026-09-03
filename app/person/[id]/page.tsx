

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 86400;

const SITE_URL = "https://cinryvan.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const INDEXABLE_PERSON_IDS = new Set([
  1073864,
  1636925,
  2751202,
  18974,
]);

function isStrongPersonPage(
  personId: number,
  person: any,
  knownCredits: Credit[],
) {
  if (INDEXABLE_PERSON_IDS.has(personId)) {
    return true;
  }

  const biographyLength = cleanSeoText(
    person.biography,
  ).length;

  return (
    Boolean(person.profile_path) &&
    biographyLength >= 120 &&
    knownCredits.length >= 5
  );
}

const img = (path?: string | null, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : null;

type PageProps = {
  params: Promise<{ id: string }>;
};

type Credit = {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  popularity?: number;
  vote_average?: number;
  character?: string;
  job?: string;
};

async function tmdb(path: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;

  const separator = path.includes("?") ? "&" : "?";

  const url = apiKey
    ? `https://api.themoviedb.org/3${path}${separator}api_key=${apiKey}`
    : `https://api.themoviedb.org/3${path}`;

  try {
    const response = await fetch(url, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          }
        : {
            accept: "application/json",
          },
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      console.error(
        "TMDB PERSON ERROR:",
        response.status,
        path,
      );

      return null;
    }

    return response.json();
  } catch (error) {
    console.error("TMDB PERSON FETCH ERROR:", path, error);
    return null;
  }
}

function cleanSeoText(value?: string | null) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSeoText(
  value: string,
  maximumLength = 158,
) {
  if (value.length <= maximumLength) return value;

  const shortened = value
    .slice(0, maximumLength - 1)
    .replace(/\s+\S*$/, "")
    .replace(/[,:;.!?\s]+$/, "");

  return `${shortened}…`;
}

function formatDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateAge(
  birthday?: string | null,
  deathday?: string | null,
) {
  if (!birthday) return null;

  const birthDate = new Date(`${birthday}T00:00:00`);
  const finalDate = deathday
    ? new Date(`${deathday}T00:00:00`)
    : new Date();

  if (
    Number.isNaN(birthDate.getTime()) ||
    Number.isNaN(finalDate.getTime())
  ) {
    return null;
  }

  let age =
    finalDate.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    finalDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      finalDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function getCreditTitle(credit: Credit) {
  return (
    credit.title ||
    credit.name ||
    "Untitled"
  );
}

function getCreditDate(credit: Credit) {
  return (
    credit.release_date ||
    credit.first_air_date ||
    ""
  );
}

function getCreditRoute(credit: Credit) {
  return credit.media_type === "tv"
    ? `/tv/${credit.id}`
    : `/movie/${credit.id}`;
}

function getMetadataTitle(
  name: string,
  department?: string | null,
  isLiving = true,
) {
  if (department === "Acting") {
    return isLiving
      ? `${name}: Age, Movies, TV Shows & Biography`
      : `${name}: Movies, TV Shows & Biography`;
  }

  if (department === "Directing") {
    return `${name}: Director, Movies & Biography`;
  }

  if (department === "Writing") {
    return `${name}: Writer, Movies & Biography`;
  }

  return `${name}: Biography & Filmography`;
}

function prepareCredits(credits: any) {
  const castCredits: Credit[] =
    Array.isArray(credits?.cast)
      ? credits.cast
      : [];

  const crewCredits: Credit[] =
    Array.isArray(credits?.crew)
      ? credits.crew
      : [];

  const merged = [...castCredits, ...crewCredits];

  const uniqueCredits = new Map<string, Credit>();

  for (const credit of merged) {
    if (!credit?.id || !credit.poster_path) continue;

    const mediaType =
      credit.media_type === "tv" ? "tv" : "movie";

    const key = `${mediaType}-${credit.id}`;
    const previous = uniqueCredits.get(key);

    if (
      !previous ||
      (credit.popularity || 0) >
        (previous.popularity || 0)
    ) {
      uniqueCredits.set(key, {
        ...credit,
        media_type: mediaType,
      });
    }
  }

  return Array.from(uniqueCredits.values())
    .sort(
      (a, b) =>
        (b.popularity || 0) -
        (a.popularity || 0),
    )
    .slice(0, 60);
}

function getCareerYears(credits: Credit[]) {
  const years = credits
    .map((credit) => Number(getCreditDate(credit).slice(0, 4)))
    .filter((year) => Number.isInteger(year) && year > 1800);

  if (!years.length) return null;

  return {
    first: Math.min(...years),
    latest: Math.max(...years),
  };
}

export default async function PersonPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const personId = Number(id);

  if (
    !Number.isSafeInteger(personId) ||
    personId < 1
  ) {
    notFound();
  }

  const [person, credits] = await Promise.all([
    tmdb(`/person/${personId}`),
    tmdb(`/person/${personId}/combined_credits`),
  ]);

  if (!person?.name) {
    notFound();
  }

  const profile = img(person.profile_path, "w780");
  const knownCredits = prepareCredits(credits);
  const heroBackdrop = img(
    knownCredits.find((credit) => credit.backdrop_path)?.backdrop_path,
    "original",
  );

  const movies = knownCredits.filter(
    (credit) => credit.media_type === "movie",
  );

  const television = knownCredits.filter(
    (credit) => credit.media_type === "tv",
  );

  const birthday = formatDate(person.birthday);
  const deathday = formatDate(person.deathday);

  const age = calculateAge(
    person.birthday,
    person.deathday,
  );
  const careerYears = getCareerYears(knownCredits);
  const highestRated = [...knownCredits]
    .filter((credit) => (credit.vote_average || 0) > 0)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))[0];
  const knownFor = knownCredits.slice(0, 6);

  const personUrl = `${SITE_URL}/person/${personId}`;

  const sameAs = [
    person.imdb_id
      ? `https://www.imdb.com/name/${person.imdb_id}/`
      : null,
    person.homepage || null,
  ].filter(Boolean);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${personUrl}#person`,

    name: person.name,

    description:
      cleanSeoText(person.biography) ||
      `${person.name} is known for work in ${
        person.known_for_department ||
        "film and television"
      }.`,

    url: personUrl,

    image:
      profile || DEFAULT_OG_IMAGE,

    jobTitle:
      person.known_for_department || undefined,

    birthDate:
      person.birthday || undefined,

    deathDate:
      person.deathday || undefined,

    birthPlace:
      person.place_of_birth
        ? {
            "@type": "Place",
            name: person.place_of_birth,
          }
        : undefined,

    sameAs:
      sameAs.length > 0
        ? sameAs
        : undefined,

    mainEntityOfPage: personUrl,

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  const filmographyJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${person.name} filmography`,
    url: personUrl,

    numberOfItems: knownCredits.length,

    itemListElement: knownCredits
      .slice(0, 20)
      .map((credit, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: getCreditTitle(credit),
        url:
          `${SITE_URL}${getCreditRoute(credit)}`,
      })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "People",
        item: `${SITE_URL}/person/${personId}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: person.name,
        item: personUrl,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-24 md:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            personJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            filmographyJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative min-h-[680px] overflow-hidden border border-white/10 bg-[#090d14]">
        {(heroBackdrop || profile) && (
          <div className="absolute inset-0">
            <Image
              src={heroBackdrop || profile!}
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover ${heroBackdrop ? "opacity-55" : "scale-110 opacity-20 blur-3xl"}`}
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}

        <div
          className={`relative grid min-h-[680px] items-end gap-8 p-5 pb-10 md:p-10 lg:p-14 ${
            profile ? "md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]" : "md:grid-cols-1"
          }`}
        >
          {profile && (
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[360px] overflow-hidden bg-white/5 shadow-2xl ring-1 ring-white/15 md:mx-0">
              <Image
                src={profile}
                alt={`${person.name} profile`}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 360px"
                className="object-cover"
              />

              <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-yellow-400" />
            </div>
          )}

          <div className="self-center">
            {!profile && (
              <div className="mb-6 grid h-24 w-24 place-items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-3xl font-black text-yellow-300">
                {person.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part: string) => part.charAt(0))
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              CINRYVAN People
            </p>

            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-7xl lg:text-8xl">
              {person.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white/70">
              {person.known_for_department && (
                <span className="border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-yellow-200">
                  {person.known_for_department}
                </span>
              )}

              {birthday && (
                <span className="border border-white/10 bg-white/5 px-4 py-2">
                  Born: {birthday}
                </span>
              )}

              {age !== null && (
                <span className="border border-white/10 bg-white/5 px-4 py-2">
                  {person.deathday
                    ? `Lived ${age} years`
                    : `Age ${age}`}
                </span>
              )}

              {deathday && (
                <span className="border border-white/10 bg-white/5 px-4 py-2">
                  Died: {deathday}
                </span>
              )}

              {person.place_of_birth && (
                <span className="border border-white/10 bg-white/5 px-4 py-2">
                  {person.place_of_birth}
                </span>
              )}
            </div>

            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={movies.length} label="Movies" />
              <StatCard value={television.length} label="TV shows" />
              <StatCard
                value={careerYears ? `${careerYears.first}–${careerYears.latest}` : "—"}
                label="Career years"
              />
              <StatCard
                value={highestRated?.vote_average ? highestRated.vote_average.toFixed(1) : "—"}
                label="Highest rating"
              />
            </div>

            {person.biography ? (
              <div className="mt-7 max-w-3xl">
                <h2 className="text-xl font-black text-white">
                  Biography
                </h2>

                <p className="mt-3 whitespace-pre-line leading-8 text-white/65">
                  {person.biography}
                </p>
              </div>
            ) : (
              <p className="mt-7 max-w-2xl leading-7 text-white/45">
                A complete biography for {person.name} is
                not available yet. Explore their known
                movies and television work below.
              </p>
            )}
          </div>
        </div>
      </section>

      <nav aria-label="Explore CINRYVAN" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <ExploreLink href={`/search?q=${encodeURIComponent(person.name)}`} label="Search CINRYVAN" detail={`More about ${person.name}`} accent />
        <ExploreLink href="/movie" label="Explore Movies" detail="Popular and new films" />
        <ExploreLink href="/tv" label="Explore TV Shows" detail="Series and episodes" />
        <ExploreLink href="/news/entertainment" label="Entertainment News" detail="Film, TV and celebrity news" />
        <ExploreLink href="/games" label="Explore Games" detail="New and popular games" />
      </nav>

      {knownFor.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Career spotlight" title={`What is ${person.name} known for?`} />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {knownFor.map((credit, index) => (
              <FeaturedCredit key={`${credit.media_type}-${credit.id}`} credit={credit} rank={index + 1} />
            ))}
          </div>
        </section>
      )}

      {movies.length > 0 && (
        <CreditSection
          title={`Movies featuring ${person.name}`}
          eyebrow="Filmography"
          credits={movies}
        />
      )}

      {television.length > 0 && (
        <CreditSection
          title={`TV shows featuring ${person.name}`}
          eyebrow="Television"
          credits={television}
        />
      )}

      {knownCredits.length === 0 && (
        <section className="mt-12 border border-white/10 bg-white/[0.03] p-8 text-center">
          <h2 className="text-2xl font-black text-white">
            Filmography unavailable
          </h2>

          <p className="mt-3 text-white/50">
            Movie and television credits have not been
            added for {person.name}.
          </p>
        </section>
      )}

      {knownCredits.length > 0 && (
        <section className="mt-16 grid gap-6 border border-white/10 bg-[#0b1018] p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Career overview</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Film and television timeline</h2>
            <p className="mt-4 max-w-lg leading-7 text-white/55">
              Browse a quick timeline of {person.name}&apos;s most recent and notable credited work, then open any title for trailers, ratings, cast and viewing information.
            </p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {[...knownCredits]
              .sort((a, b) => getCreditDate(b).localeCompare(getCreditDate(a)))
              .slice(0, 10)
              .map((credit) => (
                <Link
                  key={`timeline-${credit.media_type}-${credit.id}`}
                  href={getCreditRoute(credit)}
                  prefetch={false}
                  className="grid grid-cols-[52px_1fr_auto] items-center gap-3 py-4 text-sm transition hover:text-yellow-300"
                >
                  <span className="font-black text-yellow-400">{getCreditDate(credit).slice(0, 4) || "—"}</span>
                  <span className="font-bold text-white">{getCreditTitle(credit)}</span>
                  <span className="text-xs uppercase tracking-wider text-white/40">{credit.media_type === "tv" ? "TV" : "Movie"} →</span>
                </Link>
              ))}
          </div>
        </section>
      )}

      <section className="mt-16 overflow-hidden border border-yellow-400/25 bg-yellow-400 px-6 py-10 text-black md:px-10">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em]">Continue exploring</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-6xl">Discover the worlds behind the screen.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/news/entertainment" className="bg-black px-5 py-3 text-sm font-black text-white">Latest entertainment news</Link>
            <Link href="/games" className="border border-black/30 px-5 py-3 text-sm font-black">Browse games</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</div>
    </div>
  );
}

function ExploreLink({ href, label, detail, accent = false }: { href: string; label: string; detail: string; accent?: boolean }) {
  return (
    <Link href={href} prefetch={false} className={`group border p-5 transition hover:-translate-y-1 ${accent ? "border-yellow-400 bg-yellow-400 text-black" : "border-white/10 bg-white/[0.03] text-white hover:border-yellow-400/50"}`}>
      <div className="flex items-center justify-between gap-3 font-black"><span>{label}</span><span>↗</span></div>
      <p className={`mt-2 text-xs ${accent ? "text-black/65" : "text-white/45"}`}>{detail}</p>
    </Link>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-white/10 pb-5">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">{title}</h2>
    </div>
  );
}

function FeaturedCredit({ credit, rank }: { credit: Credit; rank: number }) {
  const backdrop = img(credit.backdrop_path, "w780");
  const poster = img(credit.poster_path, "w500");
  const title = getCreditTitle(credit);
  return (
    <Link href={getCreditRoute(credit)} prefetch={false} className="group relative min-h-[250px] overflow-hidden border border-white/10 bg-[#0c1119]">
      {(backdrop || poster) && <Image src={backdrop || poster!} alt={`${title} artwork`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-xs font-black text-yellow-400">#{rank} · {credit.media_type === "tv" ? "TV SHOW" : "MOVIE"}</div>
        <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        <div className="mt-2 flex gap-3 text-xs text-white/60"><span>{getCreditDate(credit).slice(0, 4) || "Date unknown"}</span>{credit.vote_average ? <span>★ {credit.vote_average.toFixed(1)}</span> : null}</div>
      </div>
    </Link>
  );
}

function CreditSection({
  title,
  eyebrow,
  credits,
}: {
  title: string;
  eyebrow: string;
  credits: Credit[];
}) {
  return (
    <section className="mt-14">
      <div className="border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          {title}
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {credits.map((credit) => {
          const poster = img(
            credit.poster_path,
            "w342",
          );

          const title = getCreditTitle(credit);
          const date = getCreditDate(credit);
          const year = date.slice(0, 4);

          return (
            <Link
              key={`${credit.media_type}-${credit.id}`}
              href={getCreditRoute(credit)}
              prefetch={false}
              className="group overflow-hidden border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-yellow-400/60"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-black/20">
                {poster && (
                  <Image
                    src={poster}
                    alt={`${title} poster`}
                    fill
                    sizes="(max-width: 640px) 50vw, 170px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}

                <span className="absolute left-2 top-2 bg-black/75 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/70">
                  {credit.media_type === "tv"
                    ? "TV"
                    : "Movie"}
                </span>

                {typeof credit.vote_average === "number" &&
                  credit.vote_average > 0 && (
                    <span className="absolute right-2 top-2 bg-yellow-400 px-2 py-1 text-[9px] font-black text-black">
                      ★ {credit.vote_average.toFixed(1)}
                    </span>
                  )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 font-bold text-white transition group-hover:text-yellow-300">
                  {title}
                </h3>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-white/45">
                  <span>{year || "Date unknown"}</span>

                  {(credit.character || credit.job) && (
                    <span className="line-clamp-1 text-right">
                      {credit.character || credit.job}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return {
      title: "Person Not Found",
      description:
        "The requested person could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const personId = Number(id);

  if (
    !Number.isSafeInteger(personId) ||
    personId < 1
  ) {
    return {
      title: "Person Not Found",
      description:
        "The requested person could not be found on CINRYVAN.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `${SITE_URL}/person/${personId}`;

  try {
    const [person, credits] = await Promise.all([
      tmdb(`/person/${personId}`),
      tmdb(`/person/${personId}/combined_credits`),
    ]);

    if (!person?.name) {
      return {
        title: "Person Not Found",
        description:
          "The requested person could not be found on CINRYVAN.",
        alternates: {
          canonical,
        },
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const knownCredits = prepareCredits(credits);
    const name = cleanSeoText(person.name);

    const pageTitle = getMetadataTitle(
      name,
      person.known_for_department,
      !person.deathday,
    );

    const biography = cleanSeoText(
      person.biography,
    );

    const topTitles = knownCredits
      .slice(0, 3)
      .map(getCreditTitle)
      .filter((title) => title !== "Untitled");

    const details = [
      person.known_for_department
        ? `Known for ${person.known_for_department.toLowerCase()}.`
        : null,
      topTitles.length > 0
        ? `Credits include ${topTitles.join(", ")}.`
        : null,
      person.place_of_birth
        ? `Born in ${person.place_of_birth}.`
        : null,
      knownCredits.length > 0
        ? `Explore ${name}'s movies and TV shows on CINRYVAN.`
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    const description = truncateSeoText(
      topTitles.length > 0
        ? `${name} movies, TV shows, biography and career. ${details}`
        : biography
          ? `${biography} ${details}`
          : `${name} biography and filmography. ${details}`,
      158,
    );

    const image = person.profile_path
      ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
      : DEFAULT_OG_IMAGE;

    const shouldIndex = isStrongPersonPage(
      personId,
      person,
      knownCredits,
    );

    return {
      title: pageTitle,
      description,

      category: "Entertainment",

      alternates: {
        canonical,
      },

      robots: {
        index: shouldIndex,
        follow: true,
        googleBot: {
          index: shouldIndex,
          follow: true,
          noimageindex: false,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },

      openGraph: {
        title: `${pageTitle} | CINRYVAN`,
        description,
        url: canonical,
        siteName: "CINRYVAN",
        type: "profile",
        locale: "en_US",
        images: [
          {
            url: image,
            alt: `${name} profile and filmography`,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | CINRYVAN`,
        description,
        images: [
          {
            url: image,
            alt: `${name} profile and filmography`,
          },
        ],
      },
    };
  } catch {
    return {
      title: `Person ${personId}: Biography and Filmography`,
      description:
        "Discover actors, directors, filmmakers, movies and television credits on CINRYVAN.",
      alternates: {
        canonical,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
