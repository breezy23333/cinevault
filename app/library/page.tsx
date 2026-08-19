import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library | CINRYVAN",
  description:
    "Open your CINRYVAN watchlist and explore curated movie, TV, anime, cartoon and entertainment collections.",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "Library | CINRYVAN",
    description:
      "Return to your watchlist and explore entertainment collections on CINRYVAN.",
    url: "/library",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Library | CINRYVAN",
    description:
      "Open your watchlist and explore movies, television, animation and more.",
    images: ["/og-image.png"],
  },
};

const DISCOVERY_COLLECTIONS = [
  {
    number: "01",
    eyebrow: "What people love",
    title: "Trending Movies",
    text: "Discover the films attracting attention across CINRYVAN right now.",
    href: "/trending",
    accent: "from-orange-500/25 via-red-500/10",
  },
  {
    number: "02",
    eyebrow: "Critics & audiences",
    title: "Top Rated",
    text: "Explore acclaimed movies and shows with exceptional ratings.",
    href: "/top",
    accent: "from-yellow-400/25 via-amber-400/10",
  },
  {
    number: "03",
    eyebrow: "Animated worlds",
    title: "Anime Collection",
    text: "Enter anime series, movies and unforgettable fan favourites.",
    href: "/anime",
    accent: "from-fuchsia-500/25 via-violet-500/10",
  },
  {
    number: "04",
    eyebrow: "Across generations",
    title: "Cartoon Collection",
    text: "Rediscover animated classics, family stories and modern cartoons.",
    href: "/cartoons",
    accent: "from-cyan-400/25 via-blue-500/10",
  },
  {
    number: "05",
    eyebrow: "The full universe",
    title: "Search Library",
    text: "Search across movies, television, animation and entertainment picks.",
    href: "/search",
    accent: "from-emerald-400/25 via-teal-500/10",
  },
];

const SHORTCUTS = [
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Games", href: "/games" },
  { label: "News", href: "/news" },
];

const libraryJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CINRYVAN Library",
  description:
    "Open your CINRYVAN watchlist and explore movie, television, animation and entertainment collections.",
  url: "https://cinryvan.vercel.app/library",
};

export default function LibraryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] pb-24 pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(libraryJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative overflow-hidden border border-white/10 bg-[#101722] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(250,204,21,.18),transparent_22%),radial-gradient(circle_at_90%_90%,rgba(37,99,235,.16),transparent_30%),linear-gradient(115deg,#101722_10%,#0c121c_62%,#080b12_100%)]" />

          <div className="relative z-10 grid min-h-[540px] items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:px-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
                Your CINRYVAN
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Your library.
                <span className="block text-white/35">Your next world.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Return to everything you saved, then move naturally into new
                movies, series, animation, games and stories waiting to be
                discovered.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/watchlist"
                  className="inline-flex items-center bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Open Watchlist <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
                >
                  Search CINRYVAN
                </Link>
              </div>
            </div>

            <div className="relative mx-auto hidden h-[390px] w-full max-w-[480px] lg:block" aria-hidden="true">
              <div className="absolute left-2 top-12 h-64 w-[72%] -rotate-6 border border-white/10 bg-[#192231] shadow-2xl">
                <div className="h-32 bg-gradient-to-br from-blue-500/35 via-indigo-500/15 to-transparent" />
                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300">Continue exploring</p>
                  <p className="mt-2 text-xl font-black">New worlds</p>
                  <div className="mt-5 h-1.5 w-3/4 bg-white/10"><div className="h-full w-1/2 bg-blue-400" /></div>
                </div>
              </div>

              <div className="absolute right-0 top-4 h-72 w-[72%] rotate-6 border border-white/10 bg-[#171d27] shadow-2xl">
                <div className="h-36 bg-gradient-to-br from-fuchsia-500/35 via-purple-500/15 to-transparent" />
                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-fuchsia-300">Animation</p>
                  <p className="mt-2 text-xl font-black">Beyond imagination</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 h-72 w-[76%] -translate-x-1/2 border border-yellow-400/30 bg-[#111822] shadow-[0_28px_70px_rgba(0,0,0,.55)]">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-yellow-400/35 via-orange-500/15 to-transparent">
                  <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center bg-yellow-400 text-lg text-black">★</div>
                  <div className="absolute -bottom-14 -right-10 h-40 w-40 rounded-full border-[28px] border-white/5" />
                </div>
                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400">Saved collection</p>
                  <p className="mt-2 text-2xl font-black">Your Watchlist</p>
                  <p className="mt-2 text-xs text-white/40">Everything you want to return to.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-px border border-yellow-400/20 bg-yellow-400 px-6 py-8 text-black sm:px-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/55">
                Your personal collection
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Saved for your next session</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-black/60">
                Add titles from their detail pages, then find them together in your watchlist.
              </p>
            </div>
            <Link
              href="/watchlist"
              className="inline-flex w-fit items-center bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-[#172033]"
            >
              View saved titles →
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="mb-7 flex items-end justify-between gap-5 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-400">
                Curated paths
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Explore your way</h2>
            </div>
            <span className="hidden text-sm text-white/35 sm:block">Five collections</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {DISCOVERY_COLLECTIONS.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative min-h-[280px] overflow-hidden border border-white/10 bg-gradient-to-br ${item.accent} to-[#0d131d] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60 ${
                  index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[24px] border-white/[0.035] transition duration-500 group-hover:scale-125" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                      {item.eyebrow}
                    </p>
                    <span className="text-xs font-black text-white/30">{item.number}</span>
                  </div>
                  <div className="mt-auto pt-16">
                    <h3 className="text-2xl font-black transition group-hover:text-yellow-300">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/50">{item.text}</p>
                    <p className="mt-6 text-sm font-black text-white transition group-hover:text-yellow-300">
                      Open collection <span className="inline-block transition group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] px-5 py-7 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">Quick jump</p>
              <h2 className="mt-1 text-xl font-black">More from CINRYVAN</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {SHORTCUTS.map((shortcut) => (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className="border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-bold text-white/60 transition hover:border-yellow-400/60 hover:text-yellow-300"
                >
                  {shortcut.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}