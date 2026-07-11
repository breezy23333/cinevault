"use client";

import { useState } from "react";

type CineImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
};

export default function CineImage({
  src,
  alt,
  className = "",
  fallback = "No image",
  priority = false,
}: CineImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-zinc-900 text-center text-xs text-white/45">
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setError(true)}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}