import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

const TMDB_BASE = "https://api.themoviedb.org/3";

type KnownFor = {
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
  known_for?: KnownFor[];
  popularity?: number;
  adult?: boolean;
};

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

async function fetchPopularPeople(page: number): Promise<Person[]> {
  try {
    const response = await fetch(
      withKey(
        `${TMDB_BASE}/person/popular?language=en-US&page=${page}`,
      ),
      {
        headers: authHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [];

    const data = await response.json();

    return Array.isArray(data?.results)
      ? data.results
      : [];
  } catch {
    return [];
  }
}

function getKnownFor(person: Person) {
  const credit = person.known_for?.find(
    (item) => item.title || item.name,
  );

  return credit?.title || credit?.name || null;
}

export default async function PopularCelebrities() {
  const results = await Promise.all([
    fetchPopularPeople(1),
    fetchPopularPeople(2),
  ]);

  const people = Array.from(
    new Map(
      results
        .flat()
        .filter(
          (person) =>
            person.id &&
            person.name &&
            person.profile_path &&
            person.adult !== true,
        )
        .map((person) => [person.id, person]),
    ).values(),
  )
    .sort(
      (a, b) =>
        (b.popularity || 0) - (a.popularity || 0),
    )
    .slice(0, 18);

  if (!people.length) return null;

  return (
    <section className="relative border-b border-white/[0.08] pb-6 sm:pb-8">
      <div className="mb-5 flex items-end justify-between border-l-2 border-yellow-400/70 pl-3 sm:pl-4">
        <div>
        <Link
        href="/people"
        className="shrink-0 text-xs font-black uppercase tracking-[0.16em] text-yellow-400 transition hover:text-yellow-200 sm:text-sm"
        >
        View all celebrities →
        </Link>

          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400/80">
            Faces of cinema
          </p>

          <h2 className="mt-1 text-xl font-black sm:text-2xl md:text-3xl">
            Popular celebrities
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-white/45">
            Explore actors, filmmakers and creators shaping movies
            and television.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 [scrollbar-color:#facc15_transparent] [scrollbar-width:thin]">
        <div className="grid auto-cols-[145px] grid-flow-col gap-3 sm:auto-cols-[175px] sm:gap-4 lg:auto-cols-[195px]">
          {people.map((person) => {
            const image = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
            const knownFor = getKnownFor(person);

            return (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                prefetch={false}
                className="group relative overflow-hidden border border-white/10 bg-[#0c1119] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  <Image
                    src={image}
                    alt={`${person.name} profile`}
                    fill
                    sizes="(max-width: 640px) 145px, 195px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

                  <span className="absolute left-2 top-2 border border-yellow-400/30 bg-black/70 px-2 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-yellow-300 backdrop-blur-md">
                    {person.known_for_department || "Entertainment"}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="line-clamp-2 text-base font-black leading-tight text-white transition group-hover:text-yellow-300 sm:text-lg">
                      {person.name}
                    </h3>

                    {knownFor && (
                      <p className="mt-1 line-clamp-1 text-[11px] text-white/55">
                        Known for {knownFor}
                      </p>
                    )}
                  </div>
                </div>

                <div className="h-1 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}