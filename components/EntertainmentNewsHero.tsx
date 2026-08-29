"use client";

/* eslint-disable @next/next/no-img-element */

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { NewsItem } from "@/components/NewsStrip";

type Props = {
  items: NewsItem[];
};

export default function EntertainmentNewsHero({ items }: Props) {
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
    <section className="relative">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <article className="group relative min-h-[560px] overflow-hidden rounded-[34px] border border-white/10 bg-[#12151b] sm:min-h-[650px]">
          {activeStory.image ? (
            <img
              key={activeStory.image}
              src={activeStory.image}
              alt={activeStory.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(250,204,21,0.32),transparent_32%),linear-gradient(135deg,#25200f,#08090d)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-8">
            <span className="rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black">
              Featured story
            </span>

            <span className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
              Entertainment
            </span>
          </div>

          <div className="absolute right-5 top-5 flex gap-2 sm:right-8 sm:top-8">
            <button
              type="button"
              onClick={previousStory}
              aria-label="Previous entertainment story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextStory}
              aria-label="Next entertainment story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12">
            {activeStory.source && (
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                {activeStory.source}
              </p>
            )}

            <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {activeStory.title}
            </h2>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={activeStory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Read full story
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <div className="flex items-center gap-2">
                {stories.map((story, index) => (
                  <button
                    key={story.url + index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Open story ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-8 bg-yellow-400"
                        : "w-2.5 bg-white/35 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="overflow-hidden rounded-[34px] border border-white/10 bg-[#0c0f14] p-4 sm:p-5">
          <div className="flex items-end justify-between border-b border-white/10 px-2 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Top stories
              </p>

              <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                On the radar
              </h3>
            </div>

            <span className="text-sm font-black text-white/30">
              {String(activeIndex + 1).padStart(2, "0")} /
              {String(stories.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {stories.map((story, index) => {
              const active = index === activeIndex;

              return (
                <button
                  key={story.url + index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`grid w-full grid-cols-[92px_1fr] gap-4 rounded-[20px] p-3 text-left transition ${
                    active
                      ? "bg-yellow-400 text-black"
                      : "bg-white/[0.025] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="h-[76px] overflow-hidden rounded-[14px] bg-white/10">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-yellow-400/30 to-black" />
                    )}
                  </div>

                  <div className="self-center">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                        active ? "text-black/55" : "text-yellow-400"
                      }`}
                    >
                      Story {String(index + 1).padStart(2, "0")}
                    </p>

                    <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug">
                      {story.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}