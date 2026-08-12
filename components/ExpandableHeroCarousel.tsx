"use client";

import Image from "next/image";
import Link from "next/link";

type Item = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

export default function ExpandableHeroCarousel({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Item[];
}) {
  const cards = items
    .filter((item) => item.backdrop || item.poster)
    .slice(0, 6);

  if (!cards.length) return null;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-2xl md:rounded-[36px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_40%)]" />

      <div className="relative px-5 pb-7 pt-8 text-center md:px-8 md:pb-9 md:pt-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
          {title}
        </h2>
      </div>

      {/* Mobile: normal horizontal swipe */}
      <div className="relative flex h-[390px] snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-5 pb-6 md:hidden">
        {cards.map((item) => (
          <Link
            key={`${item.media}-${item.id}`}
            href={`/${item.media}/${item.id}`}
            className="group relative h-[350px] w-[260px] shrink-0 snap-center overflow-hidden rounded-[26px] border border-white/15 bg-white/5"
          >
            <Image
              src={item.backdrop || item.poster!}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="260px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="line-clamp-2 text-2xl font-black text-white">
                {item.title}
              </p>

              <p className="mt-2 text-sm text-white/65">
                {item.media === "tv" ? "TV Series" : "Movie"}
                {item.year ? ` · ${item.year}` : ""}
                {typeof item.rating === "number"
                  ? ` · ★ ${item.rating}`
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: diagonal expanding panels */}
      <div className="relative hidden h-[500px] overflow-hidden md:block">
        <div className="absolute inset-y-0 -left-[4%] -right-[4%] flex items-stretch justify-center">
          {cards.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === cards.length - 1;

            return (
              <Link
                key={`${item.media}-${item.id}`}
                href={`/${item.media}/${item.id}`}
                className={`group relative min-w-0 flex-1 overflow-hidden border-l-2 border-white/25 bg-[#090b11] opacity-70 grayscale-[18%] transition-[flex,filter,opacity] duration-700 ease-out hover:z-30 hover:flex-[4] hover:border-l-yellow-400 hover:opacity-100 hover:grayscale-0 ${
                  isFirst ? "border-l-0" : "-ml-5"
                }`}
                style={{
                  clipPath:
                    "polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
                }}
              >
                <Image
                  src={item.backdrop || item.poster!}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1600px) 40vw, 650px"
                />

                <div className="absolute inset-0 bg-black/20 transition duration-500 group-hover:bg-black/5" />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 translate-y-2 px-7 pb-8 pl-[18%] transition-all duration-500 group-hover:translate-y-0 group-hover:px-12 group-hover:pb-10 group-hover:pl-[16%]">
                  <div className="flex flex-wrap items-center gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      {item.media === "tv"
                        ? "TV Series"
                        : "Movie"}
                    </span>

                    {item.year && (
                      <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        {item.year}
                      </span>
                    )}

                    {typeof item.rating === "number" && (
                      <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
                        ★ {item.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 line-clamp-2 max-w-2xl text-xl font-black leading-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:text-4xl group-hover:leading-[1.05] xl:group-hover:text-6xl">
                    {item.title}
                  </h3>

                  {item.overview && (
                    <p className="mt-4 hidden max-w-xl text-sm leading-6 text-white/75 opacity-0 transition duration-500 group-hover:line-clamp-2 group-hover:opacity-100 lg:block">
                      {item.overview}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#05070d]/70" />
      </div>
    </section>
  );
}