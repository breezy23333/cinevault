"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ShelfCard, { type ShelfMedia } from "./ShelfCard";

type Item = ShelfMedia & {
  href: string;
};

export default function ShelfRow({ items }: { items: Item[] }) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(26);

  const updateScrollState = useCallback(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const maximumScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
    const visibleRatio = shelf.scrollWidth > 0 ? shelf.clientWidth / shelf.scrollWidth : 1;

    setProgress(
      maximumScroll > 0
        ? Math.min(1, Math.max(0, shelf.scrollLeft / maximumScroll))
        : 0,
    );
    setThumbWidth(Math.min(100, Math.max(12, visibleRatio * 100)));
  }, []);

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(shelf);
    Array.from(shelf.children).forEach((child) => resizeObserver.observe(child));

    shelf.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      shelf.removeEventListener("scroll", updateScrollState);
    };
  }, [items.length, updateScrollState]);

  const setScrollFromPointer = useCallback((clientX: number) => {
    const shelf = shelfRef.current;
    const track = trackRef.current;
    if (!shelf || !track) return;

    const bounds = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width));
    const maximumScroll = shelf.scrollWidth - shelf.clientWidth;

    shelf.scrollLeft = maximumScroll * ratio;
  }, []);

  function keepExpandedCardVisible(card: HTMLAnchorElement) {
    window.setTimeout(() => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }, 220);
  }

  if (!items.length) return null;

  const thumbTravel = 100 - thumbWidth;

  return (
    <div className="relative min-w-0 max-w-full">
      <div
        ref={shelfRef}
        onTransitionEndCapture={updateScrollState}
        className="hide-scrollbar flex w-full min-w-0 snap-x snap-proximity gap-2 overflow-x-auto overflow-y-hidden px-0.5 pb-2 overscroll-x-contain scroll-smooth sm:gap-3 md:gap-4"
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

      <div className="mt-4 flex items-center gap-3">
        <div
          ref={trackRef}
          role="scrollbar"
          tabIndex={0}
          aria-label="Scroll through titles"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setScrollFromPointer(event.clientX);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            setScrollFromPointer(event.clientX);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onKeyDown={(event) => {
            const shelf = shelfRef.current;
            if (!shelf) return;

            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              shelf.scrollBy({
                left: shelf.clientWidth * 0.35 * (event.key === "ArrowLeft" ? -1 : 1),
                behavior: "smooth",
              });
            }

            if (event.key === "Home") {
              event.preventDefault();
              shelf.scrollTo({ left: 0, behavior: "smooth" });
            }

            if (event.key === "End") {
              event.preventDefault();
              shelf.scrollTo({ left: shelf.scrollWidth, behavior: "smooth" });
            }
          }}
          className="group relative h-3 flex-1 cursor-ew-resize touch-none rounded-full bg-white/[0.07] outline-none transition focus-visible:ring-2 focus-visible:ring-yellow-400/70"
        >
          <div
            className="absolute inset-y-[3px] rounded-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-amber-500 shadow-[0_0_14px_rgba(250,204,21,0.35)] transition-[left] duration-75 group-hover:inset-y-[2px]"
            style={{
              width: `${thumbWidth}%`,
              left: `${progress * thumbTravel}%`,
            }}
          />
        </div>

        <span className="min-w-[34px] text-right text-[9px] font-black text-white/30">
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </span>
      </div>
    </div>
  );
}
