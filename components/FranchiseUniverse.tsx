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
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] px-4 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.14),transparent_42%)]" />

      <div className="relative mx-auto mb-8 max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Cinematic Universes
        </p>

        <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
          Legendary Franchises
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
          Explore the biggest movie worlds, sagas, superheroes,
          fantasy realms, animation universes and horror collections.
        </p>
      </div>

      {franchises.length > 0 ? (
        <>
          <div
            className="relative mx-auto flex min-h-[270px] max-w-6xl touch-pan-y items-center justify-center overflow-hidden py-4 md:min-h-[350px]"
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
                      className={`group relative shrink-0 overflow-hidden border bg-[#090c12] text-left shadow-2xl transition-all duration-500 ease-out ${
                        isActive
                          ? "z-30 h-[250px] w-[260px] rounded-[28px] border-yellow-400/60 opacity-100 md:h-[330px] md:w-[380px]"
                          : isNear
                            ? "z-20 -mx-5 h-[210px] w-[170px] rounded-[24px] border-white/15 opacity-75 md:-mx-8 md:h-[280px] md:w-[260px]"
                            : "z-10 -mx-8 hidden h-[180px] w-[140px] rounded-[20px] border-white/10 opacity-35 lg:block lg:h-[230px] lg:w-[210px]"
                      }`}
                    >
                      {franchise.image ? (
                        <img
                          src={franchise.image}
                          alt={franchise.name}
                          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                            isActive
                              ? "scale-100"
                              : "scale-110"
                          }`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                          No image
                        </div>
                      )}

                      <div
                        className={`absolute inset-0 bg-gradient-to-t transition ${
                          isActive
                            ? "from-black via-black/10 to-transparent"
                            : "from-black via-black/25 to-black/20"
                        }`}
                      />

                      <div
                        className={`absolute inset-x-0 bottom-0 transition-all duration-500 ${
                          isActive
                            ? "translate-y-0 p-6 opacity-100 md:p-8"
                            : "translate-y-2 p-4 opacity-0"
                        }`}
                      >
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                          Franchise
                        </p>

                        <h3 className="mt-2 text-2xl font-black leading-tight text-white md:text-4xl">
                          {franchise.name}
                        </h3>
                      </div>

                      {isFar && (
                        <div className="absolute inset-0 bg-black/15" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous franchise"
              onClick={showPrevious}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/45 text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {activeFranchise && (
              <Link
                href={`/search?q=${encodeURIComponent(
                  activeFranchise.name,
                )}`}
                className="min-w-0 max-w-[240px] truncate rounded-full bg-yellow-400 px-6 py-3 text-center text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Explore {activeFranchise.name}
              </Link>
            )}

            <button
              type="button"
              aria-label="Next franchise"
              onClick={showNext}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/45 text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-5 flex justify-center gap-2">
            {franchises.map((franchise, index) => (
              <button
                key={franchise.name}
                type="button"
                aria-label={`Show ${franchise.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-9 bg-yellow-400"
                    : "w-3 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="relative flex h-64 items-center justify-center text-sm text-white/45">
          Loading franchises…
        </div>
      )}
    </section>
  );
}