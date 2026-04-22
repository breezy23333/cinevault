// components/Row.tsx
import MiniCard from "@/components/MiniCard";
import PosterCard from "@/components/PosterCard";

type MediaKind = "movie" | "tv";

export type Item = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  media_type?: MediaKind;
  [key: string]: any;
};

type RowProps = {
  title: string;
  items?: Item[];
  variant?: "grid" | "scroll";
  kind?: MediaKind;
  limit?: number;
  scrollItemWidth?: number;  // ⬅️ control size (default 240)
  className?: string;
  getHref?: (item: Item) => string;
};

const hrefOf = (item: Item, fallback: MediaKind = "movie") =>
  `/title/${(item.media_type as MediaKind) || fallback}/${item.id}`;

export default function Row({
  title,
  items = [],
  variant = "grid",
  kind = "movie",
  limit,
  scrollItemWidth = 240,
  className = "",
  getHref,
}: RowProps) {
  const list = (Array.isArray(items) ? items : [])
    .filter((x): x is Item => x && typeof x.id === "number")
    .slice(0, limit ?? (variant === "grid" ? 12 : 20));

  if (!list.length) {
    return (
      <section className={`mt-6 ${className}`}>
        <h3 className="mb-3 px-2 text-xl font-semibold">{title}</h3>
        <div className="rounded-xl border border-zinc-200/20 bg-white/5 p-6 text-white/70">
          Nothing to show here right now.
        </div>
      </section>
    );
  }

  if (variant === "scroll") {
    return (
      <ul className="-mx-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
      <section className={`mt-6 ${className}`}>
        {title && <h3 className="mb-3 px-2 text-xl font-semibold">{title}</h3>}
        <ul className="-mx-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {list.map((it, i) => (
            <li key={`${it.id}-${i}`} className="snap-start shrink-0" style={{ width: scrollItemWidth }}>
              <MiniCard item={it} href={(getHref || ((x) => hrefOf(x, kind)))(it)} />
            </li>
          ))}
        </ul>
      </section></ul>
    );
  }

  return (
    <section className={`mt-10 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-3">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
        {list.map((it) => (
          <PosterCard key={it.id} item={it} href={(getHref || ((x) => hrefOf(x, kind)))(it)} />
        ))}
      </div>
    </section>
  );
}