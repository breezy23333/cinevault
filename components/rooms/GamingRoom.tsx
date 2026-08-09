import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type GamingRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const gamingChannels = [
  {
    slug: "general",
    label: "live-chat",
    icon: "🟣",
    description: "The live community chat for everything happening in gaming.",
  },
  {
    slug: "new-releases",
    label: "new-releases",
    icon: "🚀",
    description: "Discuss newly released and upcoming games.",
  },
  {
    slug: "esports",
    label: "esports-arena",
    icon: "🏆",
    description: "Tournaments, competitive teams, results and esports moments.",
  },
  {
    slug: "multiplayer",
    label: "multiplayer",
    icon: "⚔️",
    description: "Talk multiplayer games, tactics and unforgettable matches.",
  },
  {
    slug: "clips",
    label: "clips-and-highlights",
    icon: "🎥",
    description: "Share gaming highlights, reactions and incredible plays.",
  },
  {
    slug: "reviews",
    label: "game-reviews",
    icon: "⭐",
    description: "Share honest reviews and discuss whether a game is worth buying.",
  },
  {
    slug: "hardware",
    label: "gaming-setup",
    icon: "🖥️",
    description: "Consoles, PCs, accessories and gaming setup discussions.",
  },
  {
    slug: "looking-for-group",
    label: "looking-for-group",
    icon: "🎧",
    description: "Find other CINRYVAN members to play with.",
  },
];

const gameCategories = [
  { name: "Action", icon: "💥", viewers: "1.8K" },
  { name: "Racing", icon: "🏎️", viewers: "942" },
  { name: "Horror", icon: "👻", viewers: "761" },
  { name: "RPG", icon: "🐉", viewers: "1.2K" },
];

export default function GamingRoom({
  userId,
  username,
  activeChannel = "general",
}: GamingRoomProps) {
  const selectedChannel =
    gamingChannels.find((channel) => channel.slug === activeChannel) ||
    gamingChannels[0];

  const roomKey = `cinryvan:gaming:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#08070b] pt-20 text-white">
      <section className="mx-auto max-w-[1750px] px-2 py-3">
        <div className="overflow-hidden rounded-2xl border border-purple-400/15 bg-[#0e0c12] shadow-[0_30px_140px_rgba(104,30,180,0.3)]">
          {/* Gaming broadcast bar */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#18141f] px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500 text-xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                🎮
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
                  CINRYVAN Live
                </p>
                <h1 className="font-black">Gaming Room</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-black uppercase">
                Live
              </span>
              <span className="text-xs font-bold text-white/45">
                Community broadcast
              </span>
            </div>

            <nav className="flex gap-2">
              <Link
                href="/games"
                className="rounded-lg bg-white/[0.07] px-4 py-2 text-xs font-bold text-white/65 hover:bg-purple-500 hover:text-white"
              >
                Browse Games
              </Link>

              <Link
                href="/rooms"
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold text-white/65 hover:border-purple-400 hover:text-purple-300"
              >
                All Rooms
              </Link>
            </nav>
          </header>

          <div className="grid h-[calc(100vh-9.5rem)] min-h-[690px] grid-cols-1 lg:grid-cols-[245px_1fr_300px]">
            {/* Followed gaming channels */}
            <aside className="hidden border-r border-white/10 bg-[#15121a] lg:block">
              <div className="border-b border-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
                  Gaming channels
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  Choose a live discussion.
                </p>
              </div>

              <div className="space-y-1 p-2">
                {gamingChannels.map((channel) => {
                  const active = channel.slug === selectedChannel.slug;

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinryvan/gaming?channel=${channel.slug}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
                        active
                          ? "bg-purple-500/20 text-purple-100"
                          : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="text-base">{channel.icon}</span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {channel.label}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          LIVE
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-4 rounded-xl bg-purple-500/10 p-3 ring-1 ring-purple-400/15">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">
                  Player profile
                </p>
                <p className="mt-2 truncate text-sm font-black text-white">
                  {username}
                </p>
                <p className="mt-1 text-xs text-emerald-400">
                  ● Online
                </p>
              </div>
            </aside>

            {/* Live stream discussion */}
            <section className="flex min-w-0 flex-col bg-[#0d0b10]">
              <div className="border-b border-white/10 bg-[linear-gradient(90deg,#21142f_0%,#120f17_60%,#0d0b10_100%)] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-purple-500 px-2 py-1 text-[10px] font-black uppercase">
                        Featured Chat
                      </span>
                      <span className="text-xs text-red-400">
                        ● Live
                      </span>
                    </div>

                    <h2 className="mt-2 truncate text-xl font-black">
                      {selectedChannel.icon} {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <button className="rounded-lg bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/60">
                      ♡ Follow
                    </button>
                    <button className="rounded-lg bg-purple-500 px-3 py-2 text-xs font-black">
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile channel selector */}
              <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#15121a] p-3 lg:hidden">
                {gamingChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinryvan/gaming?channel=${channel.slug}`}
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${
                      channel.slug === selectedChannel.slug
                        ? "bg-purple-500 text-white"
                        : "bg-white/[0.07] text-white/50"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="Gaming Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* Live category rail */}
            <aside className="hidden border-l border-white/10 bg-[#15121a] p-4 lg:block">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-300">
                  Live categories
                </p>
                <span className="text-xs text-white/30">
                  Viewers
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {gameCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className={`rounded-xl p-4 ring-1 ring-white/10 ${
                      index === 0
                        ? "bg-gradient-to-br from-purple-600/30 to-fuchsia-500/10"
                        : "bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">
                        {category.icon}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        {category.viewers}
                      </span>
                    </div>

                    <p className="mt-3 font-black">
                      {category.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-purple-400/15 bg-purple-500/10 p-4">
                <p className="text-xs font-black text-purple-200">
                  Community rule
                </p>
                <p className="mt-2 text-xs leading-5 text-white/40">
                  Keep competition friendly. No harassment, cheating links or
                  console-war arguments.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}