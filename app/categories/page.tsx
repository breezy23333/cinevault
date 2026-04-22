import Link from "next/link";

const CATS: { label: string; id: number; hue: string }[] = [
  { label: "Action", id: 28, hue: "from-red-300 to-orange-300" },
  { label: "Adventure", id: 12, hue: "from-amber-300 to-yellow-300" },
  { label: "Animation", id: 16, hue: "from-pink-300 to-fuchsia-300" },
  { label: "Comedy", id: 35, hue: "from-lime-300 to-green-300" },
  { label: "Crime", id: 80, hue: "from-slate-300 to-zinc-200" },
  { label: "Documentary", id: 99, hue: "from-emerald-300 to-teal-300" },
  { label: "Drama", id: 18, hue: "from-rose-300 to-amber-300" },
  { label: "Family", id: 10751, hue: "from-sky-300 to-cyan-300" },
  { label: "Fantasy", id: 14, hue: "from-indigo-300 to-violet-300" },
  { label: "Horror", id: 27, hue: "from-zinc-300 to-slate-300" },
  { label: "Mystery", id: 9648, hue: "from-violet-300 to-purple-300" },
  { label: "Romance", id: 10749, hue: "from-rose-300 to-pink-300" },
  { label: "Sci-Fi", id: 878, hue: "from-blue-300 to-sky-300" },
  { label: "Thriller", id: 53, hue: "from-orange-300 to-amber-300" },
];

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-4">Browse by category</h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATS.map((c) => (
          <li key={c.id}>
            <Link
              href={`/search?genre=${c.id}`}
              className={`block rounded-2xl border border-zinc-200 bg-gradient-to-br ${c.hue} p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="text-lg font-semibold text-zinc-800 drop-shadow-sm">{c.label}</div>
              <div className="mt-1 text-xs text-zinc-700/80">Tap to explore</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
