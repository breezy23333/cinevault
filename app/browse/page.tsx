import Link from "next/link";

const links = [
  { title: "Anime", href: "/anime" },
  { title: "Cartoons", href: "/cartoons" },
  { title: "Categories", href: "/categories" },
  { title: "Top Rated", href: "/top" },
  { title: "Search", href: "/search" },
];

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-[#0e131f] px-6 md:px-12 py-28">
      <h1 className="text-4xl md:text-6xl font-black mb-4">Browse CineVault</h1>
      <p className="text-white/60 mb-10 max-w-2xl">
        Explore movies, TV shows, anime, cartoons, categories, and top-rated titles.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl bg-[#0c111b] ring-1 ring-white/10 p-6 hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-yellow-400 mt-2">Open →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}