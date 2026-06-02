"use client";

import Link from "next/link";

const eras = [
  { name: "2020s", year: 2020 },
  { name: "2010s", year: 2010 },
  { name: "2000s", year: 2000 },
  { name: "1990s", year: 1990 },
  { name: "1980s", year: 1980 },
  { name: "1970s", year: 1970 },
  { name: "1960s", year: 1960 },
  { name: "1950s", year: 1950 },
];

export default function MovieEras() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-8">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        Cinema Through Time
      </p>

      <h2 className="mt-2 text-3xl font-black md:text-5xl">
        Movie Eras
      </h2>

      <p className="mt-3 max-w-3xl text-white/60">
        Explore the greatest movies from every decade.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {eras.map((era) => (
          <Link
            key={era.name}
            href={`/era/${era.year}`}
            className="group rounded-3xl border border-white/10 bg-black/30 p-6 transition hover:border-yellow-400/60 hover:bg-white/10"
          >
            <h3 className="text-3xl font-black">
              {era.name}
            </h3>

            <p className="mt-2 text-white/50">
              Browse movies
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}