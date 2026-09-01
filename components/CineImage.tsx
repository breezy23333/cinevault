"use client";

import { useState } from "react";

type CineImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
  sizes?: string;
};

const TMDB_PATTERN =
  /https:\/\/image\.tmdb\.org\/t\/p\/(?:w\d+|original)\//;

function createTmdbUrl(src: string, size: string) {
  if (!TMDB_PATTERN.test(src)) return src;

  return src.replace(
    TMDB_PATTERN,
    `https://image.tmdb.org/t/p/${size}/`,
  );
}

function createTmdbSrcSet(src: string) {
  if (!TMDB_PATTERN.test(src)) return undefined;

  return [
    `${createTmdbUrl(src, "w185")} 185w`,
    `${createTmdbUrl(src, "w300")} 300w`,
    `${createTmdbUrl(src, "w342")} 342w`,
    `${createTmdbUrl(src, "w500")} 500w`,
    `${createTmdbUrl(src, "w780")} 780w`,
    `${createTmdbUrl(src, "w1280")} 1280w`,
  ].join(", ");
}

function ImageFallback({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-zinc-900 px-3 text-center text-xs text-white/45">
      {text}
    </div>
  );
}

function LoadableImage({
  src,
  alt,
  className,
  fallback,
  priority,
  sizes,
}: Required<Pick<CineImageProps, "src" | "alt" | "fallback">> &
  Pick<CineImageProps, "className" | "priority" | "sizes">) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ImageFallback text={fallback} />;
  }

  const responsiveSrcSet = createTmdbSrcSet(src);
  const responsiveSizes =
    sizes ||
    (priority
      ? "100vw"
      : "(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 33vw");

  // Avoid using a full-size TMDB original as the fallback request.
  const safeSrc = createTmdbUrl(src, priority ? "w1280" : "w500");

  return (
    <img
      src={safeSrc}
      srcSet={responsiveSrcSet}
      sizes={responsiveSrcSet ? responsiveSizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full ${className || ""}`}
    />
  );
}

export default function CineImage({
  src,
  alt,
  className = "",
  fallback = "No image",
  priority = false,
  sizes,
}: CineImageProps) {
  if (!src) {
    return <ImageFallback text={fallback} />;
  }

  return (
    <LoadableImage
      key={src}
      src={src}
      alt={alt}
      className={className}
      fallback={fallback}
      priority={priority}
      sizes={sizes}
    />
  );
}
