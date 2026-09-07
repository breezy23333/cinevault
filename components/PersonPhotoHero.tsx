"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PersonPhotoHeroProps = {
  name: string;
  images: string[];
};

export default function PersonPhotoHero({
  name,
  images,
}: PersonPhotoHeroProps) {
  const photos = useMemo(() => {
    return Array.from(
      new Set(images.filter(Boolean)),
    ).slice(0, 50);
  }, [images]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      photos.length < 2
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) =>
        current === photos.length - 1
          ? 0
          : current + 1,
      );
    }, 10000);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, photos.length]);

  useEffect(() => {
    if (
      photos.length > 0 &&
      active >= photos.length
    ) {
      setActive(0);
    }
  }, [active, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="grid min-h-[440px] place-items-center border border-white/10 bg-[#0b1018] px-6 text-center text-white/40">
        Photographs are not available yet.
      </div>
    );
  }

  const currentPhoto =
    photos[active] || photos[0];

  function previousPhoto() {
    setActive((current) =>
      current === 0
        ? photos.length - 1
        : current - 1,
    );
  }

  function nextPhoto() {
    setActive((current) =>
      current === photos.length - 1
        ? 0
        : current + 1,
    );
  }

  return (
    <div
      className="overflow-hidden border border-white/10 bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[480px] overflow-hidden bg-[#05070d] sm:min-h-[590px]">
        <Image
          key={`background-${currentPhoto}`}
          src={currentPhoto}
          alt=""
          fill
          priority={active === 0}
          sizes="(max-width: 1280px) 100vw, 1000px"
          className="scale-110 object-cover object-top opacity-35 blur-3xl"
        />

        <div className="absolute inset-0 bg-black/15" />

        <Image
          key={currentPhoto}
          src={currentPhoto}
          alt={`${name} public photograph ${active + 1}`}
          fill
          priority={active === 0}
          sizes="(max-width: 1280px) 100vw, 1000px"
          className="object-contain object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="inline-flex border border-yellow-400/40 bg-black/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300 backdrop-blur-md">
              CINRYVAN Photo Archive
            </p>

            <p className="mt-2 hidden text-xs font-bold text-white/55 sm:block">
              Explore {photos.length} public photographs
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setPaused((current) => !current)
            }
            aria-label={
              paused
                ? "Resume slideshow"
                : "Pause slideshow"
            }
            className="grid h-10 w-10 place-items-center border border-white/20 bg-black/70 text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            {paused ? (
              <Play
                className="h-4 w-4"
                fill="currentColor"
              />
            ) : (
              <Pause
                className="h-4 w-4"
                fill="currentColor"
              />
            )}
          </button>
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousPhoto}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300 sm:left-5 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition hover:border-yellow-400 hover:text-yellow-300 sm:right-5 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400">
              Public photograph
            </p>

            <p className="mt-1 text-lg font-black text-white sm:text-2xl">
              {name}
            </p>
          </div>

          <p className="shrink-0 text-sm font-black text-white">
            {String(active + 1).padStart(2, "0")}
            <span className="mx-2 text-white/30">
              /
            </span>
            <span className="text-white/50">
              {String(photos.length).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      {photos.length > 1 && (
        <div className="border-t border-white/10 bg-[#080b11] p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photograph ${index + 1}`}
                aria-current={
                  index === active
                    ? "true"
                    : undefined
                }
                className={`relative h-16 w-12 shrink-0 overflow-hidden border transition sm:h-20 sm:w-16 ${
                  index === active
                    ? "border-yellow-400 opacity-100"
                    : "border-white/10 opacity-45 hover:border-white/40 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />

                {index === active && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}