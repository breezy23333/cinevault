"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Radio,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import type { NewsItem } from "@/components/NewsStrip";

export default function SportsNewsHero({
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
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_400px]">
      <article className="group relative min-h-[570px] overflow-hidden rounded-[34px] border border-emerald-400/20 bg-[#0b1510] sm:min-h-[680px]">
        {activeStory.image ? (
          <img
            key={activeStory.image}
            src={activeStory.image}
            alt={activeStory.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(52,211,153,0.3),transparent_30%),linear-gradient(135deg,#10251a,#050807)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-black/25 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#04110b]">
              <Radio className="h-3.5 w-3.5" />
              Live desk
            </span>

            <span className="hidden text-xs font-black uppercase tracking-[0.22em] text-white/55 sm:block">
              CINRYVAN Sports
            </span>
          </div>

          <span className="text-xs font-black text-white/50">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(stories.length).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
          {activeStory.source && (
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
              {activeStory.source}
            </p>
          )}

          <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.01] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {activeStory.title}
          </h2>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={activeStory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-[#04110b] transition hover:bg-emerald-300"
            >
              Read match report
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={previousStory}
              aria-label="Previous sports story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition hover:border-emerald-300 hover:text-emerald-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextStory}
              aria-label="Next sports story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition hover:border-emerald-300 hover:text-emerald-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>

      <aside className="overflow-hidden rounded-[34px] border border-emerald-400/15 bg-[#08100c]">
        <div className="border-b border-white/10 bg-emerald-400 px-6 py-6 text-[#04110b]">
          <Trophy className="h-6 w-6" />

          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] opacity-60">
            Trending now
          </p>

          <h3 className="mt-1 text-3xl font-black tracking-[-0.04em]">
            Top Sports Stories
          </h3>
        </div>

        <div className="divide-y divide-white/10">
          {stories.map((story, index) => {
            const active = activeIndex === index;

            return (
              <button
                key={story.url + index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group grid w-full grid-cols-[40px_1fr] gap-3 px-5 py-4 text-left transition ${
                  active
                    ? "bg-emerald-400/15"
                    : "hover:bg-white/[0.045]"
                }`}
              >
                <span
                  className={`text-xl font-black ${
                    active
                      ? "text-emerald-300"
                      : "text-white/20"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h4
                    className={`line-clamp-2 text-sm font-black leading-snug transition ${
                      active
                        ? "text-white"
                        : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {story.title}
                  </h4>

                  {story.source && (
                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300/65">
                      {story.source}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </section>
  );
}