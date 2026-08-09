import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type AnimeRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const animeChannels = [
  {
    slug: "general",
    label: "anime-hub",
    icon: "⛩️",
    description: "The central community for every kind of anime fan.",
  },
  {
    slug: "currently-watching",
    label: "currently-watching",
    icon: "📺",
    description: "Share the anime series you are watching right now.",
  },
  {
    slug: "recommendations",
    label: "recommendations",
    icon: "🌸",
    description: "Discover new anime based on your favourite genres.",
  },
  {
    slug: "shonen",
    label: "shonen-arena",
    icon: "⚔️",
    description: "Battles, rivalries, power systems and legendary heroes.",
  },
  {
    slug: "manga",
    label: "manga-corner",
    icon: "📖",
    description: "Manga chapters, adaptations and reading recommendations.",
  },
  {
    slug: "theories",
    label: "fan-theories",
    icon: "🧠",
    description: "Hidden details, predictions and anime story theories.",
  },
  {
    slug: "cosplay",
    label: "cosplay-and-art",
    icon: "🎨",
    description: "Celebrate cosplay, fan art and anime-inspired creativity.",
  },
  {
    slug: "music",
    label: "openings-and-music",
    icon: "🎵",
    description: "Favourite openings, endings, soundtracks and composers.",
  },
];

const trendingTopics = [
  { number: "01", name: "Best anime opening", glow: "from-pink-500 to-fuchsia-500" },
  { number: "02", name: "Most powerful rival", glow: "from-cyan-400 to-blue-500" },
  { number: "03", name: "Underrated series", glow: "from-violet-500 to-purple-600" },
];

export default function AnimeRoom({
  userId,
  username,
  activeChannel = "general",
}: AnimeRoomProps) {
  const selectedChannel =
    animeChannels.find((channel) => channel.slug === activeChannel) ||
    animeChannels[0];

  const roomKey = `cinryvan:anime:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#06040d] pt-20 text-white">
      <section className="mx-auto max-w-[1700px] px-3 py-4">
        <div className="overflow-hidden rounded-[2rem] border border-pink-400/20 bg-[#0b0714] shadow-[0_35px_150px_rgba(236,72,153,0.22)]">
          {/* Neon anime banner */}
          <header className="relative overflow-hidden border-b border-pink-300/15 bg-[linear-gradient(110deg,#260b3d_0%,#37105b_45%,#071d35_100%)] px-5 py-5">
            <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute left-1/3 top-0 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-400 text-2xl shadow-[0_0_35px_rgba(34,211,238,0.25)]">
                  桜
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
                    CINRYVAN Anime District
                  </p>
                  <h1 className="mt-1 text-3xl font-black">
                    Anime Room
                  </h1>
                </div>
              </div>

              <div className="rounded-full border border-pink-300/20 bg-black/20 px-4 py-2 text-xs font-black text-pink-200 backdrop-blur">
                ✦ Fans online worldwide
              </div>

              <Link
                href="/rooms"
                className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-200 hover:bg-cyan-300 hover:text-[#07101b]"
              >
                Explore Rooms
              </Link>
            </div>
          </header>

          <div className="grid h-[calc(100vh-10.5rem)] min-h-[690px] grid-cols-1 lg:grid-cols-[260px_1fr_290px]">
            {/* Anime districts */}
            <aside className="hidden border-r border-pink-300/10 bg-[#100a1c] lg:block">
              <div className="border-b border-pink-300/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-pink-300">
                  Anime districts
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  Choose your community channel.
                </p>
              </div>

              <div className="space-y-1 p-2">
                {animeChannels.map((channel) => {
                  const active = channel.slug === selectedChannel.slug;

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinryvan/anime?channel=${channel.slug}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                        active
                          ? "bg-gradient-to-r from-pink-500/20 to-cyan-400/10 text-pink-100 ring-1 ring-pink-400/25"
                          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-black/25">
                        {channel.icon}
                      </span>
                      <span className="truncate text-sm font-bold">
                        # {channel.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  Community member
                </p>
                <p className="mt-2 truncate font-black text-pink-200">
                  {username}
                </p>
                <p className="mt-1 text-xs text-white/30">
                  Anime fan
                </p>
              </div>
            </aside>

            {/* Anime conversation */}
            <section className="flex min-w-0 flex-col bg-[linear-gradient(180deg,#0c0715_0%,#08060f_100%)]">
              <div className="border-b border-pink-300/10 bg-black/20 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                      Live anime community
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black text-pink-100">
                      {selectedChannel.icon} # {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <Link
                    href="/anime"
                    className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-4 py-2 text-xs font-black text-white hover:from-cyan-400 hover:to-blue-500"
                  >
                    Browse Anime
                  </Link>
                </div>
              </div>

              {/* Seasonal prompt */}
              <div className="border-b border-cyan-300/10 bg-cyan-400/[0.04] px-5 py-3">
                <p className="text-xs leading-5 text-white/45">
                  <span className="font-black text-cyan-300">
                    Today’s prompt:
                  </span>{" "}
                  Which anime deserves a faithful remake or another season?
                </p>
              </div>

              {/* Mobile districts */}
              <div className="flex gap-2 overflow-x-auto border-b border-pink-300/10 p-3 lg:hidden">
                {animeChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinryvan/anime?channel=${channel.slug}`}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                      channel.slug === selectedChannel.slug
                        ? "bg-pink-500 text-white"
                        : "bg-white/[0.06] text-white/45"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="Anime Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* Trending anime topics */}
            <aside className="hidden border-l border-pink-300/10 bg-[#100a1c] p-4 lg:block">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Trending in the district
              </p>

              <div className="mt-4 space-y-3">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.number}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 hover:border-pink-400/30"
                  >
                    <div
                      className={`inline-flex rounded-lg bg-gradient-to-r ${topic.glow} px-2 py-1 text-[10px] font-black`}
                    >
                      RANK {topic.number}
                    </div>

                    <p className="mt-3 font-black">
                      {topic.name}
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      Join the conversation →
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-pink-500/15 to-cyan-400/10 p-4 ring-1 ring-pink-300/15">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-200">
                  Anime etiquette
                </p>

                <ul className="mt-3 space-y-2 text-xs leading-5 text-white/40">
                  <li>• Use the Spoiler Room for major plot reveals.</li>
                  <li>• Respect different genres and fan communities.</li>
                  <li>• Credit artists when sharing creative work.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}