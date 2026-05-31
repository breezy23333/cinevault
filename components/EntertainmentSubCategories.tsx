import Link from "next/link";

const entertainmentCategories = [
  { title: "Movies", href: "/news/entertainment/movies" },
  { title: "TV Shows", href: "/news/entertainment/tv" },
  { title: "Streaming", href: "/news/entertainment/streaming" },
  { title: "Celebrities", href: "/news/entertainment/celebrities" },
  { title: "Anime", href: "/news/entertainment/anime" },
];

export default function EntertainmentSubCategories() {
  return (
    <section className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.045] p-6">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
        Entertainment Channels
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Explore Entertainment Categories
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {entertainmentCategories.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-black/30 p-5 font-bold transition hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            {item.title} →
          </Link>
        ))}
      </div>
    </section>
  );
}