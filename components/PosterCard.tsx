import Image from "next/image";
import Link from "next/link";

export default function PosterCard({ item, href }:{ item:any; href:string }) {
  const title = item.title || item.name || "Untitled";
  const year  = (item.release_date || item.first_air_date || "").slice(0,4);
  const src   = item.poster_path
    ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
    : "/img/placeholder.svg"; // add a local placeholder if you like

  return (
    <Link href={href} className="block rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:ring-white/20">
      <Image
        src={src}
        alt={title}
        width={185}
        height={278}              // 2:3 ratio
        className="w-full h-auto" // never crop
      />
      <div className="p-2">
        <div className="text-[13px] font-medium line-clamp-1">{title}</div>
        <div className="text-[11px] text-zinc-400">{year || "—"}</div>
      </div>
    </Link>
  );
}