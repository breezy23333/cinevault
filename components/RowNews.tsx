// components/RowNews.tsx
import Image from "next/image";
import Link from "next/link";

type MediaKind = "movie" | "tv";
type NewsItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  media_type?: MediaKind;
  [key: string]: any;
};

const img = (p?: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

export default function RowNews({
  title = "Top news",
  items = [],
  width = 420,
  height = 220,
}: {
  title?: string;
  items?: NewsItem[];
  width?: number;
  height?: number;
}) {
  const list = (Array.isArray(items) ? items : []).filter((x) => x && typeof x.id === "number");
  if (!list.length) {
    return (
      <section className="mt-6">
        <h3 className="mb-3 px-2 text-xl font-semibold">{title}</h3>
        <div className="rounded-xl border border-zinc-200/20 bg-white/5 p-6 text-white/70">No updates right now.</div>
      </section>
    );
  }

  const hrefOf = (it: NewsItem) => `/title/${(it.media_type || "movie")}/${it.id}`;
  const titleOf = (it: NewsItem) => it.title || it.name || "Untitled";

  return (
    <section className="mt-6">
      {title && <h3 className="mb-3 px-2 text-xl font-semibold">{title}</h3>}
     <div className="-mx-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
        {list.map((m) => (
          <Link
            key={m.id}
            href={hrefOf(m)}
            className="group relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/30 snap-start"
            style={{ width }}
            title={titleOf(m)}
          >
            <div className="relative" style={{ height }}>
              {m.backdrop_path ? (
                <Image src={img(m.backdrop_path)!} alt={titleOf(m)} fill sizes={`${width}px`} className="object-cover" />
              ) : <div className="h-full w-full bg-zinc-800/40" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>
            <div className="p-3">
              <h4 className="line-clamp-1 font-semibold">{titleOf(m)}</h4>
              {m.overview && <p className="mt-1 line-clamp-2 text-sm text-white/70">{m.overview}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}