export type WatchlistItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
};

const KEY = "cinryvan_watchlist";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveWatchlist(items: WatchlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function isInWatchlist(id: number, media_type: "movie" | "tv") {
  return getWatchlist().some(
    (item) => item.id === id && item.media_type === media_type
  );
}

export function toggleWatchlist(item: WatchlistItem) {
  const list = getWatchlist();

  const exists = list.some(
    (x) => x.id === item.id && x.media_type === item.media_type
  );

  const next = exists
    ? list.filter((x) => !(x.id === item.id && x.media_type === item.media_type))
    : [item, ...list];

  saveWatchlist(next);
  return next;
}