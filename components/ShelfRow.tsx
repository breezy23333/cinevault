// components/ShelfRow.tsx
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShelfCard, {
  type ShelfMedia,
} from "./ShelfCard";

type Item = ShelfMedia & {
  href: string;
};

export default function ShelfRow({
  items,
}: {
  items: Item[];
}) {
  const shelfRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);
  const [progress, setProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const shelf = shelfRef.current;

    if (!shelf) return;

    const maximumScroll =
      shelf.scrollWidth - shelf.clientWidth;

    setCanScrollLeft(shelf.scrollLeft > 4);

    setCanScrollRight(
      shelf.scrollLeft < maximumScroll - 4,
    );

    setProgress(
      maximumScroll > 0
        ? Math.min(
            1,
            Math.max(
              0,
              shelf.scrollLeft / maximumScroll,
            ),
          )
        : 0,
    );
  }, []);

  useEffect(() => {
    const shelf = shelfRef.current;

    if (!shelf) return;

    updateScrollState();

    const resizeObserver =
      new ResizeObserver(updateScrollState);

    resizeObserver.observe(shelf);

    Array.from(shelf.children).forEach(
      (child) => {
        resizeObserver.observe(child);
      },
    );

    shelf.addEventListener(
      "scroll",
      updateScrollState,
      {
        passive: true,
      },
    );

    return () => {
      resizeObserver.disconnect();

      shelf.removeEventListener(
        "scroll",
        updateScrollState,
      );
    };
  }, [items.length, updateScrollState]);

  function scrollShelf(
    direction: "left" | "right",
  ) {
    const shelf = shelfRef.current;

    if (!shelf) return;

    shelf.scrollBy({
      left:
        shelf.clientWidth *
        0.78 *
        (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  }

  function keepExpandedCardVisible(
    card: HTMLAnchorElement,
  ) {
    window.setTimeout(() => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }, 220);
  }

  if (!items.length) return null;

  return (
    <div className="relative min-w-0 max-w-full">
      {/* Controls above the cards */}
      <div className="mb-3 flex items-center justify-end gap-2">
        <span className="mr-2 hidden text-[9px] font-black uppercase tracking-[0.25em] text-white/25 sm:block">
          Explore the row
        </span>

        <button
          type="button"
          aria-label="Scroll shelf left"
          onClick={() => scrollShelf("left")}
          disabled={!canScrollLeft}
          className="
            grid h-9 w-9 place-items-center
            rounded-full border border-white/15
            bg-white/[0.04] text-white
            transition duration-150
            hover:border-yellow-400
            hover:bg-yellow-400
            hover:text-black
            disabled:cursor-not-allowed
            disabled:opacity-25
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Scroll shelf right"
          onClick={() => scrollShelf("right")}
          disabled={!canScrollRight}
          className="
            grid h-9 w-9 place-items-center
            rounded-full border border-white/15
            bg-white/[0.04] text-white
            transition duration-150
            hover:border-yellow-400
            hover:bg-yellow-400
            hover:text-black
            disabled:cursor-not-allowed
            disabled:opacity-25
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={shelfRef}
        onTransitionEndCapture={updateScrollState}
        className="
          hide-scrollbar
          flex w-full min-w-0
          snap-x snap-proximity
          gap-2 overflow-x-auto
          overflow-y-hidden
          px-0.5 pb-2
          overscroll-x-contain
          scroll-smooth
          sm:gap-3
          md:gap-4
        "
      >
        {items.map((item) => (
          <ShelfCard
            key={`${item.media}-${item.id}`}
            item={item}
            href={item.href}
            onExpand={keepExpandedCardVisible}
          />
        ))}
      </div>

      {/* Custom progress scrollbar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="
              absolute inset-y-0 w-[26%]
              rounded-full
              bg-gradient-to-r
              from-yellow-500
              via-yellow-300
              to-amber-500
              shadow-[0_0_14px_rgba(250,204,21,0.35)]
              transition-[left] duration-200
            "
            style={{
              left: `${progress * 74}%`,
            }}
          />
        </div>

        <span className="min-w-[34px] text-right text-[9px] font-black text-white/30">
          {String(
            Math.round(progress * 100),
          ).padStart(2, "0")}
          %
        </span>
      </div>
    </div>
  );
}