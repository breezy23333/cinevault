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

type WatchlistItem = {
  tmdbId: number;
  mediaType: "movie" | "tv";
};

function isWatchlistItem(value: unknown): value is WatchlistItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.tmdbId === "number" &&
    (item.mediaType === "movie" || item.mediaType === "tv")
  );
}

export default function WatchlistButton(item: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setSaved(false);
    setChecking(true);
    setError(null);

    async function checkSaved() {
      try {
        const res = await fetch("/api/watchlist", {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        // Signed-out visitors do not have a saved watchlist.
        if (res.status === 401) return;

        if (!res.ok) {
          throw new Error("Watchlist request failed");
        }

        const text = await res.text();

        if (!text.trim()) {
          throw new Error("Empty watchlist response");
        }

        const data: unknown = JSON.parse(text);

        if (
          !data ||
          typeof data !== "object" ||
          !("items" in data) ||
          !Array.isArray(data.items) ||
          !data.items.every(isWatchlistItem)
        ) {
          throw new Error("Invalid watchlist response");
        }

        const exists = data.items.some(
          (entry) =>
            entry.tmdbId === item.id &&
            entry.mediaType === item.media_type
        );

        if (!controller.signal.aborted) {
          setSaved(exists);
        }
      } catch {
        // Handle blocked, empty, malformed and failed responses.
        if (!controller.signal.aborted) {
          setError(
            "Could not check your watchlist. Refresh to try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    }

    void checkSaved();

    return () => controller.abort();
  }, [item.id, item.media_type]);

  async function handleClick() {
    if (loading || checking) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/watchlist", {
        credentials: "include",
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          saved
            ? {
                tmdbId: item.id,
                mediaType: item.media_type,
              }
            : {
                tmdbId: item.id,
                mediaType: item.media_type,
                title: item.title,
                posterPath: item.poster_path,
                releaseDate: item.release_date,
                voteAverage: item.vote_average,
              }
        ),
      });

      if (res.status === 401) {
        setError("Please sign in to use your watchlist.");
        return;
      }

      if (!res.ok) {
        throw new Error("Watchlist update failed");
      }

      // Update the button only after the server accepts the change.
      setSaved(!saved);
    } catch {
      setError(
        "Could not update your watchlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || checking}
        aria-pressed={saved}
        aria-busy={loading || checking}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
          saved
            ? "bg-yellow-400 text-black"
            : "bg-white/10 text-white hover:bg-yellow-400 hover:text-black"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Bookmark
          size={18}
          fill={saved ? "currentColor" : "none"}
          aria-hidden="true"
        />

        {checking
          ? "Checking..."
          : loading
            ? saved
              ? "Removing..."
              : "Saving..."
            : saved
              ? "Saved"
              : "Add to Watchlist"}
      </button>

      {error && (
        <p role="status" className="max-w-xs text-xs text-amber-200">
          {error}
        </p>
      )}
    </div>
  );
}