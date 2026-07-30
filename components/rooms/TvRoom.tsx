import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type TVRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const tvChannels = [
  {
    slug: "general",
    label: "series-lounge",
    icon: "📺",
    description: "The main lounge for everything happening on television.",
  },
  {
    slug: "episodes",
    label: "latest-episodes",
    icon: "▶",
    description: "Discuss this week’s newest episodes and unforgettable scenes.",
  },
  {
    slug: "finales",
    label: "season-finales",
    icon: "🏁",
    description: "React to major finales, cliffhangers and series endings.",
  },
  {
    slug: "theories",
    label: "fan-theories",
    icon: "🧠",
    description: "Share predictions, hidden details and wild fan theories.",
  },
  {
    slug: "recommendations",
    label: "what-to-watch",
    icon: "✨",
    description: "Find your next binge-worthy television series.",
  },
  {
    slug: "reality",
    label: "reality-tv",
    icon: "🎭",
    description: "Discuss reality competitions, drama and memorable contestants.",
  },
  {
    slug: "classics",
    label: "classic-series",
    icon: "🕰️",
    description: "Revisit legendary television shows from every era.",
  },
  {
    slug: "watch-party",
    label: "watch-party",
    icon: "👥",
    description: "Plan live episode discussions and community watch parties.",
  },
];

const roomNavigation = [
  { label: "Movies", icon: "🎬", href: "/rooms/cinevault/movie" },
  { label: "TV", icon: "📺", href: "/rooms/cinevault/tv" },
  { label: "Anime", icon: "⚡", href: "/rooms/cinevault/anime" },
  { label: "Cartoons", icon: "🎨", href: "/rooms/cinevault/cartoons" },
  { label: "Spoilers", icon: "🔥", href: "/rooms/cinevault/spoilers" },
  { label: "News", icon: "📰", href: "/rooms/cinevault/news" },
  { label: "Gaming", icon: "🎮", href: "/rooms/cinevault/gaming" },
];

export default function TVRoom({
  userId,
  username,
  activeChannel = "general",
}: TVRoomProps) {
  const selectedChannel =
    tvChannels.find((channel) => channel.slug === activeChannel) ||
    tvChannels[0];

  const roomKey = `cinevault:tv:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#070812] pt-20 text-white">
      <section className="mx-auto max-w-[1700px] px-3 py-4">
        <div className="overflow-hidden rounded-[2rem] border border-indigo-300/15 bg-[#0b0d1a] shadow-[0_35px_140px_rgba(40,30,130,0.3)]">
          {/* Streaming header */}
          <header className="border-b border-white/10 bg-[linear-gradient(110deg,#151950_0%,#24206d_45%,#511c67_100%)] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-xl text-indigo-950">
                    📺
                  </span>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-200">
                      CineVault Television
                    </p>
                    <h1 className="text-2xl font-black">
                      TV Room
                    </h1>
                  </div>
                </div>
              </div>

              <nav className="flex max-w-full gap-2 overflow-x-auto">
                {roomNavigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                      item.label === "TV"
                        ? "bg-white text-indigo-950"
                        : "bg-white/10 text-white/65 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/rooms"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-black text-white/70 hover:bg-white hover:text-indigo-950"
              >
                All Rooms
              </Link>
            </div>
          </header>

          <div className="grid h-[calc(100vh-10.5rem)] min-h-[680px] grid-cols-1 lg:grid-cols-[260px_1fr_280px]">
            {/* Series channels */}
            <aside className="hidden border-r border-white/10 bg-[#101326] lg:block">
              <div className="border-b border-white/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-300">
                  Browse discussions
                </p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Episodes, theories, finales and the shows everyone is watching.
                </p>
              </div>

              <div className="space-y-1 p-3">
                {tvChannels.map((channel) => {
                  const active = channel.slug === selectedChannel.slug;

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinevault/tv?channel=${channel.slug}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                        active
                          ? "bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-400/30"
                          : "text-white/45 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-black/20">
                        {channel.icon}
                      </span>
                      <span># {channel.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/10 p-4 ring-1 ring-white/10">
                <p className="text-xs font-bold text-white/40">
                  Watching as
                </p>
                <p className="mt-1 truncate font-black text-indigo-200">
                  {username}
                </p>
              </div>
            </aside>

            {/* Main TV discussion */}
            <section className="flex min-w-0 flex-col bg-[#090b16]">
              <div className="border-b border-white/10 bg-gradient-to-r from-indigo-950/60 via-[#151329] to-fuchsia-950/30 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300">
                      Currently discussing
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black">
                      {selectedChannel.icon} # {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                    ● Live discussion
                  </span>
                </div>
              </div>

              {/* Mobile channel selector */}
              <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#101326] p-3 lg:hidden">
                {tvChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinevault/tv?channel=${channel.slug}`}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                      channel.slug === selectedChannel.slug
                        ? "bg-indigo-400 text-indigo-950"
                        : "bg-white/[0.07] text-white/55"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="TV Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* TV guide sidebar */}
            <aside className="hidden border-l border-white/10 bg-[#0e1020] p-4 lg:block">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-300">
                Tonight on CineVault
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600/25 to-fuchsia-700/15 p-4 ring-1 ring-indigo-300/15">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-300">
                    Featured topic
                  </p>
                  <h3 className="mt-2 font-black">
                    What series deserves another season?
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    Share the cancelled show you would bring back.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <p className="text-xs font-black text-indigo-200">
                    Episode etiquette
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/40">
                    Use the Spoiler Room when discussing major twists from newly
                    released episodes.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <p className="text-xs font-black text-indigo-200">
                    Community guide
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/40">
                    Keep recommendations friendly and mention the genre before
                    suggesting a series.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}