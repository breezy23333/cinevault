import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type SpoilerRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const spoilerChannels = [
  {
    slug: "general",
    label: "spoiler-feed",
    icon: "⚠️",
    description: "The main feed for unrestricted spoiler discussions.",
  },
  {
    slug: "movies",
    label: "movie-spoilers",
    icon: "🎬",
    description: "Movie endings, twists, deaths and post-credit scenes.",
  },
  {
    slug: "tv",
    label: "tv-spoilers",
    icon: "📺",
    description: "Episode revelations, finales and future-season theories.",
  },
  {
    slug: "anime",
    label: "anime-spoilers",
    icon: "⚡",
    description: "Anime and manga plot developments without restrictions.",
  },
  {
    slug: "gaming",
    label: "game-spoilers",
    icon: "🎮",
    description: "Game endings, secret bosses and major story choices.",
  },
  {
    slug: "theories",
    label: "theories",
    icon: "🧠",
    description: "Predictions, hidden clues and alternate explanations.",
  },
  {
    slug: "endings",
    label: "ending-explained",
    icon: "🔍",
    description: "Break down confusing endings and unresolved mysteries.",
  },
];

const trendingThreads = [
  {
    rank: "01",
    title: "Which ending changed the entire story?",
    replies: "86 replies",
  },
  {
    rank: "02",
    title: "Best plot twist you never predicted",
    replies: "54 replies",
  },
  {
    rank: "03",
    title: "Characters who deserved a different ending",
    replies: "41 replies",
  },
];

export default function SpoilerRoom({
  userId,
  username,
  activeChannel = "general",
}: SpoilerRoomProps) {
  const selectedChannel =
    spoilerChannels.find((channel) => channel.slug === activeChannel) ||
    spoilerChannels[0];

  const roomKey = `cinevault:spoilers:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#050505] pt-20 text-white">
      <section className="mx-auto max-w-[1650px] px-3 py-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_140px_rgba(255,55,30,0.12)]">
          {/* Social-feed header */}
          <header className="border-b border-white/10 bg-black px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-orange-500 text-xl text-black">
                  !
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                    Unfiltered Discussions
                  </p>
                  <h1 className="text-xl font-black">
                    Spoiler Room
                  </h1>
                </div>
              </div>

              <div className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-black text-red-300">
                ⚠ Everything beyond this point may contain spoilers
              </div>

              <Link
                href="/rooms"
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/60 hover:border-orange-400 hover:text-orange-300"
              >
                Leave feed
              </Link>
            </div>
          </header>

          <div className="grid h-[calc(100vh-9rem)] min-h-[690px] grid-cols-1 lg:grid-cols-[245px_1fr_310px]">
            {/* Communities */}
            <aside className="hidden border-r border-white/10 bg-[#080808] lg:block">
              <div className="border-b border-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                  Spoiler communities
                </p>
              </div>

              <div className="space-y-1 p-2">
                {spoilerChannels.map((channel) => {
                  const active = channel.slug === selectedChannel.slug;

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinevault/spoilers?channel=${channel.slug}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                        active
                          ? "bg-orange-500/15 text-orange-200 ring-1 ring-orange-400/20"
                          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.07]">
                        {channel.icon}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          c/{channel.label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/25">
                          Open discussion
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-black text-orange-300">
                  Posting as
                </p>
                <p className="mt-2 truncate text-sm font-bold">
                  @{username}
                </p>
              </div>
            </aside>

            {/* Main discussion feed */}
            <section className="flex min-w-0 flex-col bg-[#050505]">
              <div className="border-b border-white/10 bg-[#080808] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                      Active community
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black">
                      {selectedChannel.icon} c/{selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/35">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black text-black hover:bg-orange-300"
                  >
                    + New discussion
                  </button>
                </div>
              </div>

              {/* Pinned spoiler warning */}
              <div className="border-b border-red-400/15 bg-red-500/[0.07] px-5 py-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🚨</span>
                  <div>
                    <p className="text-xs font-black text-red-200">
                      Spoiler warning
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      This room allows full plot details. Mention the title before
                      revealing a major twist.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile communities */}
              <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3 lg:hidden">
                {spoilerChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinevault/spoilers?channel=${channel.slug}`}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                      channel.slug === selectedChannel.slug
                        ? "bg-orange-500 text-black"
                        : "bg-white/[0.06] text-white/45"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="Spoiler Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* Trending feed */}
            <aside className="hidden border-l border-white/10 bg-[#080808] p-4 lg:block">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
                Trending spoilers
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                {trendingThreads.map((thread) => (
                  <div
                    key={thread.rank}
                    className="border-b border-white/10 p-4 last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <div className="flex gap-3">
                      <span className="text-xs font-black text-orange-400">
                        {thread.rank}
                      </span>

                      <div>
                        <p className="text-sm font-bold leading-5">
                          {thread.title}
                        </p>
                        <p className="mt-2 text-xs text-white/30">
                          {thread.replies}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-orange-400/15 bg-orange-500/[0.06] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                  Feed rules
                </p>

                <ul className="mt-3 space-y-2 text-xs leading-5 text-white/40">
                  <li>• Name the movie, series, anime or game first.</li>
                  <li>• No personal attacks over different theories.</li>
                  <li>• Don’t post spoilers in other CineVault rooms.</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                <button
                  type="button"
                  className="text-sm font-black text-orange-300"
                >
                  ▲ Upvote
                </button>

                <button
                  type="button"
                  className="text-sm font-black text-white/40"
                >
                  Share
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}