// app/person/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 86400;

const SITE_URL = "https://cinryvan.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

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
) {
  if (department === "Acting") {
    return `${name}: Movies, TV Shows & Biography`;
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
    .slice(0, 30);
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
    <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-28 md:px-6">
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

      <section className="relative overflow-hidden border border-white/10 bg-[#0c1119]">
        {profile && (
          <div className="absolute inset-0 opacity-[0.08]">
            <Image
              src={profile}
              alt=""
              fill
              priority
              className="scale-110 object-cover blur-3xl"
            />
          </div>
        )}

        <div className="relative grid gap-8 p-5 md:grid-cols-[300px_1fr] md:p-8">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[300px] overflow-hidden bg-white/5 ring-1 ring-white/10 md:mx-0">
            {profile ? (
              <Image
                src={profile}
                alt={`${person.name} profile`}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 300px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/40">
                No photo available
              </div>
            )}

            <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-yellow-400" />
          </div>

          <div className="self-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              CINRYVAN People
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight text-white md:text-6xl">
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
    </main>
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
    );

    const biography = cleanSeoText(
      person.biography,
    );

    const details = [
      person.known_for_department
        ? `Known for ${person.known_for_department.toLowerCase()}.`
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
      biography
        ? `${biography} ${details}`
        : `${name} biography and filmography. ${details}`,
      158,
    );

    const image = person.profile_path
      ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
      : DEFAULT_OG_IMAGE;

    const isExtremelyThin =
      !biography &&
      !person.profile_path &&
      knownCredits.length === 0;

    return {
      title: pageTitle,
      description,

      category: "Entertainment",

      alternates: {
        canonical,
      },

      robots: {
        index: !isExtremelyThin,
        follow: true,
        googleBot: {
          index: !isExtremelyThin,
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
        index: true,
        follow: true,
      },
    };
  }
}