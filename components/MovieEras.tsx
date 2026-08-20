// components/MovieEras.tsx
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
    <section className="border-b border-white/[0.08] pb-6 sm:pb-8">
      <div className="border-l-2 border-yellow-400/70 pl-3 sm:pl-4">
        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400/75 sm:text-xs sm:tracking-[0.35em]">
          Cinema Through Time
        </p>

        <h2 className="mt-1 text-xl font-black sm:text-3xl md:text-5xl">
          Movie Eras
        </h2>

        <p className="mt-1.5 text-xs text-white/50 sm:mt-3 sm:text-sm md:text-base">
          Explore the greatest movies from every decade.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 sm:mt-6 sm:gap-3 md:mt-8 md:gap-4">
        {eras.map((era) => (
          <Link
            key={era.name}
            href={`/era/${era.year}`}
            className="
              group relative overflow-hidden
              border-l-2 border-white/15
              bg-white/[0.025]
              px-2 py-3
              transition duration-300
              hover:border-yellow-400
              hover:bg-yellow-400
              hover:text-black
              sm:rounded-xl sm:border
              sm:px-4 sm:py-5
              md:rounded-2xl md:p-6
            "
          >
            <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-yellow-400 transition group-hover:scale-x-100 group-hover:bg-black/30" />

            <h3 className="text-sm font-black leading-none sm:text-xl md:text-3xl">
              {era.name}
            </h3>

            <p className="mt-1 hidden text-xs text-white/45 transition group-hover:text-black/65 sm:block md:mt-2 md:text-sm">
              Browse movies
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}