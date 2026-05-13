"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type Props = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

export default function WatchlistButton(item: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      const res = await fetch("/api/watchlist", {
        credentials: "include",
      });
      const data = await res.json();

      const exists = data.items?.some(
        (x: any) =>
          x.tmdbId === item.id &&
          x.mediaType === item.media_type
      );

      setSaved(Boolean(exists));
    }

    checkSaved();
  }, [item.id, item.media_type]);

  async function handleClick() {
    setLoading(true);

    if (saved) {
      await fetch("/api/watchlist", {
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: item.id,
          mediaType: item.media_type,
        }),
      });

      setSaved(false);
    } else {
      await fetch("/api/watchlist", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: item.id,
          mediaType: item.media_type,
          title: item.title,
          posterPath: item.poster_path,
          releaseDate: item.release_date,
          voteAverage: item.vote_average,
        }),
      });

      setSaved(true);
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
        saved
          ? "bg-yellow-400 text-black"
          : "bg-white/10 text-white hover:bg-yellow-400 hover:text-black"
      } disabled:opacity-60`}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
      {loading ? "Saving..." : saved ? "Saved" : "Add to Watchlist"}
    </button>
  );
}