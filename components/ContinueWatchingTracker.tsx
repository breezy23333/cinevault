"use client";

import { useEffect } from "react";
import { saveContinueWatching } from "@/lib/continueWatching";

type Props = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
};

export default function ContinueWatchingTracker({
  id,
  media_type,
  title,
  poster_path,
  release_date,
  vote_average,
}: Props) {
  useEffect(() => {
    saveContinueWatching({
      id,
      media_type,
      title,
      poster_path,
      release_date,
      vote_average,
    });
  }, [id, media_type, title, poster_path, release_date, vote_average]);

  return null;
}