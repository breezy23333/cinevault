import type { NewsItem } from "@/components/NewsStrip";

export default function NewsCategoryGrid({
  title,
  eyebrow,
  items,
  color = "yellow",
}: {
  title: string;
  eyebrow: string;
  items: NewsItem[];
  color?: "yellow" | "green" | "cyan";
}) {
  const colorClass =
    color === "green"
      ? "text-green-400 hover:border-green-400/40 group-hover:text-green-300"
      : color === "cyan"
      ? "text-cyan-400 hover:border-cyan-400/40 group-hover:text-cyan-300"
      : "text-yellow-400 hover:border-yellow-400/40 group-hover:text-yellow-300";

  if (!items.length) return null;

  return (
    <section className="mt-20">
      <p className={`text-xs font-black uppercase tracking-[0.35em] ${colorClass}`}>
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-black text-white">{title}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, i) => (
          <a
            key={item.url + i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-2xl transition duration-300 hover:-translate-y-2 hover:bg-white/[0.08] ${colorClass}`}
          >
            <div className="relative h-64 overflow-hidden bg-white/5">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/40">
                  No image
                </div>
              )}
            </div>

            <div className="p-5">
              <p className={`text-xs font-black uppercase tracking-[0.25em] ${colorClass}`}>
                {eyebrow}
              </p>

              <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-white group-hover:text-inherit">
                {item.title}
              </h3>

              {item.source && (
                <p className="mt-3 text-sm text-white/40">{item.source}</p>
              )}
            </div>
          </a>
        ))}
      </div>

        <div className="mt-8">
            <a
                href={`https://www.google.com/search?q=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
                View more {title} →
            </a>
            </div>

    </section>
  );
}