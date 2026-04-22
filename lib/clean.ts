// lib/clean.ts
export type TitleItem = {
  id: number;
  media_type?: "movie" | "tv";
  poster_path?: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
};

export function cleanList(input: any, defaultType?: "movie" | "tv"): TitleItem[] {
  const arr: any[] = Array.isArray(input) ? input : Array.isArray(input?.results) ? input.results : [];
  return arr
    .filter((r) => r && typeof r.id === "number")
    .map((r) => (r.media_type ? r : defaultType ? { ...r, media_type: defaultType } : r));
}