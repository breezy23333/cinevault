"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  movieId: number;
  tmdb?: number; // TMDB average (e.g. 7.3)
};

export default function UserRating({ movieId, tmdb }: Props) {
  const k = `cv:rating:${movieId}`;
  const [rating, setRating] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = window.localStorage.getItem(k);
    return saved ? Number(saved) : 0;
  });
  const [hover, setHover] = useState<number>(0);

  useEffect(() => {
    if (rating > 0) window.localStorage.setItem(k, String(rating));
  }, [k, rating]);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);
  const shown = hover || rating;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
        <span className="text-xs text-white/70">TMDB</span>
        <span className="font-semibold">{tmdb ?? "—"}</span>
      </div>

      <div className="flex items-center gap-1">
        {stars.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(s)}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/10 ring-1 ring-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={shown >= s ? "currentColor" : "none"}>
              <path
                d="M12 17.27l5.18 3.04-1.64-5.81L20 9.24l-5.92-.51L12 3 9.92 8.73 4 9.24l4.46 5.26-1.64 5.81L12 17.27z"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-white/80">
          Your rating: <b>{rating || "—"}/5</b>
        </span>
      </div>
    </div>
  );
}
