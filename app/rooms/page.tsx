import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CineVault Rooms | Movie & TV Chat Rooms",
  description:
    "Join CineVault Rooms to chat about movies, TV shows, anime, cartoons, spoilers, gaming, and entertainment news.",
  alternates: {
    canonical: "/rooms",
  },
  openGraph: {
    title: "CineVault Rooms | Movie & TV Chat Rooms",
    description:
      "Chat with fans in CineVault Rooms about movies, TV shows, anime, cartoons, spoilers, gaming, and entertainment news.",
    url: "/rooms",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVault Rooms",
    description: "Movie, TV, anime, cartoon, gaming, and spoiler chat rooms.",
    images: ["/og-image.png"],
  },
};

const rooms = [
  {
    icon: "🎬",
    title: "Movie Room",
    text: "Talk about new releases, classics, hidden gems, cinema news, and what to watch next.",
    href: "/rooms/cinevault/movie",
    status: "Live",
  },
  {
    icon: "📺",
    title: "TV Room",
    text: "Discuss episodes, seasons, finales, theories, streaming shows, and binge-worthy picks.",
    href: "/rooms/cinevault/tv",
    status: "Live",
  },
  {
    icon: "⚡",
    title: "Anime Room",
    text: "Share anime recommendations, story arcs, characters, studios, and fan favorites.",
    href: "/rooms/cinevault/anime",
    status: "Live",
  },
  {
    icon: "🎨",
    title: "Cartoon Room",
    text: "Chat about animated classics, modern cartoons, family picks, and nostalgic favorites.",
    href: "/rooms/cinevault/cartoons",
    status: "Live",
  },
  {
    icon: "🔥",
    title: "Spoiler Room",
    text: "A dedicated place for endings, plot twists, theories, reveals, and full spoiler discussions.",
    href: "/rooms/cinevault/spoilers",
    status: "Careful",
  },
  {
    icon: "📰",
    title: "News Room",
    text: "React to entertainment news, casting updates, trailers, gaming news, and release announcements.",
    href: "/rooms/cinevault/news",
    status: "Live",
  },
  {
    icon: "🎮",
    title: "Gaming Room",
    text: "Talk about games, consoles, adaptations, gaming movies, esports, and upcoming releases.",
    href: "/rooms/cinevault/gaming",
    status: "Live",
  },
];

const features = [
  "Real-time style chat interface",
  "Movie and TV fan discussions",
  "Spoiler-safe rooms",
  "Anime and cartoon spaces",
  "Gaming and entertainment news",
  "User profiles coming next",
];

export default function RoomsPage() {
  const roomsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CineVault Rooms",
    description:
      "Movie, TV show, anime, cartoon, gaming, spoiler, and entertainment chat rooms on CineVault.",
    url: "https://cinevault-tau-drab.vercel.app/rooms",
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] px-4 py-24 text-white md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(roomsJsonLd),
        }}
      />

      <section className="mx-auto max-w-[1500px]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.04] to-blue-500/10 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.18),transparent_30%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300">
                CineVault Social Network
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
                Chat rooms for every kind of fan.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">
                Join dedicated rooms for movies, TV shows, anime, cartoons,
                spoilers, gaming, and entertainment news. Share reactions,
                recommendations, theories, and what you are watching next.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#rooms"
                  className="rounded-full bg-yellow-400 px-6 py-3 font-black text-black hover:bg-yellow-300"
                >
                  Browse Rooms
                </a>

                <Link
                  href="/community"
                  className="rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-yellow-400/70"
                >
                  Community Hub
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur">
              <p className="text-sm font-black text-yellow-300">
                Rooms Preview
              </p>

              <div className="mt-4 space-y-3">
                {[
                  ["MovieFan", "What is everyone watching tonight?"],
                  ["AnimeVault", "New anime recommendations?"],
                  ["SpoilerAlert", "Use the spoiler room for endings."],
                ].map(([name, text]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black text-yellow-300">{name}</p>
                      <span className="text-xs text-white/35">Now</span>
                    </div>
                    <p className="mt-2 text-sm text-white/65">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="rooms" className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <Link
              key={room.title}
              href={room.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-yellow-400 text-2xl shadow-[0_0_35px_rgba(250,204,21,0.22)]">
                  {room.icon}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    room.status === "Careful"
                      ? "bg-red-500/10 text-red-300"
                      : "bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-black text-white group-hover:text-yellow-300">
                {room.title}
              </h2>

              <p className="mt-3 min-h-[84px] text-sm leading-7 text-white/60">
                {room.text}
              </p>

              <p className="mt-5 text-sm font-black text-white/80 group-hover:text-yellow-300">
                Enter room →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
                Coming Feature
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                CineVault Rooms will become your fan network.
              </h2>
              <p className="mt-4 text-white/60">
                This starts as a beautiful room system. Later we can connect it
                to Neon so messages, users, rooms, and reactions become real.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm font-bold text-white/70"
                >
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}