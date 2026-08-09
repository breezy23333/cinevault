import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 86400;

const img = (p?: string | null, size = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

type PageProps = {
  params: Promise<{ id: string }>;
};

async function tmdb(path: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_BEARER;

  const url = apiKey
    ? `https://api.themoviedb.org/3${path}?api_key=${apiKey}`
    : `https://api.themoviedb.org/3${path}`;

  const res = await fetch(url, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        }
      : {},
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    console.log("TMDB PERSON ERROR:", res.status, path);
    return null;
  }

  return res.json();
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;

    if (!/^\d+$/.test(id)) {
    return notFound();
  }

  const [person, credits] = await Promise.all([
    tmdb(`/person/${id}`),
    tmdb(`/person/${id}/movie_credits`),
  ]);

  if (!person) return notFound();

  const profile = img(person.profile_path, "w500");

  const movies = Array.isArray(credits?.cast)
    ? credits.cast
        .filter((m: any) => m.poster_path)
        .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 24)
    : [];

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-28 md:px-6">
      <section className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          {profile ? (
            <Image src={profile} alt={person.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/50">
              No photo
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            CINRYVAN Person
          </p>

          <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">
            {person.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
            {person.known_for_department && (
              <span className="rounded-full bg-white/10 px-4 py-2">
                {person.known_for_department}
              </span>
            )}

            {person.birthday && (
              <span className="rounded-full bg-white/10 px-4 py-2">
                Born: {person.birthday}
              </span>
            )}

            {person.place_of_birth && (
              <span className="rounded-full bg-white/10 px-4 py-2">
                {person.place_of_birth}
              </span>
            )}
          </div>

          {person.biography && (
            <p className="mt-6 max-w-3xl leading-8 text-white/70">
              {person.biography}
            </p>
          )}
        </div>
      </section>

      {movies.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-black text-white">
            Movies Featuring {person.name}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie: any) => {
              const poster = img(movie.poster_path, "w342");

              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  prefetch={false}
                  className="group overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:ring-yellow-400/60"
                >
                  <div className="relative aspect-[2/3] bg-black/20">
                    {poster && (
                      <Image
                        src={poster}
                        alt={movie.title || "Movie"}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="line-clamp-2 font-bold text-white">
                      {movie.title || "Untitled"}
                    </h3>

                    {movie.release_date && (
                      <p className="mt-1 text-xs text-white/50">
                        {movie.release_date.slice(0, 4)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
      return {
        title: "Person Not Found",
        robots: { index: false, follow: false },
      };
    }

    const personId = Number(id);

    if (!Number.isSafeInteger(personId) || personId <= 0) {
      return {
        title: "Person Not Found",
        robots: { index: false, follow: false },
      };
    }

    const person = await tmdb(`/person/${personId}`);

    if (!person?.name) {
      return {
        title: "Person Not Found",
        robots: { index: false, follow: false },
      };
    }

    const name = person.name;
    const pageTitle = `${name} — Biography, Movies & Filmography`;
    const intro =
      `Explore ${name}'s biography, movies, birthday, birthplace ` +
      `and filmography on CINRYVAN.`;

    const fullDescription = person.biography?.trim()
      ? `${intro} ${person.biography.trim()}`
      : intro;

    const description =
      fullDescription.length > 160
        ? `${fullDescription
            .slice(0, 157)
            .replace(/\s+\S*$/, "")}...`
        : fullDescription;

    const canonical =
      `https://cinryvan.vercel.app/person/${personId}`;

    const image = person.profile_path
      ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
      : "https://cinryvan.vercel.app/og-image.png";

    return {
      title: pageTitle,
      description,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${pageTitle} | CINRYVAN`,
        description,
        url: canonical,
        siteName: "CINRYVAN",
        images: [{ url: image, alt: name }],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | CINRYVAN`,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Person Not Found",
      robots: { index: false, follow: false },
    };
  }
}