import type { Metadata } from "next";
import Image from "next/image";
import CelebritySearch from "@/components/CelebritySearch";
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

  const featuredPerson =
  trending[0] || enrichedPeople[0];

    const featuredImage = featuredPerson?.profile_path
    ? `https://image.tmdb.org/t/p/original${featuredPerson.profile_path}`
    : null;

    const trendingRanking = trending.slice(1, 9);

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
  <main className="min-h-screen overflow-hidden bg-[#05070d] pb-24 text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />

    {/* Editorial celebrity hero */}
    <section className="relative min-h-[720px] overflow-hidden border-b border-white/10 pt-14">
      {featuredPerson && featuredImage && (
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
          <Image
            src={featuredImage}
            alt={featuredPerson.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-top"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/95 to-[#05070d]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(250,204,21,0.12),transparent_32%)]" />

      <div className="relative mx-auto flex min-h-[720px] max-w-[1500px] items-center px-4 py-20 sm:px-6 md:px-8">
        <div className="w-full max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-yellow-400">
            CINRYVAN Celebrity Universe
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
            Every face has
            <span className="block text-yellow-400">
              a story.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Search actors, actresses, directors and creators.
            Explore biographies, birthdays, relationships,
            filmographies, awards and the stories behind the screen.
          </p>

          <div className="mt-9 max-w-3xl">
            <CelebritySearch />
          </div>

          {featuredPerson && (
            <Link
              href={`/person/${featuredPerson.id}`}
              className="mt-7 inline-flex items-center gap-3 border-l-2 border-yellow-400 pl-4"
            >
              <span>
                <span className="block text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400">
                  Featured today
                </span>

                <span className="mt-1 block text-xl font-black">
                  {featuredPerson.name}
                </span>
              </span>

              <span className="text-yellow-400">View profile →</span>
            </Link>
          )}
        </div>
      </div>
    </section>

    {/* Discovery navigation */}
    <nav className="sticky top-14 z-20 border-b border-white/10 bg-[#080b12]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-4 py-4 sm:px-6 md:px-8">
        {[
          ["Trending", "#trending"],
          ["Actors", "#actors"],
          ["Birthdays", "#birthdays"],
          ["Birth months", "#months"],
          ["Filmmakers", "#filmmakers"],
          ["In remembrance", "#remembered"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-[0.15em] text-white/65 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>

    <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8">
      {/* Trending editorial area */}
      <section
        id="trending"
        className="scroll-mt-36 py-16"
      >
        <SectionHeading
          number="01"
          eyebrow="Live celebrity radar"
          title="Trending right now"
          description="The performers and creators attracting attention across film and television."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {featuredPerson && (
            <Link
              href={`/person/${featuredPerson.id}`}
              className="group relative min-h-[560px] overflow-hidden border border-white/10 bg-[#0c1119]"
            >
              {featuredPerson.profile_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/original${featuredPerson.profile_path}`}
                  alt={featuredPerson.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
                  No. 1 trending
                </p>

                <h2 className="mt-3 text-4xl font-black sm:text-6xl">
                  {featuredPerson.name}
                </h2>

                <p className="mt-3 text-sm text-white/55">
                  {featuredPerson.known_for_department ||
                    "Entertainment"}
                  {getKnownFor(featuredPerson)
                    ? ` • Known for ${getKnownFor(featuredPerson)}`
                    : ""}
                </p>
              </div>
            </Link>
          )}

          <div className="border border-white/10 bg-[#0a0e16]">
            <div className="border-b border-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Celebrity ranking
              </p>
            </div>

            {trendingRanking.map((person, index) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group grid grid-cols-[45px_64px_1fr_auto] items-center gap-3 border-b border-white/[0.07] p-3 transition last:border-0 hover:bg-yellow-400/[0.07]"
              >
                <span className="text-xl font-black text-white/20">
                  {String(index + 2).padStart(2, "0")}
                </span>

                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                    alt={person.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-black group-hover:text-yellow-300">
                    {person.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-white/35">
                    {person.known_for_department ||
                      "Entertainment"}
                  </p>
                </div>

                <span className="text-yellow-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Actors grid */}
      <section
        id="actors"
        className="scroll-mt-36 border-t border-white/10 py-16"
      >
        <SectionHeading
          number="02"
          eyebrow="On screen"
          title="Actors and performers"
          description="Explore internationally known stars and emerging performers."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {actors.slice(0, 18).map((person, index) => (
            <EditorialPersonCard
              key={person.id}
              person={person}
              position={index + 1}
            />
          ))}
        </div>
      </section>

      {/* Birthdays */}
      <section
        id="birthdays"
        className="scroll-mt-36 border-y border-yellow-400/20 bg-gradient-to-r from-yellow-400/[0.09] via-transparent to-yellow-400/[0.03] px-5 py-12 sm:px-8"
      >
        <SectionHeading
          number="03"
          eyebrow={`${months[currentMonth - 1]} calendar`}
          title="Celebrity birthdays"
          description={`Discover celebrities born during ${months[currentMonth - 1]}.`}
        />

        {birthdaysThisMonth.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {birthdaysThisMonth.map((person) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group text-center"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[170px] overflow-hidden rounded-full border-2 border-white/10 transition group-hover:border-yellow-400">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    fill
                    sizes="170px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-4 font-black group-hover:text-yellow-300">
                  {person.name}
                </h3>

                {person.birthday && (
                  <p className="mt-1 text-xs text-white/40">
                    {new Date(
                      `${person.birthday}T00:00:00`,
                    ).toLocaleDateString("en", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-7 text-white/45">
            More birthday profiles are being added.
          </p>
        )}
      </section>

      {/* Month directory */}
      <section
        id="months"
        className="scroll-mt-36 py-16"
      >
        <SectionHeading
          number="04"
          eyebrow="Celebrity calendar"
          title="Born in every month"
          description="Browse famous people by birth month and discover shared birthdays."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {peopleByMonth.map(({ month, people }, monthIndex) => (
            <article
              key={month}
              className="group relative min-h-[210px] overflow-hidden border border-white/10 bg-[#0a0e16] p-5 transition hover:border-yellow-400/50"
            >
              <span className="absolute right-4 top-2 text-6xl font-black text-white/[0.03]">
                {String(monthIndex + 1).padStart(2, "0")}
              </span>

              <h3 className="relative text-2xl font-black">
                {month}
              </h3>

              <div className="relative mt-6 flex -space-x-4">
                {people.slice(0, 5).map((person) => (
                  <Link
                    key={person.id}
                    href={`/person/${person.id}`}
                    title={person.name}
                    className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#0a0e16] transition hover:z-10 hover:scale-110 hover:border-yellow-400"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                      alt={person.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>

              <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.16em] text-yellow-400">
                {people.length > 0
                  ? `${people.length} featured profiles`
                  : "Profiles coming soon"}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Filmmakers */}
      {filmmakers.length > 0 && (
        <section
          id="filmmakers"
          className="scroll-mt-36 border-t border-white/10 py-16"
        >
          <SectionHeading
            number="05"
            eyebrow="Behind the camera"
            title="Directors, writers and creators"
            description="Meet the filmmakers building the worlds audiences remember."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filmmakers.map((person) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group grid grid-cols-[110px_1fr] overflow-hidden border border-white/10 bg-[#0a0e16] transition hover:border-yellow-400/50"
              >
                <div className="relative min-h-[145px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                    alt={person.name}
                    fill
                    sizes="110px"
                    className="object-cover"
                  />
                </div>

                <div className="self-center p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">
                    {person.known_for_department}
                  </p>

                  <h3 className="mt-2 text-xl font-black group-hover:text-yellow-300">
                    {person.name}
                  </h3>

                  {getKnownFor(person) && (
                    <p className="mt-2 line-clamp-2 text-sm text-white/40">
                      Known for {getKnownFor(person)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Remembrance */}
      {remembered.length > 0 && (
        <section
          id="remembered"
          className="scroll-mt-36 border-t border-white/10 py-16"
        >
          <SectionHeading
            number="06"
            eyebrow="In remembrance"
            title="Legends who shaped entertainment"
            description="Celebrating lasting careers, unforgettable performances and creative legacies."
          />

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {remembered.map((person, index) => (
              <EditorialPersonCard
                key={person.id}
                person={person}
                position={index + 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* A-Z discovery */}
      <section className="border-t border-white/10 py-16">
        <SectionHeading
          number="A–Z"
          eyebrow="Name directory"
          title="Find any celebrity"
          description="Use celebrity search or begin exploring by the first letter of a name."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(
            (letter) => (
              <button
                key={letter}
                type="button"
                className="grid h-12 w-12 place-items-center border border-white/10 bg-white/[0.03] font-black text-white/55 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                {letter}
              </button>
            ),
          )}
        </div>

        <div className="mt-8 max-w-3xl">
          <CelebritySearch />
        </div>
      </section>
    </div>
  </main>
);
}

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="pt-1 text-xs font-black text-yellow-400">
        {number}
      </span>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

function EditorialPersonCard({
  person,
  position,
}: {
  person: Person;
  position: number;
}) {
  const knownFor = getKnownFor(person);

  if (!person.profile_path) return null;

  return (
    <Link
      href={`/person/${person.id}`}
      prefetch={false}
      className="group relative overflow-hidden border border-white/10 bg-[#0a0e16] transition hover:-translate-y-1 hover:border-yellow-400/60"
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={person.name}
          fill
          sizes="(max-width: 640px) 50vw, 220px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <span className="absolute left-3 top-3 text-2xl font-black text-white/25">
          {String(position).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-black leading-tight group-hover:text-yellow-300">
            {person.name}
          </h3>

          {knownFor && (
            <p className="mt-1 line-clamp-1 text-[11px] text-white/45">
              {knownFor}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
