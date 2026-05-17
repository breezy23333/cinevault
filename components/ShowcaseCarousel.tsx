"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShelfMedia } from "./ShelfCard";

type Item = ShelfMedia & { href: string };

export default function ShowcaseCarousel({ items }: { items: Item[] }) {
  const cleanItems = useMemo(() => items.filter((x) => x.poster), [items]);
  const [active, setActive] = useState(0);

  if (!cleanItems.length) return null;

  const total = cleanItems.length;

  function move(dir: "left" | "right") {
    setActive((prev) =>
      dir === "left" ? (prev - 1 + total) % total : (prev + 1) % total
    );
  }

  function position(index: number) {
    const diff = (index - active + total) % total;

    if (diff === 0) return "z-30 scale-110 opacity-100 translate-x-0";
    if (diff === 1) return "z-20 scale-95 opacity-70 translate-x-[170px]";
    if (diff === 2) return "z-10 scale-85 opacity-35 translate-x-[310px]";
    if (diff === total - 1) return "z-20 scale-95 opacity-70 -translate-x-[170px]";
    if (diff === total - 2) return "z-10 scale-85 opacity-35 -translate-x-[310px]";
    return "opacity-0 pointer-events-none scale-75";
  }

  const current = cleanItems[active];

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-black/30 p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.16),transparent_45%)]" />

      <div className="relative mx-auto flex h-[330px] max-w-5xl items-center justify-center">
        {cleanItems.map((item, index) => (
          <Link
            key={`${item.media}-${item.id}`}
            href={item.href}
            className={`absolute h-[300px] w-[215px] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-2xl transition-all duration-500 ${position(
              index
            )}`}
          >
            <Image
              src={item.poster!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4">
              <p className="line-clamp-1 text-lg font-black">{item.title}</p>
              <p className="text-sm text-white/60">
                {item.media.toUpperCase()} · {item.year || "—"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative mx-auto mt-3 flex max-w-md items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => move("left")} className="rounded-full p-2 hover:bg-white/10">
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <p className="line-clamp-1 text-sm font-black">{current.title}</p>
          <p className="text-xs text-white/50">
            {active + 1} / {total}
          </p>
        </div>

        <button onClick={() => move("right")} className="rounded-full p-2 hover:bg-white/10">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}