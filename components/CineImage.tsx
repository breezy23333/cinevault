"use client";

import { useState } from "react";

export default function CineImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  fallback = "No image",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
}) {
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
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}