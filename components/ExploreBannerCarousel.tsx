"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export type ExploreBannerSlide = {
  title: string;
  description: string;
  href: string;
  image?: string | null;
  eyebrow: string;
};

export default function ExploreBannerCarousel({
  slides,
}: {
  slides: ExploreBannerSlide[];
}) {
  const validSlides = slides.filter(
    (slide) => slide.title && slide.href,
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  if (!validSlides.length) return null;

  const activeSlide =
    validSlides[
      Math.min(
        activeIndex,
        validSlides.length - 1,
      )
    ];

  function move(direction: number) {
    setActiveIndex((current) => {
      return (
        (current +
          direction +
          validSlides.length) %
        validSlides.length
      );
    });
  }

  return (
    <section className="border-t border-white/[0.08] pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            Continue exploring
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Choose your next world
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous destination"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next destination"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative h-[230px] overflow-hidden rounded-[26px] border border-white/10 bg-[#0c1119] sm:h-[280px] lg:h-[320px]">
        {activeSlide.image && (
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_40%,rgba(250,204,21,.14),transparent_28%)]" />

        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end p-5 sm:p-8 lg:p-10">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-yellow-400 sm:text-[10px]">
            {activeSlide.eyebrow}
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h3>

          <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
            {activeSlide.description}
          </p>

          <Link
            href={activeSlide.href}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-yellow-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-white sm:px-5 sm:py-3 sm:text-sm"
          >
            Explore now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[9px] font-black text-white/65 backdrop-blur-md">
          {String(activeIndex + 1).padStart(
            2,
            "0",
          )}{" "}
          /{" "}
          {String(validSlides.length).padStart(
            2,
            "0",
          )}
        </div>
      </div>

      {/* Six compact slide selectors */}
      <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {validSlides.map((slide, index) => (
          <button
            key={`${slide.href}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`
              relative min-w-[145px] flex-1 overflow-hidden
              rounded-xl border px-3 py-3 text-left
              transition duration-150
              ${
                index === activeIndex
                  ? "border-yellow-400 bg-yellow-400 text-black"
                  : "border-white/10 bg-white/[0.035] text-white hover:border-white/30"
              }
            `}
          >
            <span
              className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                index === activeIndex
                  ? "text-black/50"
                  : "text-white/30"
              }`}
            >
              {String(index + 1).padStart(
                2,
                "0",
              )}
            </span>

            <span className="mt-1 block line-clamp-1 text-xs font-black sm:text-sm">
              {slide.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}