"use client";

import { useEffect, useState } from "react";

type CineImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
  sizes?: string;
};

function createTmdbSrcSet(src: string) {
  const tmdbPattern =
    /https:\/\/image\.tmdb\.org\/t\/p\/(?:w\d+|original)\//;

  if (!tmdbPattern.test(src)) {
    return undefined;
  }

  const createUrl = (size: string) =>
    src.replace(
      tmdbPattern,
      `https://image.tmdb.org/t/p/${size}/`,
    );

  return [
    `${createUrl("w342")} 342w`,
    `${createUrl("w500")} 500w`,
    `${createUrl("w780")} 780w`,
    `${createUrl("w1280")} 1280w`,
  ].join(", ");
}

export default function CineImage({
  src,
  alt,
  className = "",
  fallback = "No image",
  priority = false,
  sizes,
}: CineImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-zinc-900 px-3 text-center text-xs text-white/45">
        {fallback}
      </div>
    );
  }

  const responsiveSrcSet =
    priority || sizes
      ? createTmdbSrcSet(src)
      : undefined;

  return (
    <img
      key={src}
      src={src}
      srcSet={responsiveSrcSet}
      sizes={
        responsiveSrcSet
          ? sizes || "100vw"
          : undefined
      }
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setError(true)}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}