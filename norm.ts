// utils/norm.ts (or inline)
export type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
};

export function norm(list: unknown[]): Norm[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter((x: any) => x && typeof x.id === "number")
    .map((x: any) => ({
      id: x.id as number,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: x.title || x.name || "Untitled",
      poster: x?.poster_path ? `https://image.tmdb.org/t/p/w500${x.poster_path}` : null,
      backdrop: x?.backdrop_path ? `https://image.tmdb.org/t/p/original${x.backdrop_path}` : null,
      year: (x.release_date || x.first_air_date || "").slice(0, 4),
    }));
}