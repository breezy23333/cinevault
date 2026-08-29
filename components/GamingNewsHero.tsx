"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";
import type { NewsItem } from "@/components/NewsStrip";

export default function GamingNewsHero({
  items,
}: {
  items: NewsItem[];
}) {
  const stories = items
    .filter((item) => item?.title && item?.url)
    .slice(0, 7);

  const [activeIndex, setActiveIndex] = useState(0);

  if (!stories.length) return null;

  const activeStory = stories[activeIndex];

  function previousStory() {
    setActiveIndex((current) =>
      current === 0 ? stories.length - 1 : current - 1,
    );
  }

  function nextStory() {
    setActiveIndex((current) =>
      current === stories.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section className="overflow-hidden rounded-[34px] border border-cyan-400/15 bg-[#071017] shadow-[0_0_90px_rgba(34,211,238,0.07)]">
      <article className="group relative min-h-[570px] overflow-hidden sm:min-h-[680px]">
        {activeStory.image ? (
          <img
            key={activeStory.image}
            src={activeStory.image}
            alt={activeStory.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(34,211,238,0.3),transparent_30%),linear-gradient(135deg,#071a24,#030609)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-8">
          <span className="flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
            <Gamepad2 className="h-4 w-4" />
            Featured drop
          </span>

          <span className="hidden rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-md sm:block">
            Gaming
          </span>
        </div>

        <div className="absolute right-5 top-5 flex gap-2 sm:right-8 sm:top-8">
          <button
            type="button"
            onClick={previousStory}
            aria-label="Previous gaming story"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={nextStory}
            aria-label="Next gaming story"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 pb-8 sm:p-10 lg:max-w-[1050px] lg:p-14">
          {activeStory.source && (
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              {activeStory.source}
            </p>
          )}

          <h2 className="mt-4 text-4xl font-black leading-[1.01] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {activeStory.title}
          </h2>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <a
              href={activeStory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-[#031014] transition hover:bg-cyan-300"
            >
              Open story
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(stories.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </article>

      <div className="border-t border-white/10 bg-black/40 p-3 sm:p-4">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-color:rgba(34,211,238,0.4)_transparent] [scrollbar-width:thin]">
          {stories.map((story, index) => {
            const active = activeIndex === index;

            return (
              <button
                key={story.url + index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`grid min-w-[270px] grid-cols-[88px_1fr] gap-3 rounded-[18px] border p-2.5 text-left transition sm:min-w-[310px] ${
                  active
                    ? "border-cyan-300/70 bg-cyan-400/15"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <div className="h-[68px] overflow-hidden rounded-xl bg-white/10">
                  {story.image ? (
                    <img
                      src={story.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-cyan-400/30 to-black" />
                  )}
                </div>

                <div className="self-center">
                  <p
                    className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                      active ? "text-cyan-300" : "text-white/30"
                    }`}
                  >
                    Update {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white">
                    {story.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}