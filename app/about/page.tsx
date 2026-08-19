import type { Metadata } from "next";
import Link from "next/link";
import AboutFeatures from "@/components/AboutFeatures";

export const metadata: Metadata = {
  title: "About CINRYVAN | One Universe for Entertainment",
  description:
    "Discover CINRYVAN’s mission: bringing movies, TV, animation, games and entertainment news together in one carefully designed discovery platform.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CINRYVAN",
    description:
      "Learn how CINRYVAN brings movies, TV shows, animation, games and entertainment news into one discovery universe.",
    url: "/about",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About CINRYVAN",
    description:
      "One discovery universe for movies, television, animation, games and entertainment news.",
    images: ["/og-image.png"],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About CINRYVAN",
  description:
    "Learn about CINRYVAN and its mission to unite movies, television, animation, games and entertainment news in one discovery platform.",
  url: "https://cinryvan.vercel.app/about",
  isPartOf: {
    "@type": "WebSite",
    name: "CINRYVAN",
    url: "https://cinryvan.vercel.app",
  },
};

const WORLDS = [
  { number: "01", title: "Movies & TV", text: "Stories, casts, trailers and official places to watch." },
  { number: "02", title: "Animation", text: "Anime, cartoons and animated worlds across generations." },
  { number: "03", title: "Gaming", text: "Games, genres, ratings, trailers and places to play." },
  { number: "04", title: "News", text: "Entertainment, gaming and sports stories worth exploring." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] pb-24 pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative min-h-[610px] overflow-hidden border border-white/10 bg-[#0d1420] shadow-[0_30px_100px_rgba(0,0,0,.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(250,204,21,.20),transparent_22%),radial-gradient(circle_at_72%_70%,rgba(37,99,235,.18),transparent_28%),linear-gradient(120deg,#0d1420_15%,#101827_55%,#080b12_100%)]" />
          <div className="absolute -right-24 top-14 h-[430px] w-[430px] rounded-full border border-yellow-400/20" />
          <div className="absolute -right-6 top-32 h-[280px] w-[280px] rounded-full border border-white/10" />
          <div className="absolute right-28 top-60 h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_30px_8px_rgba(250,204,21,.55)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080b12] to-transparent" />

          <div className="relative z-10 flex min-h-[610px] flex-col justify-between p-7 sm:p-10 lg:p-16">
            <div className="flex items-center justify-between gap-6">
              <p className="text-xs font-black uppercase tracking-[0.42em] text-yellow-400">
                The CINRYVAN Story
              </p>
              <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-white/30 sm:block">
                Explore beyond the screen
              </span>
            </div>

            <div className="max-w-5xl py-14">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-white/45">
                Movies · Television · Animation · Games · News
              </p>
              <h1 className="text-5xl font-black leading-[.88] tracking-[-0.055em] sm:text-7xl lg:text-[104px]">
                Every story.
                <span className="block text-yellow-400">One universe.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                CINRYVAN is a discovery platform built to reconnect people with
                the stories, worlds and experiences they love—without making
                them search across a dozen different places.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Enter CINRYVAN <span className="ml-2">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black text-white transition hover:border-yellow-400/60 hover:text-yellow-300"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>

        <section className="grid border-x border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {WORLDS.map((world) => (
            <article
              key={world.title}
              className="group min-h-56 border-b border-white/10 bg-[#0d121c] p-6 transition hover:bg-[#131b28] sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="text-xs font-black tracking-[0.25em] text-yellow-400">
                {world.number}
              </span>
              <h2 className="mt-10 text-xl font-black transition group-hover:text-yellow-300">
                {world.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{world.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-10 py-20 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
              Why we exist
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Discovery should feel exciting again.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-white/55 sm:text-lg">
            <p>
              Entertainment has never offered more choice, but finding the
              right thing can feel harder than ever. Titles are scattered
              across services, useful information is buried, and browsing can
              become work.
            </p>
            <p>
              CINRYVAN brings discovery back into one connected experience.
              Move from a film to its cast, from a game to its trailer, or from
              a headline to a whole new world—all without losing the thread.
            </p>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-14">
          <div className="px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                Built around the audience
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Designed to make exploration effortless
              </h2>
              <p className="mt-4 leading-7 text-white/50">
                Clear information, meaningful connections and direct paths to
                official sources are at the centre of every CINRYVAN experience.
              </p>
            </div>
            <div className="mt-10">
              <AboutFeatures />
            </div>
          </div>
        </section>

        <section className="relative mt-20 overflow-hidden border border-yellow-400/20 bg-yellow-400 px-6 py-12 text-black sm:px-10 lg:px-14">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[42px] border-black/5" />
          <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-black/55">
                This is only the beginning
              </p>
              <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                Find your next world.
              </h2>
              <p className="mt-4 max-w-2xl font-semibold leading-7 text-black/65">
                Explore something familiar, discover something unexpected, and
                keep everything you love within reach.
              </p>
            </div>
            <Link
              href="/browse"
              className="inline-flex w-fit items-center bg-black px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#111827]"
            >
              Start exploring <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}