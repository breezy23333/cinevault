"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function TvHeroCarousel({ items }: { items: Item[] }) {
  const shows = items.filter((x) => x.poster || x.backdrop);
  const [active, setActive] = useState(0);

  if (!shows.length) return null;

  const total = shows.length;
  const current = shows[active];

  function move(dir: "left" | "right") {
    setActive((prev) =>
      dir === "left" ? (prev - 1 + total) % total : (prev + 1) % total
    );
  }

  function cardStyle(index: number) {
    const diff = (index - active + total) % total;

    if (diff === 0) return "z-40 scale-110 opacity-100 translate-x-0";
    if (diff === 1) return "z-30 scale-95 opacity-70 translate-x-[180px]";
    if (diff === 2) return "z-20 scale-85 opacity-40 translate-x-[330px]";
    if (diff === total - 1) return "z-30 scale-95 opacity-70 -translate-x-[180px]";
    if (diff === total - 2) return "z-20 scale-85 opacity-40 -translate-x-[330px]";
    return "opacity-0 scale-75 pointer-events-none";
  }

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black/30 px-6 py-12 shadow-2xl">
      <div className="absolute inset-0 opacity-50">
        {current.backdrop && (
          <Image
            src={current.backdrop}
            alt={current.title}
            fill
            className="object-cover blur-md scale-110 opacity-40"
            sizes="100vw"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#05070d]" />

      <div className="relative z-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Series Dimension
        </p>
        <h2 className="mt-2 text-3xl font-black md:text-5xl">
          TV Worlds Carousel
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex h-[380px] max-w-5xl items-center justify-center">
        {shows.map((item, index) => (
          <Link
            key={item.id}
            href={`/tv/${item.id}`}
            className={`absolute h-[320px] w-[230px] overflow-hidden rounded-[30px] border border-white/20 bg-white/10 shadow-2xl transition-all duration-500 ${cardStyle(
              index
            )}`}
          >
            <Image
              src={item.poster || item.backdrop!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="260px"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
              <p className="line-clamp-2 text-lg font-black">{item.title}</p>
              <p className="mt-1 text-sm text-white/60">
                TV · {item.year || "—"} {item.rating ? `· ⭐ ${item.rating}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative z-10 mx-auto mt-4 flex max-w-md items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => move("left")} className="rounded-full p-2 hover:bg-white/10">
          <ChevronLeft size={22} />
        </button>

        <div className="text-center">
          <p className="line-clamp-1 text-sm font-black">{current.title}</p>
          <p className="text-xs text-white/50">
            {active + 1} / {total}
          </p>
        </div>

        <button onClick={() => move("right")} className="rounded-full p-2 hover:bg-white/10">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}