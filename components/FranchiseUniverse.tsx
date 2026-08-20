"use client";

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
  const [activeIndex, setActiveIndex] = useState(0);
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
      }
    }

    loadFranchises();
  }, []);

  function showNext() {
    if (!franchises.length) return;

    setActiveIndex(
      (previous) => (previous + 1) % franchises.length,
    );
  }

  function showPrevious() {
    if (!franchises.length) return;

    setActiveIndex(
      (previous) =>
        (previous - 1 + franchises.length) %
        franchises.length,
    );
  }

  function handleTouchEnd() {
    if (touchStart === null || touchEnd === null) return;

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
    if (!franchises.length) return [];

    /*
     * Five stable positions:
     * far left, left, active, right, far right
     */
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index =
        (activeIndex + offset + franchises.length) %
        franchises.length;

      return {
        franchise: franchises[index],
        index,
        offset,
      };
    });
  }, [activeIndex, franchises]);

  const activeFranchise = franchises[activeIndex];

  return (
    <section className="relative border-b border-white/[0.08] pb-6 sm:pb-8">
      {/* Heading */}
      <div className="mb-4 border-l-2 border-yellow-400/70 pl-3 sm:mb-6 sm:pl-4">
        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400/75 sm:text-xs sm:tracking-[0.35em]">
          Cinematic Universes
        </p>

        <h2 className="mt-1 text-xl font-black text-white sm:text-3xl md:text-5xl">
          Legendary Franchises
        </h2>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/50 sm:text-sm md:text-base">
          Explore movie sagas, superheroes, fantasy realms,
          animation universes and horror collections.
        </p>
      </div>

      {franchises.length > 0 ? (
        <>
          <div
            className="
              relative mx-auto flex min-h-[220px]
              max-w-6xl touch-pan-y items-center
              justify-center overflow-hidden
              py-2
              sm:min-h-[280px] sm:py-4
              md:min-h-[350px]
            "
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
            <div className="flex w-max items-center justify-center">
              {visibleFranchises.map(
                ({ franchise, index, offset }) => {
                  const isActive = offset === 0;
                  const isNear = Math.abs(offset) === 1;
                  const isFar = Math.abs(offset) === 2;

                  return (
                    <button
                      key={`${franchise.name}-${offset}`}
                      type="button"
                      aria-label={`Show ${franchise.name}`}
                      onClick={() => setActiveIndex(index)}
                      className={`
                        group relative shrink-0 overflow-hidden
                        border bg-[#090c12] text-left
                        shadow-[0_15px_45px_rgba(0,0,0,0.4)]
                        transition-all duration-500 ease-out
                        ${
                          isActive
                            ? `
                              z-30 h-[205px] w-[190px]
                              rounded-2xl border-yellow-400/60
                              opacity-100
                              sm:h-[260px] sm:w-[280px]
                              sm:rounded-[24px]
                              md:h-[330px] md:w-[380px]
                            `
                            : isNear
                              ? `
                                z-20 -mx-3 h-[165px] w-[105px]
                                rounded-xl border-white/15
                                opacity-60
                                sm:-mx-5 sm:h-[220px] sm:w-[170px]
                                sm:rounded-[20px]
                                md:-mx-8 md:h-[280px] md:w-[260px]
                              `
                              : `
                                z-10 -mx-8 hidden
                                h-[180px] w-[140px]
                                rounded-[20px] border-white/10
                                opacity-30
                                lg:block lg:h-[230px] lg:w-[210px]
                              `
                        }
                      `}
                    >
                      {franchise.image ? (
                        <img
                          src={franchise.image}
                          alt={franchise.name}
                          loading="lazy"
                          draggable={false}
                          className={`
                            h-full w-full object-cover
                            transition duration-700
                            group-hover:scale-105
                            ${
                              isActive
                                ? "scale-100"
                                : "scale-110"
                            }
                          `}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-white/40">
                          Image unavailable
                        </div>
                      )}

                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-t
                          ${
                            isActive
                              ? "from-black via-black/15 to-transparent"
                              : "from-black via-black/30 to-black/20"
                          }
                        `}
                      />

                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-8">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-yellow-400 sm:text-[10px]">
                            Franchise
                          </p>

                          <h3 className="mt-1 line-clamp-2 text-lg font-black leading-tight text-white sm:text-2xl md:text-4xl">
                            {franchise.name}
                          </h3>
                        </div>
                      )}

                      {isFar && (
                        <div className="absolute inset-0 bg-black/15" />
                      )}

                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-400" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="relative mt-2 flex items-center justify-center gap-2 sm:mt-4 sm:gap-3">
            <button
              type="button"
              aria-label="Previous franchise"
              onClick={showPrevious}
              className="
                grid h-9 w-9 shrink-0 place-items-center
                rounded-full border border-white/15
                bg-black/45 text-white transition
                hover:border-yellow-400
                hover:bg-yellow-400 hover:text-black
                sm:h-11 sm:w-11
              "
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {activeFranchise && (
              <Link
                href={`/search?q=${encodeURIComponent(
                  activeFranchise.name,
                )}`}
                className="
                  h-9 min-w-0 max-w-[190px]
                  truncate rounded-full bg-yellow-400
                  px-4 text-center text-xs font-black
                  leading-9 text-black transition
                  hover:bg-yellow-300
                  sm:h-11 sm:max-w-[240px]
                  sm:px-6 sm:text-sm sm:leading-[44px]
                "
              >
                Explore {activeFranchise.name}
              </Link>
            )}

            <button
              type="button"
              aria-label="Next franchise"
              onClick={showNext}
              className="
                grid h-9 w-9 shrink-0 place-items-center
                rounded-full border border-white/15
                bg-black/45 text-white transition
                hover:border-yellow-400
                hover:bg-yellow-400 hover:text-black
                sm:h-11 sm:w-11
              "
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="hide-scrollbar relative mx-auto mt-3 flex max-w-full justify-start gap-1.5 overflow-x-auto px-1 sm:mt-5 sm:justify-center sm:gap-2">
            {franchises.map((franchise, index) => (
              <button
                key={franchise.name}
                type="button"
                aria-label={`Show ${franchise.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1 shrink-0 rounded-full transition-all sm:h-1.5 ${
                  index === activeIndex
                    ? "w-7 bg-yellow-400 sm:w-9"
                    : "w-2 bg-white/20 hover:bg-white/50 sm:w-3"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-44 items-center justify-center text-xs text-white/40 sm:h-64 sm:text-sm">
          Loading franchises…
        </div>
      )}
    </section>
  );
}