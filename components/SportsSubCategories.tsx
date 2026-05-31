import Link from "next/link";

const sportsCategories = [
  { title: "Soccer", href: "/news/sports/soccer" },
  { title: "Football", href: "/news/sports/football" },
  { title: "Racing", href: "/news/sports/racing" },
  { title: "Basketball", href: "/news/sports/basketball" },
  { title: "Tennis", href: "/news/sports/tennis" },
];

export default function SportsSubCategories() {
  return (
    <section className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-green-400">
        Sports Channels
      </p>

      <h2 className="mt-2 text-2xl font-black md:text-3xl">
        Explore Sports Categories
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sportsCategories.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-black/30 p-5 font-bold transition hover:border-green-400/60 hover:bg-green-400 hover:text-black"
          >
            {item.title} →
          </Link>
        ))}
      </div>
    </section>
  );
}