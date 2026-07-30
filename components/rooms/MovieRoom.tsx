import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type MovieRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const movieChannels = [
  {
    slug: "general",
    label: "the-lobby",
    description: "Meet movie fans and discuss anything from the world of cinema.",
    icon: "🎟️",
  },
  {
    slug: "new-releases",
    label: "new-releases",
    description: "Discuss the newest theatrical and streaming releases.",
    icon: "🍿",
  },
  {
    slug: "recommendations",
    label: "recommendations",
    description: "Find your next movie and share your favourite discoveries.",
    icon: "⭐",
  },
  {
    slug: "classics",
    label: "cinema-classics",
    description: "Celebrate timeless films, legendary stars and iconic directors.",
    icon: "🎞️",
  },
  {
    slug: "horror",
    label: "horror-vault",
    description: "Enter the darker side of cinema and discuss horror favourites.",
    icon: "🩸",
  },
  {
    slug: "trailers",
    label: "trailers",
    description: "Watch and react to newly released movie trailers.",
    icon: "▶️",
  },
  {
    slug: "reviews",
    label: "reviews",
    description: "Share spoiler-free reviews and honest movie ratings.",
    icon: "✍️",
  },
  {
    slug: "watch-party",
    label: "watch-party",
    description: "Plan community movie nights and live reactions.",
    icon: "📽️",
  },
];

const roomLinks = [
  { icon: "CV", href: "/rooms", label: "All rooms" },
  { icon: "🎬", href: "/rooms/cinevault/movie", label: "Movies" },
  { icon: "📺", href: "/rooms/cinevault/tv", label: "TV" },
  { icon: "⚡", href: "/rooms/cinevault/anime", label: "Anime" },
  { icon: "🎨", href: "/rooms/cinevault/cartoons", label: "Cartoons" },
  { icon: "🔥", href: "/rooms/cinevault/spoilers", label: "Spoilers" },
  { icon: "📰", href: "/rooms/cinevault/news", label: "News" },
  { icon: "🎮", href: "/rooms/cinevault/gaming", label: "Gaming" },
];

export default function MovieRoom({
  userId,
  username,
  activeChannel = "general",
}: MovieRoomProps) {
  const selectedChannel =
    movieChannels.find((channel) => channel.slug === activeChannel) ||
    movieChannels[0];

  const roomKey = `cinevault:movie:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#4a1118_0%,#11090b_38%,#050505_72%)] pt-20 text-white">
      <section className="mx-auto max-w-[1600px] px-3 py-4">
        <div className="overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[#0b090a] shadow-[0_35px_140px_rgba(75,0,12,0.45)]">
          <div className="grid h-[calc(100vh-7rem)] min-h-[680px] grid-cols-1 lg:grid-cols-[76px_270px_1fr]">
            {/* Room navigation */}
            <aside className="hidden border-r border-amber-300/10 bg-black/50 p-3 lg:block">
              <div className="space-y-3">
                {roomLinks.map((item) => {
                  const active = item.label === "Movies";

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      title={item.label}
                      className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-black transition ${
                        active
                          ? "bg-gradient-to-br from-red-700 to-amber-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.28)]"
                          : "bg-white/[0.06] text-white/65 hover:bg-amber-400 hover:text-black"
                      }`}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Movie channels */}
            <aside className="relative hidden border-r border-amber-300/10 bg-[#130d0f] lg:block">
              <div className="border-b border-amber-300/10 bg-gradient-to-b from-red-950/70 to-transparent p-5">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">
                  CineVault Cinema
                </p>

                <h1 className="mt-3 text-2xl font-black">
                  Movie Room
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  A private screening lounge for people who live and breathe
                  movies.
                </p>
              </div>

              <div className="p-3">
                <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-100/35">
                  Cinema Channels
                </p>

                <div className="space-y-1">
                  {movieChannels.map((channel) => {
                    const active = channel.slug === selectedChannel.slug;

                    return (
                      <Link
                        key={channel.slug}
                        href={`/rooms/cinevault/movie?channel=${channel.slug}`}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                          active
                            ? "bg-gradient-to-r from-red-800/80 to-amber-500/20 text-amber-200 ring-1 ring-amber-400/25"
                            : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span>{channel.icon}</span>
                        <span># {channel.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="absolute inset-x-3 bottom-4 rounded-2xl border border-amber-300/10 bg-black/35 p-3">
                <p className="text-xs font-bold text-white/35">
                  Cinema member
                </p>
                <p className="mt-1 truncate font-black text-amber-300">
                  {username}
                </p>
              </div>
            </aside>

            {/* Live movie chat */}
            <section className="flex min-w-0 flex-col bg-[linear-gradient(180deg,#120d0f_0%,#090809_100%)]">
              <div className="border-b border-amber-300/10 bg-black/25 px-5 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-red-700/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-200 ring-1 ring-red-400/20">
                        Now Showing
                      </span>

                      <span className="text-xs text-emerald-400">
                        ● Live
                      </span>
                    </div>

                    <h2 className="mt-2 truncate text-xl font-black text-amber-100">
                      {selectedChannel.icon} # {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <Link
                    href="/rooms"
                    className="shrink-0 rounded-full border border-amber-300/15 px-4 py-2 text-xs font-black text-white/65 transition hover:border-amber-400 hover:text-amber-300"
                  >
                    Exit Cinema
                  </Link>
                </div>
              </div>

              {/* Mobile channel selector */}
              <div className="flex gap-2 overflow-x-auto border-b border-amber-300/10 bg-black/20 p-3 lg:hidden">
                {movieChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinevault/movie?channel=${channel.slug}`}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                      channel.slug === selectedChannel.slug
                        ? "bg-amber-400 text-black"
                        : "bg-white/[0.06] text-white/55"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="Movie Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}