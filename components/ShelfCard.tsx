import Image from "next/image";
import Link from "next/link";

export type ShelfMedia = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  year?: string;
  rating?: number;
};

export default function ShelfCard({ item, href }: { item: ShelfMedia; href: string }) {
  const score = typeof item.rating === "number" ? item.rating.toFixed(1) : null;

  return (
    <Link
      href={href}
      className="group w-[140px] shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 transition"
    >
      <div className="relative aspect-[2/3] bg-zinc-800">
        {item.poster && (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes="140px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {score && (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold">
            ⭐ {score}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
        {item.year && <p className="text-xs text-zinc-400">{item.year}</p>}
      </div>
    </Link>
  );
}
