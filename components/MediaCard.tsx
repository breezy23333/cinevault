// components/MediaCard.tsx
import Image from "next/image";
import Link from "next/link";

export type Media = {
  id: number;
  title: string;
  year?: string;
  rating?: number; // 0–10
  poster?: string | null;
  media: "movie" | "tv";
};

export default function MediaCard({ item, href }: { item: Media; href: string }) {
  const score = item.rating ? Math.round(item.rating * 10) : null;
  return (
    <Link
      href={href}
      className="group w-[140px] shrink-0 snap-start rounded-xl overflow-hidden ring-1 ring-white/10 bg-zinc-900/40"
    >
      <div className="relative h-[200px] w-full bg-zinc-800">
        {!!item.poster && (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="140px"
          />
        )}
        {score !== null && (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold">
            ⭐ {item.rating?.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
        <p className="text-xs text-zinc-400">{item.year}</p>
      </div>
    </Link>
  );
}