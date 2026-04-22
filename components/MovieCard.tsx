// components/MovieCard.tsx
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
};

export default function MovieCard({
  item,
  href,
  priority = false,
}: {
  item?: Item | null;          // <-- allow undefined/null
  href: string;
  priority?: boolean;
}) {
  // If parent passes nothing, fail safe (no crash)
  if (!item || typeof item !== "object") return null;
  if (typeof item.id !== "number") return null; // must have an id

  const title   = item.title ?? item.name ?? "Untitled";
  const yearTxt = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const poster  = item.poster_path
    ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
    : null;

  return (
    <Link
      href={href}
      prefetch={false}
      className="block rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:ring-white/20"
    >
      {poster ? (
        <Image
          src={poster}
          alt={title}
          width={185}
          height={278}           // 2:3, no cropping
          className="w-full h-auto"
          priority={priority}
        />
      ) : (
        <div style={{ width: 185, height: 278 }} className="bg-zinc-800" />
      )}

      <div className="p-2">
        <div className="text-[13px] font-medium line-clamp-1">{title}</div>
        <div className="text-[11px] text-zinc-400">{yearTxt || "—"}</div>
      </div>
    </Link>
  );
}