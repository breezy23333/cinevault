"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";

type Props = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
};

export default function WatchlistButton(item: Props) {
  const [saved, setSaved] = useState(false);

  useState(() => {
    setSaved(isInWatchlist(item.id, item.media_type));
  });

  return (
    <button
      type="button"
      onClick={() => {
        toggleWatchlist(item);
        setSaved(!saved);
      }}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
        saved
          ? "bg-yellow-400 text-black"
          : "bg-white/10 text-white hover:bg-yellow-400 hover:text-black"
      }`}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Add to Watchlist"}
    </button>
  );
}