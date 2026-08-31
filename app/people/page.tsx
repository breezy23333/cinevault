import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

const SITE_URL = "https://cinryvan.vercel.app";
const TMDB_BASE = "https://api.themoviedb.org/3";

export const metadata: Metadata = {
  title: "Celebrities, Actors, Directors & Birthdays",
  description:
    "Explore trending celebrities, popular actors, actresses, directors, birthdays, biographies and filmographies on CINRYVAN.",
  alternates: {
    canonical: "/people",
  },
  openGraph: {
    title: "Celebrities, Actors & Filmmakers | CINRYVAN",
    description:
      "Discover trending celebrities, birthdays, biographies, movies and television credits.",
    url: "/people",
    siteName: "CINRYVAN",
    type: "website",
    images: ["/og-image.png"],
  },
};

type Credit = {
  id?: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
};

type Person = {
  id: number;
  name: string;
  profile_path?: string | null;
  known_for_department?: string;
  known_for?: Credit[];
  popularity?: number;
  adult?: boolean;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  gender?: number;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function withKey(url: string) {
  const key =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return key
    ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}`
    : url;
}

function authHeaders(): Record<string, string> {
  const token =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN;

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function tmdb(path: string) {
  try {
    const response = await fetch(
      withKey(`${TMDB_BASE}${path}`),
      {
        headers: authHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function fetchPeople(path: string): Promise<Person[]> {
  const data = await tmdb(path);

  return Array.isArray(data?.results)
    ? data.results
    : [];
}

async function fetchPersonDetails(ids: number[]) {
  const results = await Promise.allSettled(
    ids.map((id) =>
      tmdb(`/person/${id}?language=en-US`),
    ),
  );

  return results
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<Person> =>
        result.status === "fulfilled" &&
        Boolean(result.value?.id),
    )
    .map((result) => result.value);
}

function uniquePeople(people: Person[]) {
  return Array.from(
    new Map(
      people
        .filter(
          (person) =>
            person.id &&
            person.name &&
            person.profile_path &&
            person.adult !== true,
        )
        .map((person) => [person.id, person]),
    ).values(),
  );
}

function getKnownFor(person: Person) {
  const credit = person.known_for?.find(
    (item) => item.title || item.name,
  );

  return credit?.title || credit?.name || null;
}

function getBirthdayMonth(birthday?: string | null) {
  if (!birthday || birthday.length < 7) return null;

  const month = Number(birthday.slice(5, 7));

  return month >= 1 && month <= 12
    ? month
    : null;
}

export default async function PeoplePage() {
  const [
    trendingPeople,
    popularPageOne,
    popularPageTwo,
    popularPageThree,
  ] = await Promise.all([
    fetchPeople("/trending/person/week?language=en-US"),
    fetchPeople("/person/popular?language=en-US&page=1"),
    fetchPeople("/person/popular?language=en-US&page=2"),
    fetchPeople("/person/popular?language=en-US&page=3"),
  ]);

  const popularPeople = uniquePeople([
    ...trendingPeople,
    ...popularPageOne,
    ...popularPageTwo,
    ...popularPageThree,
  ]).slice(0, 48);

  const details = await fetchPersonDetails(
    popularPeople.map((person) => person.id),
  );

  const detailMap = new Map(
    details.map((person) => [person.id, person]),
  );

  const enrichedPeople = popularPeople.map((person) => ({
    ...person,
    ...detailMap.get(person.id),
    known_for: person.known_for,
  }));

  const trending = uniquePeople(trendingPeople).slice(0, 16);

  const actors = enrichedPeople
    .filter(
      (person) =>
        person.known_for_department === "Acting",
    )
    .slice(0, 18);

  const filmmakers = enrichedPeople
    .filter((person) =>
      ["Directing", "Writing", "Production"].includes(
        person.known_for_department || "",
      ),
    )
    .slice(0, 18);

  const currentMonth = new Date().getUTCMonth() + 1;

  const birthdaysThisMonth = enrichedPeople
    .filter(
      (person) =>
        getBirthdayMonth(person.birthday) === currentMonth,
    )
    .slice(0, 18);

  const remembered = enrichedPeople
    .filter((person) => Boolean(person.deathday))
    .slice(0, 18);

  const peopleByMonth = months.map((month, index) => ({
    month,
    people: enrichedPeople
      .filter(
        (person) =>
          getBirthdayMonth(person.birthday) === index + 1,
      )
      .slice(0, 6),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CINRYVAN Celebrities",
    description:
      "Explore celebrities, actors, directors, birthdays and filmographies.",
    url: `${SITE_URL}/people`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: trending.length,
      itemListElement: trending.map((person, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: person.name,
        url: `${SITE_URL}/person/${person.id}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#05070d] px-4 pb-24 pt-28 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="mx-auto max-w-[1500px]">
        <section className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#17130a] via-[#0c1119] to-[#080b12] px-5 py-12 sm:px-8 md:py-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              CINRYVAN People
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl md:text-7xl">
              Celebrities beyond the screen
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
              Discover actors, directors, writers and creators.
              Explore biographies, birthdays, movies, television
              credits and the people shaping entertainment.
            </p>
          </div>
        </section>

        <PeopleSection
          eyebrow="Trending now"
          title="Celebrities people are watching"
          people={trending}
        />

        <PeopleSection
          eyebrow="Screen icons"
          title="Popular actors and performers"
          people={actors}
        />

        {birthdaysThisMonth.length > 0 && (
          <PeopleSection
            eyebrow={`${months[currentMonth - 1]} birthdays`}
            title="Born this month"
            people={birthdaysThisMonth}
          />
        )}

        {filmmakers.length > 0 && (
          <PeopleSection
            eyebrow="Behind the camera"
            title="Directors, writers and filmmakers"
            people={filmmakers}
          />
        )}

        {remembered.length > 0 && (
          <PeopleSection
            eyebrow="In remembrance"
            title="Celebrating entertainment legends"
            people={remembered}
          />
        )}

        <section className="mt-16">
          <div className="border-l-2 border-yellow-400 pl-4">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
              Celebrity calendar
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Celebrities born each month
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {peopleByMonth.map(({ month, people }) => (
              <div
                key={month}
                className="border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="text-xl font-black text-white">
                  {month}
                </h3>

                {people.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {people.map((person) => (
                      <Link
                        key={person.id}
                        href={`/person/${person.id}`}
                        prefetch={false}
                        className="group"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-full border border-white/10">
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                            alt={person.name}
                            fill
                            sizes="100px"
                            className="object-cover transition duration-300 group-hover:scale-110"
                          />
                        </div>

                        <p className="mt-2 line-clamp-2 text-center text-xs font-bold text-white/65 group-hover:text-yellow-300">
                          {person.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-white/35">
                    More birthdays coming soon.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PeopleSection({
  eyebrow,
  title,
  people,
}: {
  eyebrow: string;
  title: string;
  people: Person[];
}) {
  if (!people.length) return null;

  return (
    <section className="mt-16 border-b border-white/10 pb-10">
      <div className="border-l-2 border-yellow-400 pl-4">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          {title}
        </h2>
      </div>

      <div className="mt-7 overflow-x-auto pb-4 [scrollbar-color:#facc15_transparent] [scrollbar-width:thin]">
        <div className="grid auto-cols-[155px] grid-flow-col gap-4 sm:auto-cols-[190px]">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonCard({ person }: { person: Person }) {
  const knownFor = getKnownFor(person);

  return (
    <Link
      href={`/person/${person.id}`}
      prefetch={false}
      className="group overflow-hidden border border-white/10 bg-[#0c1119] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={`${person.name} profile`}
          fill
          sizes="(max-width: 640px) 155px, 190px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-lg font-black leading-tight">
            {person.name}
          </h3>

          {knownFor && (
            <p className="mt-1 line-clamp-1 text-[11px] text-white/55">
              Known for {knownFor}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-white/45">
        <span>
          {person.known_for_department || "Entertainment"}
        </span>

        <span className="text-yellow-400">View →</span>
      </div>
    </Link>
  );
}