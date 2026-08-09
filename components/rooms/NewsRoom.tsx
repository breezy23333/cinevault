import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type NewsRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const newsChannels = [
  {
    slug: "general",
    label: "news-desk",
    icon: "📰",
    description: "The central desk for breaking entertainment stories.",
  },
  {
    slug: "entertainment",
    label: "entertainment",
    icon: "🎬",
    description: "Movie, television and celebrity entertainment updates.",
  },
  {
    slug: "casting",
    label: "casting-news",
    icon: "🎭",
    description: "Casting announcements, directors and production developments.",
  },
  {
    slug: "trailers",
    label: "trailers",
    icon: "▶️",
    description: "New trailers, teasers and first-look reactions.",
  },
  {
    slug: "box-office",
    label: "box-office",
    icon: "💰",
    description: "Weekend results, records, budgets and theatrical performance.",
  },
  {
    slug: "gaming",
    label: "gaming-news",
    icon: "🎮",
    description: "Game announcements, studio news and industry updates.",
  },
  {
    slug: "sports",
    label: "sports-news",
    icon: "🏆",
    description: "Major sports headlines, events and community reactions.",
  },
];

const latestHeadlines = [
  {
    category: "BREAKING",
    title: "Which upcoming release are audiences underestimating?",
    time: "Live discussion",
  },
  {
    category: "CASTING",
    title: "The most surprising casting announcement this year",
    time: "Community desk",
  },
  {
    category: "BOX OFFICE",
    title: "What makes a theatrical release successful today?",
    time: "Analysis",
  },
];

export default function NewsRoom({
  userId,
  username,
  activeChannel = "general",
}: NewsRoomProps) {
  const selectedChannel =
    newsChannels.find((channel) => channel.slug === activeChannel) ||
    newsChannels[0];

  const roomKey = `cinryvan:news:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#050b12] pt-20 text-white">
      <section className="mx-auto max-w-[1700px] px-3 py-4">
        <div className="overflow-hidden rounded-xl border border-slate-400/15 bg-[#08111c] shadow-[0_30px_130px_rgba(0,45,90,0.25)]">
          {/* News masthead */}
          <header className="border-b border-white/10 bg-[#07101a]">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="border-r-4 border-red-600 pr-4">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-red-400">
                    CINRYVAN
                  </p>
                  <h1 className="text-2xl font-black uppercase tracking-tight">
                    Newsroom
                  </h1>
                </div>

                <p className="hidden max-w-xs text-xs leading-5 text-white/35 md:block">
                  Live entertainment, gaming and sports conversations from the
                  CINRYVAN community.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-sm bg-red-600 px-3 py-1.5 text-xs font-black uppercase">
                  Live
                </span>
                <span className="text-xs font-bold text-white/45">
                  News desk online
                </span>
              </div>

              <Link
                href="/rooms"
                className="border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white/65 hover:border-red-500 hover:text-red-300"
              >
                All Rooms
              </Link>
            </div>

            {/* Breaking ticker */}
            <div className="flex items-center overflow-hidden border-t border-white/10 bg-white text-black">
              <span className="shrink-0 bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                Breaking
              </span>

              <p className="animate-pulse whitespace-nowrap px-5 py-2 text-xs font-bold">
                CINRYVAN community discussions are live • Share verified sources
                • React to new trailers, casting updates and release announcements
              </p>
            </div>
          </header>

          <div className="grid h-[calc(100vh-11rem)] min-h-[680px] grid-cols-1 lg:grid-cols-[250px_1fr_330px]">
            {/* News departments */}
            <aside className="hidden border-r border-white/10 bg-[#0b1623] lg:block">
              <div className="border-b border-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                  Departments
                </p>
              </div>

              <div className="space-y-1 p-2">
                {newsChannels.map((channel) => {
                  const active = channel.slug === selectedChannel.slug;

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinryvan/news?channel=${channel.slug}`}
                      className={`flex items-center gap-3 border-l-2 px-3 py-3 transition ${
                        active
                          ? "border-red-500 bg-white/[0.07] text-white"
                          : "border-transparent text-white/45 hover:border-sky-500 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{channel.icon}</span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase tracking-wide">
                          {channel.label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/25">
                          Open desk
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-5 border border-sky-400/15 bg-sky-500/[0.06] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                  Community reporter
                </p>
                <p className="mt-2 truncate font-black">
                  {username}
                </p>
              </div>
            </aside>

            {/* Discussion desk */}
            <section className="flex min-w-0 flex-col bg-[#07101a]">
              <div className="border-b border-white/10 bg-[#0a1521] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-400">
                      Live newsroom desk
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black uppercase tracking-tight">
                      {selectedChannel.icon} {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <Link
                    href="/news"
                    className="shrink-0 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-black hover:bg-red-500 hover:text-white"
                  >
                    Read CINRYVAN News
                  </Link>
                </div>
              </div>

              {/* Editorial notice */}
              <div className="border-b border-sky-300/10 bg-sky-500/[0.05] px-5 py-3">
                <p className="text-xs leading-5 text-white/45">
                  <span className="font-black text-sky-300">
                    Editorial standard:
                  </span>{" "}
                  Separate confirmed information from rumours and include a source
                  when sharing breaking news.
                </p>
              </div>

              {/* Mobile departments */}
              <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#0b1623] p-3 lg:hidden">
                {newsChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinryvan/news?channel=${channel.slug}`}
                    className={`shrink-0 px-3 py-2 text-xs font-black uppercase ${
                      channel.slug === selectedChannel.slug
                        ? "bg-red-600 text-white"
                        : "bg-white/[0.07] text-white/45"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="News Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* Headlines rail */}
            <aside className="hidden border-l border-white/10 bg-[#0b1623] p-4 lg:block">
              <div className="flex items-end justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                    Latest
                  </p>
                  <h3 className="mt-1 text-xl font-black uppercase">
                    Headlines
                  </h3>
                </div>

                <span className="text-xs text-white/30">
                  Live
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {latestHeadlines.map((headline) => (
                  <article key={headline.title} className="py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                      {headline.category}
                    </p>
                    <h4 className="mt-2 text-sm font-black leading-6">
                      {headline.title}
                    </h4>
                    <p className="mt-2 text-xs text-white/30">
                      {headline.time}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-4 border-t-4 border-red-600 bg-white p-4 text-black">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Newsroom prompt
                </p>
                <p className="mt-2 text-sm font-black leading-6">
                  What entertainment story deserves more attention today?
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}