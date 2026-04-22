import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type PageProps = { params: { id: string } };

const TMDB_BASE = "https://api.themoviedb.org/3";

function authHeaders() {
  const bearer = process.env.TMDB_BEARER || process.env.TMDB_READ || process.env.TMDB_TOKEN;
  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

function withKey(url: string) {
  const key = process.env.TMDB_API_KEY;
  return key ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}` : url;
}

async function getTV(id: string) {
  const url = withKey(`${TMDB_BASE}/tv/${id}?language=en-US`);
  const res = await fetch(url, { headers: authHeaders(), next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json() as Promise<any>;
}

export default async function TvPage({ params }: PageProps) {
  const data = await getTV(params.id);
  if (!data) notFound();

  const name = data.name || data.original_name || "Untitled";
  const year = (data.first_air_date || "").slice(0, 4);
  const overview = data.overview || "No overview yet.";
  const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null;
  const backdrop = data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null;
  const meta = [
    data.number_of_seasons ? `${data.number_of_seasons} season(s)` : "",
    data.number_of_episodes ? `${data.number_of_episodes} episodes` : "",
  ].filter(Boolean).join(" • ");

  return (
    <main className="pb-16">
      <section className="relative">
        {backdrop && (
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={backdrop} className="h-[46vh] w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
          </div>
        )}

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pt-10 md:grid-cols-[200px,1fr] md:pt-16">
          {poster ? (
            <div className="relative aspect-[2/3] w-[200px] overflow-hidden rounded-xl border border-white/10">
              <Image alt={name} src={poster} fill sizes="200px" className="object-cover" />
            </div>
          ) : (
            <div className="grid aspect-[2/3] w-[200px] place-items-center rounded-xl border border-white/10 bg-zinc-900/50 text-zinc-400">
              No poster
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-zinc-50 md:text-3xl">
              {name} {year && <span className="text-zinc-400">({year})</span>}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{meta}</p>
            <p className="about-reveal mt-4 max-w-3xl leading-relaxed text-zinc-200">{overview}</p>

            <div className="mt-5 flex gap-2">
              <Link
                href="/browse"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
