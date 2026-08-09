import type { Metadata } from "next";
import Link from "next/link";
import RoomsCarousel from "@/components/rooms/RoomsCarousel";

export const metadata: Metadata = {
  title: "Rooms | Movie, TV, Anime & Gaming Chat",
  description:
    "Join real-time CINRYVAN chat rooms for movies, TV shows, anime, cartoons, spoilers, gaming and entertainment news.",

  alternates: {
    canonical: "/rooms",
  },

  openGraph: {
    title: "CINRYVAN Rooms | Live Entertainment Communities",
    description:
      "Join themed live rooms for movies, television, anime, cartoons, spoilers, gaming and entertainment news.",
    url: "/rooms",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CINRYVAN Rooms | Live Fan Communities",
    description:
      "Real-time movie, TV, anime, cartoon, gaming, spoiler and news discussions.",
    images: ["/og-image.png"],
  },
};

const roomLinks = [
  {
    icon: "🎬",
    title: "Movies",
    href: "/rooms/cinryvan/movie",
    colour: "hover:border-amber-400 hover:text-amber-300",
  },
  {
    icon: "📺",
    title: "Television",
    href: "/rooms/cinryvan/tv",
    colour: "hover:border-indigo-400 hover:text-indigo-300",
  },
  {
    icon: "⚡",
    title: "Anime",
    href: "/rooms/cinryvan/anime",
    colour: "hover:border-pink-400 hover:text-pink-300",
  },
  {
    icon: "🎨",
    title: "Cartoons",
    href: "/rooms/cinryvan/cartoons",
    colour: "hover:border-cyan-400 hover:text-cyan-300",
  },
  {
    icon: "🔥",
    title: "Spoilers",
    href: "/rooms/cinryvan/spoilers",
    colour: "hover:border-orange-400 hover:text-orange-300",
  },
  {
    icon: "📰",
    title: "News",
    href: "/rooms/cinryvan/news",
    colour: "hover:border-red-400 hover:text-red-300",
  },
  {
    icon: "🎮",
    title: "Gaming",
    href: "/rooms/cinryvan/gaming",
    colour: "hover:border-purple-400 hover:text-purple-300",
  },
];

const communityFeatures = [
  {
    icon: "⚡",
    title: "Real-time conversations",
    text: "Messages appear live so members can react, recommend and discuss together.",
  },
  {
    icon: "🟢",
    title: "Online presence",
    text: "See when other CINRYVAN members are online inside the same room.",
  },
  {
    icon: "⌨️",
    title: "Typing indicators",
    text: "Know when another member is preparing a reply during active discussions.",
  },
  {
    icon: "#",
    title: "Topic channels",
    text: "Each room includes dedicated channels for focused community conversations.",
  },
  {
    icon: "🎭",
    title: "Unique room identities",
    text: "Every community has its own interface, atmosphere, channels and personality.",
  },
  {
    icon: "🛡️",
    title: "Member-only participation",
    text: "Members sign in before joining and posting in live CINRYVAN conversations.",
  },
];

export default function RoomsPage() {
  const roomsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CINRYVAN Rooms",
    description:
      "Real-time themed community rooms for movies, television, anime, cartoons, spoilers, gaming and entertainment news.",
    url: "https://cinryvan.vercel.app/rooms",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: roomLinks.map((room, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${room.title} Room`,
        url: `https://cinryvan.vercel.app${room.href}`,
      })),
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-24 pt-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(roomsJsonLd),
        }}
      />

      {/* Hero */}
      <section className="relative px-4 pb-12 pt-10 md:px-8 md:pt-16">
        <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-1/4 top-12 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/20 bg-yellow-400/[0.07] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                  CINRYVAN Rooms are live
                </span>
              </div>

              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
                Where fandom becomes{" "}
                <span className="bg-gradient-to-r from-yellow-300 via-white to-purple-300 bg-clip-text text-transparent">
                  conversation.
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
                Enter seven completely different live communities built around
                movies, television, anime, cartoons, spoilers, entertainment news
                and gaming. Choose your room, find a channel and join the
                discussion.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#featured-rooms"
                  className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
                >
                  Explore Live Rooms
                </a>

                <Link
                  href="/community"
                  className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 font-black text-white/75 hover:border-yellow-400/50 hover:text-yellow-300"
                >
                  Visit Community Hub
                </Link>
              </div>
            </div>

            {/* Honest platform facts */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur">
                <p className="text-3xl font-black text-yellow-300">7</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/35">
                  Themed rooms
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur">
                <p className="text-3xl font-black text-emerald-300">Live</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/35">
                  Messages
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur">
                <p className="text-3xl font-black text-purple-300">50+</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/35">
                  Topic channels
                </p>
              </div>
            </div>
          </div>

          {/* Quick-access room navigation */}
          <div className="mt-12 flex gap-3 overflow-x-auto pb-2">
            {roomLinks.map((room) => (
              <Link
                key={room.title}
                href={room.href}
                className={`flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-black text-white/55 transition hover:-translate-y-0.5 hover:bg-white/[0.07] ${room.colour}`}
              >
                <span>{room.icon}</span>
                <span>{room.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured carousel */}
      <section
        id="featured-rooms"
        className="scroll-mt-28 px-4 py-8 md:px-8"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
                Choose your community
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Seven rooms. Seven different worlds.
              </h2>
            </div>

            <p className="max-w-lg text-sm leading-7 text-white/45">
              Move through the carousel to preview each room’s identity and
              available conversation channels.
            </p>
          </div>

          <RoomsCarousel />
        </div>
      </section>

      {/* Community features */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-purple-300">
              Built for conversation
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-6xl">
              More than another comment section.
            </h2>

            <p className="mt-5 text-base leading-8 text-white/50">
              CINRYVAN Rooms combine themed fan communities with real-time
              messaging, presence and focused discussion channels.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-yellow-400/30 hover:bg-white/[0.055]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-400/10 text-xl text-yellow-300 ring-1 ring-yellow-400/15">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-xl font-black group-hover:text-yellow-300">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-4 pt-6 md:px-8">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[2.5rem] border border-yellow-400/20 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.22),transparent_35%),#0c0d14] p-8 md:p-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
                Your room is waiting
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">
                Find your people. Start the conversation.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/50">
                Sign in, choose a community and join CINRYVAN members discussing
                what they watch, play and care about.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/rooms/cinryvan/movie"
                className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
              >
                Enter Movie Room
              </Link>

              <Link
                href="/rooms/cinryvan/gaming"
                className="rounded-full bg-purple-500 px-6 py-3 font-black text-white hover:bg-purple-400"
              >
                Enter Gaming Room
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}