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
  const cards = items.filter((x) => x.backdrop || x.poster).slice(0, 7);

  if (!cards.length) return null;

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black/40 p-6 shadow-2xl">
      <div className="mb-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black md:text-5xl">{title}</h2>
      </div>

      <div className="mx-auto flex h-[430px] max-w-7xl items-center justify-center gap-3 overflow-hidden">
        {cards.map((item, index) => {
          const isLeft = index < Math.floor(cards.length / 2);
          const origin = isLeft
            ? "origin-left"
            : index > Math.floor(cards.length / 2)
            ? "origin-right"
            : "origin-center";

          return (
            <Link
              key={item.id}
              href={`/${item.media}/${item.id}`}
              className={`group relative h-[380px] w-[120px] shrink-0 overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-2xl transition-all duration-500 hover:w-[420px] hover:border-yellow-400/60 ${origin}`}
            >
              <Image
                src={item.backdrop || item.poster!}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="500px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="line-clamp-2 text-xl font-black">{item.title}</p>
                <p className="mt-1 text-sm text-white/60">
                  {item.media.toUpperCase()} · {item.year || "—"}{" "}
                  {item.rating ? `· ⭐ ${item.rating}` : ""}
                </p>

                <p className="mt-3 hidden max-w-md text-sm text-white/70 group-hover:line-clamp-3 group-hover:block">
                  {item.overview}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}