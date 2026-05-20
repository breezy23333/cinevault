export type ContinueItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
  watched_at: string;
};

const KEY = "cinevault_continue_watching";

export function getContinueWatching(): ContinueItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveContinueWatching(item: Omit<ContinueItem, "watched_at">) {
  if (typeof window === "undefined") return;

  const current = getContinueWatching();

  const next = [
    {
      ...item,
      watched_at: new Date().toISOString(),
    },
    ...current.filter(
      (x) => !(x.id === item.id && x.media_type === item.media_type)
    ),
  ].slice(0, 20);

  localStorage.setItem(KEY, JSON.stringify(next));
}