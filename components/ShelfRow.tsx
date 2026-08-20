// components/ShelfRow.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShelfCard, { type ShelfMedia } from "./ShelfCard";

type Item = ShelfMedia & {
  href: string;
};

export default function ShelfRow({ items }: { items: Item[] }) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    setCanScrollLeft(shelf.scrollLeft > 4);
    setCanScrollRight(
      shelf.scrollLeft + shelf.clientWidth < shelf.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);

    resizeObserver.observe(shelf);
    shelf.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    return () => {
      resizeObserver.disconnect();
      shelf.removeEventListener("scroll", updateScrollState);
    };
  }, [items.length, updateScrollState]);

  function scrollShelf(direction: "left" | "right") {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const distance =
      shelf.clientWidth * 0.78 * (direction === "left" ? -1 : 1);

    shelf.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <div className="group/shelf relative min-w-0 max-w-full">
      <div
        ref={shelfRef}
        className="
          hide-scrollbar
          flex w-full min-w-0 snap-x snap-proximity
          gap-2 overflow-x-auto overflow-y-hidden
          px-0.5 pb-1.5
          overscroll-x-contain
          scroll-smooth
          sm:gap-3 sm:pb-2
          md:gap-4
        "
      >
        {items.map((item) => (
          <ShelfCard
            key={`${item.media}-${item.id}`}
            item={item}
            href={item.href}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll shelf left"
        onClick={() => scrollShelf("left")}
        disabled={!canScrollLeft}
        className="
          absolute left-1 top-1/2 z-20 hidden
          h-10 w-10 -translate-y-1/2
          items-center justify-center rounded-full
          border border-white/15 bg-black/75
          text-white shadow-xl backdrop-blur-md
          transition
          hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black
          disabled:pointer-events-none disabled:opacity-0
          md:flex
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Scroll shelf right"
        onClick={() => scrollShelf("right")}
        disabled={!canScrollRight}
        className="
          absolute right-1 top-1/2 z-20 hidden
          h-10 w-10 -translate-y-1/2
          items-center justify-center rounded-full
          border border-white/15 bg-black/75
          text-white shadow-xl backdrop-blur-md
          transition
          hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black
          disabled:pointer-events-none disabled:opacity-0
          md:flex
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
