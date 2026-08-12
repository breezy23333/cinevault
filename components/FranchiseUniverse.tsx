"use client";

import CineImage from "@/components/CineImage";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Franchise = {
  name: string;
  image: string | null;
};

export default function FranchiseUniverse() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    async function loadFranchises() {
      try {
        const response = await fetch("/api/franchises");

        if (!response.ok) {
          throw new Error("Unable to load franchises");
        }

        const data = await response.json();

        setFranchises(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load franchises:", error);
        setFranchises([]);
      }
    }

    loadFranchises();
  }, []);

  useEffect(() => {
    if (
      franchises.length > 0 &&
      currentIndex >= franchises.length
    ) {
      setCurrentIndex(0);
    }
  }, [currentIndex, franchises.length]);

  function showNext() {
    if (!franchises.length) return;

    setCurrentIndex(
      (previous) => (previous + 1) % franchises.length,
    );
  }

  function showPrevious() {
    if (!franchises.length) return;

    setCurrentIndex(
      (previous) =>
        (previous - 1 + franchises.length) %
        franchises.length,
    );
  }

  function handleTouchEnd() {
    if (touchStart === null || touchEnd === null) {
      return;
    }

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      showNext();
    } else if (distance < -50) {
      showPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }

  const visibleFranchises = useMemo(() => {
    if (!franchises.length) {
      return [];
    }

    const positions = [-2, -1, 0, 1, 2];

    return positions.map((position) => {
      const index =
        (currentIndex + position + franchises.length) %
        franchises.length;

      return {
        franchise: franchises[index],
        index,
        position,
      };
    });
  }, [currentIndex, franchises]);

  const activeFranchise = franchises[currentIndex];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] px-4 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_42%)]" />

      <div className="relative mx-auto mb-8 max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Cinematic Universes
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
          Legendary Franchises
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
          Explore iconic sagas, superheroes, fantasy worlds,
          animation universes and horror collections.
        </p>
      </div>

      {franchises.length > 0 ? (
        <>
          <div
            className="relative mx-auto h-[330px] max-w-6xl touch-pan-y overflow-hidden md:h-[440px]"
            onTouchStart={(event) => {
              const position =
                event.targetTouches[0].clientX;

              setTouchStart(position);
              setTouchEnd(position);
            }}
            onTouchMove={(event) => {
              setTouchEnd(
                event.targetTouches[0].clientX,
              );
            }}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {visibleFranchises.map(
                ({ franchise, index, position }) => {
                  const isActive = position === 0;
                  const isNear = Math.abs(position) === 1;

                  const translateX =
                    position === -2
                      ? "-92%"
                      : position === -1
                        ? "-52%"
                        : position === 1
                          ? "52%"
                          : position === 2
                            ? "92%"
                            : "0%";

                  const scale = isActive
                    ? 1
                    : isNear
                      ? 0.82
                      : 0.66;

                  const opacity = isActive
                    ? 1
                    : isNear
                      ? 0.82
                      : 0.42;

                  return (
                    <button
                      key={`${franchise.name}-${position}`}
                      type="button"
                      aria-label={`Show ${franchise.name}`}
                      onClick={() => setCurrentIndex(index)}
                      className="absolute left-1/2 top-1/2 h-[250px] w-[190px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-white/15 bg-[#0b0d13] shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out md:h-[350px] md:w-[270px]"
                      style={{
                        transform: `translate(-50%, -50%) translateX(${translateX}) scale(${scale})`,
                        opacity,
                        zIndex: 10 - Math.abs(position),
                      }}
                    >
                      <CineImage
                        src={franchise.image}
                        alt={franchise.name}
                        fallback="No franchise image"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                      <div
                        className={`absolute inset-x-0 bottom-0 p-5 text-left transition-opacity duration-300 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-400">
                          Franchise
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-xl font-black text-white md:text-2xl">
                          {franchise.name}
                        </h3>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="relative mt-1 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous franchise"
              onClick={showPrevious}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {activeFranchise && (
              <Link
                href={`/search?q=${encodeURIComponent(
                  activeFranchise.name,
                )}`}
                className="min-w-[180px] rounded-full bg-yellow-400 px-6 py-3 text-center text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Explore {activeFranchise.name}
              </Link>
            )}

            <button
              type="button"
              aria-label="Next franchise"
              onClick={showNext}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-6 flex justify-center gap-2">
            {franchises.map((franchise, index) => (
              <button
                key={franchise.name}
                type="button"
                aria-label={`Show ${franchise.name}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-9 bg-yellow-400"
                    : "w-3 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="relative flex h-72 items-center justify-center text-sm text-white/45">
          Loading franchises...
        </div>
      )}
    </section>
  );
}