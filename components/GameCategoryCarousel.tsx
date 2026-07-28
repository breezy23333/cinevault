"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type GameCategory = {
  label: string;
  href: string;
  image?: string | null;
};

type GameCategoryCarouselProps = {
  categories: GameCategory[];
};

const categoryTints = [
  "bg-gradient-to-br from-red-500/20 via-red-700/55 to-black/80",
  "bg-gradient-to-br from-purple-500/20 via-purple-700/55 to-black/80",
  "bg-gradient-to-br from-green-400/20 via-green-700/55 to-black/80",
  "bg-gradient-to-br from-blue-400/20 via-blue-700/55 to-black/80",
  "bg-gradient-to-br from-orange-400/20 via-orange-700/55 to-black/80",
];

export default function GameCategoryCarousel({
  categories,
}: GameCategoryCarouselProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  function getPageMetrics(shelf: HTMLDivElement) {
    const firstCard = shelf.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(shelf);
    const gap = Number.parseFloat(styles.columnGap || "16") || 16;

    const cardWidth =
      firstCard?.getBoundingClientRect().width || shelf.clientWidth;

    const cardsPerPage = Math.max(
      1,
      Math.floor(
        (shelf.clientWidth + gap) / (cardWidth + gap),
      ),
    );

    return {
      pages: Math.max(
        1,
        Math.ceil(categories.length / cardsPerPage),
      ),
      distance: (cardWidth + gap) * cardsPerPage,
    };
  }

  function updateScrollState() {
    const shelf = shelfRef.current;

    if (!shelf) return;

    const maxScrollLeft = shelf.scrollWidth - shelf.clientWidth;
    const { pages, distance } = getPageMetrics(shelf);

    setCanScrollLeft(shelf.scrollLeft > 8);
    setCanScrollRight(shelf.scrollLeft < maxScrollLeft - 8);
    setPageCount(pages);

    setActivePage(
      Math.min(
        pages - 1,
        Math.round(shelf.scrollLeft / distance),
      ),
    );
  }

  useEffect(() => {
    const shelf = shelfRef.current;

    if (!shelf) return;

    updateScrollState();

    shelf.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(shelf);

    return () => {
      shelf.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [categories.length]);

  function scrollCategories(direction: "left" | "right") {
    const shelf = shelfRef.current;

    if (!shelf) return;

    const { distance } = getPageMetrics(shelf);

    shelf.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  function goToPage(page: number) {
    const shelf = shelfRef.current;

    if (!shelf) return;

    const { distance } = getPageMetrics(shelf);

    shelf.scrollTo({
      left: distance * page,
      behavior: "smooth",
    });
  }

  if (!categories.length) return null;

  return (
    <section className="py-10">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          Find your next game
        </p>

        <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
          Browse by Category
        </h2>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            aria-label="Scroll categories left"
            className="absolute left-2 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-black/90 text-4xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black md:-left-5"
          >
            ‹
          </button>
        )}

        <div
          ref={shelfRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category, index) => (
            <Link
              key={`${category.label}-${category.href}`}
              href={category.href}
              prefetch={false}
              className="group relative aspect-[1.55/1] w-[230px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#151c29] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-yellow-400/70 sm:w-[250px] lg:w-[calc((100%_-_4rem)/5)]"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={`${category.label} games`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              )}

              <div
                className={`absolute inset-0 ${
                  categoryTints[index % categoryTints.length]
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

              <div className="relative z-10 grid h-full place-items-center p-5">
                <span className="rounded-lg bg-white px-4 py-2 text-center text-xs font-black uppercase tracking-[0.12em] text-black shadow-xl transition group-hover:scale-105 group-hover:bg-yellow-400 sm:text-sm">
                  {category.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollCategories("right")}
            aria-label="Scroll categories right"
            className="absolute right-2 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-black/90 text-4xl text-white ring-1 ring-white/20 transition hover:bg-yellow-400 hover:text-black md:-right-5"
          >
            ›
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-label={`Go to category page ${page + 1}`}
              className={`h-2.5 rounded-full transition ${
                page === activePage
                  ? "w-8 bg-yellow-400"
                  : "w-2.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}