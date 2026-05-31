import Link from "next/link";

const gamingCategories = [
  { title: "Console", href: "/news/gaming/console" },
  { title: "PC Gaming", href: "/news/gaming/pc" },
  { title: "Mobile Gaming", href: "/news/gaming/mobile" },
];

export default function GamingSubCategories() {
  return (
    <section className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.045] p-6">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-400">
        Gaming Channels
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Explore Gaming Categories
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {gamingCategories.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-black/30 p-5 font-bold transition hover:border-cyan-400/60 hover:bg-cyan-400 hover:text-black"
          >
            {item.title} →
          </Link>
        ))}
      </div>
    </section>
  );
}