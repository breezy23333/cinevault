import Image from "next/image";
import Link from "next/link";

type MediaKind = "movie" | "tv";
export type RawItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  media_type?: MediaKind;
  release_date?: string;
  first_air_date?: string;
};

const tmdb = (p?: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

export default function CapsuleCard({
  item,
  href,
  width = 420,
  height = 220,
}: {
  item: RawItem;
  href: string;
  width?: number;
  height?: number;
}) {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const img = tmdb(item.backdrop_path, "w1280") || tmdb(item.poster_path, "w780");

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/30 hover:bg-black/40 transition"
      style={{ width }}
      title={title}
    >
      <div className="relative" style={{ height }}>
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes={`${width}px`}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800/40" />
        )}
        {/* bottom gradient like Steam */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-white/60">{year}</p>
      </div>
    </Link>
  );
}