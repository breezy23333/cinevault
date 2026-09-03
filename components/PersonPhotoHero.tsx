"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function PersonPhotoHero({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const photos = useMemo(
    () => Array.from(new Set(images.filter(Boolean))).slice(0, 50),
    [images],
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % photos.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [paused, photos.length]);

  useEffect(() => {
    if (active >= photos.length) setActive(0);
  }, [active, photos.length]);

  if (!photos.length) {
    return (
      <div className="grid min-h-[420px] place-items-center border border-white/10 bg-[#0b1018] text-white/40">
        Photographs are not available yet.
      </div>
    );
  }

  const previous = () =>
    setActive((current) => (current - 1 + photos.length) % photos.length);
  const next = () =>
    setActive((current) => (current + 1) % photos.length);

  const visibleThumbs = Array.from(
    { length: Math.min(7, photos.length) },
    (_, offset) => (active + offset) % photos.length,
  );

  return (
    <div
      className="relative min-h-[440px] overflow-hidden border border-white/10 bg-black sm:min-h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Image
        key={`background-${photos[active]}`}
        src={photos[active]}
        alt=""
        fill
        priority={active === 0}
        sizes="(max-width: 1280px) 100vw, 900px"
        className="scale-110 object-cover object-top opacity-35 blur-2xl"
      />

      <Image
        key={photos[active]}
        src={photos[active]}
        alt={`${name} public photograph ${active + 1}`}
        fill
        priority={active === 0}
        sizes="(max-width: 1280px) 100vw, 900px"
        className="object-contain object-center"
      />

      <div className="absolute inset-0 bg-black/5" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="bg-black/65 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-yellow-300 backdrop-blur">
          Photo archive
        </span>
        <span className="bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur">
          {active + 1} / {photos.length}
        </span>
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Previous photograph"
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/65 text-2xl text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photograph"
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/65 text-2xl text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            ›
          </button>
        </>
      )}

      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-black/55 p-3 backdrop-blur-sm">
        {visibleThumbs.map((index) => (
          <button
            key={`${photos[index]}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show photograph ${index + 1}`}
            className={`relative h-14 w-11 overflow-hidden border transition sm:h-16 sm:w-12 ${
              index === active
                ? "border-yellow-400"
                : "border-white/20 opacity-65 hover:opacity-100"
            }`}
          >
            <Image
              src={photos[index]}
              alt=""
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
