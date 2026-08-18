"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { NewsItem } from "@/components/NewsStrip";

type AccentColor = "yellow" | "green" | "cyan";

type NewsCategoryGridProps = {
  title: string;
  eyebrow: string;
  items: NewsItem[];
  color?: AccentColor;
};

const accentStyles: Record<
  AccentColor,
  {
    text: string;
    border: string;
    glow: string;
    fallback: string;
  }
> = {
  yellow: {
    text: "text-yellow-400 group-hover:text-yellow-300",
    border: "hover:border-yellow-400/50",
    glow: "from-yellow-400/20",
    fallback: "from-yellow-400/15 via-[#171a21] to-[#080b12]",
  },
  green: {
    text: "text-green-400 group-hover:text-green-300",
    border: "hover:border-green-400/50",
    glow: "from-green-400/20",
    fallback: "from-green-400/15 via-[#171a21] to-[#080b12]",
  },
  cyan: {
    text: "text-cyan-400 group-hover:text-cyan-300",
    border: "hover:border-cyan-400/50",
    glow: "from-cyan-400/20",
    fallback: "from-cyan-400/15 via-[#171a21] to-[#080b12]",
  },
};

export default function NewsCategoryGrid({
  title,
  eyebrow,
  items,
  color = "yellow",
}: NewsCategoryGridProps) {
  if (!items.length) return null;

  const accent = accentStyles[color];

  return (
    <section className="mt-20">
      <p
        className={`text-xs font-black uppercase tracking-[0.35em] ${accent.text}`}
      >
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-black text-white">
        {title}
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <a
            key={`${item.url}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#11151d] shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 ${accent.border}`}
          >
            <NewsImage
              image={item.image}
              title={item.title}
              source={item.source}
              eyebrow={eyebrow}
              fallbackClass={accent.fallback}
              glowClass={accent.glow}
            />

            <div className="p-5">
              <p
                className={`text-xs font-black uppercase tracking-[0.25em] ${accent.text}`}
              >
                {eyebrow}
              </p>

              <h3 className="mt-3 line-clamp-3 text-xl font-black leading-tight text-white transition group-hover:text-inherit">
                {item.title}
              </h3>

              {item.source && (
                <p className="mt-4 text-sm font-semibold text-white/40">
                  {item.source}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(
            title,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          View more {title} →
        </a>
      </div>
    </section>
  );
}

function NewsImage({
  image,
  title,
  source,
  eyebrow,
  fallbackClass,
  glowClass,
}: {
  image?: string | null;
  title: string;
  source?: string;
  eyebrow: string;
  fallbackClass: string;
  glowClass: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  return (
    <div className="relative h-64 overflow-hidden bg-[#171a21]">
      {showImage ? (
        <>
          <img
            src={image!}
            alt={title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#11151d] via-transparent to-black/10" />
        </>
      ) : (
        <div
          className={`relative flex h-full flex-col justify-end overflow-hidden bg-gradient-to-br ${fallbackClass} p-6`}
        >
          <div
            className={`absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br ${glowClass} to-transparent blur-3xl`}
          />

          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
              {source || eyebrow}
            </p>

            <p className="mt-2 line-clamp-3 text-xl font-black leading-tight text-white/80">
              {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}