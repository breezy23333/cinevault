"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type NewsItem = {
  title: string;
  url: string;
  source?: string | null;
  image?: string | null;
};

type LabelledStory = NewsItem & {
  category: "Entertainment" | "Gaming" | "Sports";
  accent: string;
};

export default function HomeNewsCarousels({
  entertainment,
  gaming,
  sports,
}: {
  entertainment: NewsItem[];
  gaming: NewsItem[];
  sports: NewsItem[];
}) {
  const [categoryIndex, setCategoryIndex] =
    useState(0);
  const [storyIndex, setStoryIndex] =
    useState(0);

  const categories = useMemo(
    () => [
      {
        name: "Entertainment",
        eyebrow: "Cinema, television and culture",
        description:
          "Follow movie announcements, television updates, celebrity stories, streaming news and the entertainment industry.",
        href: "/news/entertainment",
        image:
          entertainment.find((item) => item.image)
            ?.image || null,
        accent: "yellow",
        gradient:
          "from-yellow-500/80 via-orange-700/55 to-black",
      },
      {
        name: "Gaming",
        eyebrow: "Games and interactive worlds",
        description:
          "Track console reveals, PC releases, esports, PlayStation, Xbox, Nintendo and major industry updates.",
        href: "/news/gaming",
        image:
          gaming.find((item) => item.image)?.image ||
          null,
        accent: "cyan",
        gradient:
          "from-cyan-500/75 via-blue-800/55 to-black",
      },
      {
        name: "Sports",
        eyebrow: "Competition without limits",
        description:
          "Explore football, racing, cricket, rugby, basketball, tennis and the biggest stories across world sport.",
        href: "/news/sports",
        image:
          sports.find((item) => item.image)?.image ||
          null,
        accent: "green",
        gradient:
          "from-emerald-500/75 via-green-900/55 to-black",
      },
    ],
    [entertainment, gaming, sports],
  );

  const stories = useMemo(() => {
    const mixed: LabelledStory[] = [];

    const maximum = Math.max(
      entertainment.length,
      gaming.length,
      sports.length,
    );

    for (let index = 0; index < maximum; index += 1) {
      const entertainmentStory =
        entertainment[index];

      const gamingStory = gaming[index];
      const sportsStory = sports[index];

      if (entertainmentStory?.title) {
        mixed.push({
          ...entertainmentStory,
          category: "Entertainment",
          accent: "yellow",
        });
      }

      if (gamingStory?.title) {
        mixed.push({
          ...gamingStory,
          category: "Gaming",
          accent: "cyan",
        });
      }

      if (sportsStory?.title) {
        mixed.push({
          ...sportsStory,
          category: "Sports",
          accent: "green",
        });
      }
    }

    const seen = new Set<string>();

    return mixed
      .filter((story) => {
        if (!story.url || seen.has(story.url)) {
          return false;
        }

        seen.add(story.url);
        return true;
      })
      .slice(0, 12);
  }, [entertainment, gaming, sports]);

  const activeCategory =
    categories[categoryIndex] || categories[0];

  const activeStory =
    stories[storyIndex] || stories[0];

  function moveCategory(direction: number) {
    setCategoryIndex((current) => {
      return (
        (current + direction + categories.length) %
        categories.length
      );
    });
  }

  function moveStory(direction: number) {
    if (!stories.length) return;

    setStoryIndex((current) => {
      return (
        (current + direction + stories.length) %
        stories.length
      );
    });
  }

  const categoryAccent =
    activeCategory.accent === "cyan"
      ? "text-cyan-300"
      : activeCategory.accent === "green"
        ? "text-emerald-300"
        : "text-yellow-300";

  const storyAccent =
    activeStory?.accent === "cyan"
      ? "text-cyan-300"
      : activeStory?.accent === "green"
        ? "text-emerald-300"
        : "text-yellow-300";

  return (
    <div className="space-y-10">
      {/* NEWS CATEGORY HERO */}
      <section className="border-b border-white/[0.08] pb-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              News channels
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Explore News Categories
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveCategory(-1)}
              aria-label="Previous news category"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => moveCategory(1)}
              aria-label="Next news category"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1119] sm:min-h-[420px] lg:min-h-[470px]">
          {activeCategory.image && (
            <img
              key={activeCategory.image}
              src={activeCategory.image}
              alt={`${activeCategory.name} news`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-r ${activeCategory.gradient}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />

          <div className="relative z-10 flex min-h-[360px] max-w-3xl flex-col justify-end p-6 sm:min-h-[420px] sm:p-9 lg:min-h-[470px] lg:p-12">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.35em] ${categoryAccent}`}
            >
              {activeCategory.eyebrow}
            </p>

            <h3 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {activeCategory.name}
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              {activeCategory.description}
            </p>

            <Link
              href={activeCategory.href}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-400"
            >
              Explore {activeCategory.name}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setCategoryIndex(index)}
                aria-label={`Show ${category.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === categoryIndex
                    ? "w-10 bg-yellow-400"
                    : "w-4 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TOP NEWS HERO */}
      {activeStory && (
        <section className="border-b border-white/[0.08] pb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                Industry radar
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Top News
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-2 hidden text-[10px] font-black text-white/35 sm:block">
                {String(storyIndex + 1).padStart(
                  2,
                  "0",
                )}{" "}
                /{" "}
                {String(stories.length).padStart(
                  2,
                  "0",
                )}
              </span>

              <button
                type="button"
                onClick={() => moveStory(-1)}
                aria-label="Previous top story"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => moveStory(1)}
                aria-label="Next top story"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <a
            href={activeStory.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1119] transition hover:border-yellow-400/50 lg:grid-cols-[1.35fr_0.85fr]"
          >
            <div className="relative min-h-[290px] overflow-hidden bg-white/5 sm:min-h-[390px] lg:min-h-[470px]">
              {activeStory.image ? (
                <img
                  key={activeStory.image}
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(250,204,21,.25),transparent_35%),radial-gradient(circle_at_75%_70%,rgba(34,211,238,.18),transparent_40%)]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/65 px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] backdrop-blur-md">
                Live report
              </span>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
              <p
                className={`text-[10px] font-black uppercase tracking-[0.35em] ${storyAccent}`}
              >
                {activeStory.category}
              </p>

              <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {activeStory.title}
              </h3>

              {activeStory.source && (
                <p className="mt-5 text-sm font-bold text-white/40">
                  Source: {activeStory.source}
                </p>
              )}

              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-black transition group-hover:bg-white">
                Read full story
                <ArrowUpRight className="h-4 w-4" />
              </span>

              <div className="mt-9 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                  style={{
                    width: `${
                      ((storyIndex + 1) /
                        stories.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </a>
        </section>
      )}
    </div>
  );
}