// components/MiniCard.tsx
import Image from "next/image";
import Link from "next/link";

export default function MiniCard({
  item,
  href,
}: {
  item?: any;
  href: string;
}) {
  if (!item || typeof item.id !== "number") return null;
  const title = item.title ?? item.name ?? "Untitled";
  const year  = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : null;

  return (
    <Link
      href={href}
      prefetch={false}
      className="block w-[185px] rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:ring-white/20"
    >
      {poster ? (
        <Image src={poster} alt={title} width={185} height={278} className="w-full h-auto" />
      ) : (
        <div className="w-[185px] h-[278px] bg-white/10" />
      )}
      <div className="px-2 py-2">
        <div className="text-sm font-medium line-clamp-1">{title}</div>
        <div className="text-xs text-white/60">{year || "—"}</div>
      </div>
    </Link>
  );
}