import type { Metadata } from "next";
import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

export const metadata: Metadata = {
  title: "CineVault Room | Chat",
  description: "Private CineVault chat room.",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{ platform: string; room: string }>;
};

const roomNames: Record<string, string> = {
  movie: "Movie Room",
  tv: "TV Room",
  anime: "Anime Room",
  cartoons: "Cartoon Room",
  spoilers: "Spoiler Room",
  news: "News Room",
  gaming: "Gaming Room",
};

const channels = [
  "general",
  "recommendations",
  "trailers",
  "reviews",
  "watch-party",
  "spoilers",
  "off-topic",
];

const members = [
  "CineVault",
  "MovieFan",
  "AnimeVault",
  "VaultUser",
  "TrailerHunter",
  "SeriesKing",
  "CartoonFan",
];

export default async function RoomPage({ params }: PageProps) {
  const { platform, room } = await params;
  const title = roomNames[room] || room;

  return (
    <main className="min-h-screen bg-[#05070d] pt-20 text-white">
      <section className="mx-auto max-w-[1600px] px-3 py-4">
       <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#10141f] shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
          <div className="grid h-[calc(100vh-7rem)] min-h-[680px] grid-cols-1 lg:grid-cols-[72px_240px_1fr_260px]">
            
            {/* Server Icons */}
            <aside className="hidden border-r border-white/10 bg-[#080b12] p-3 lg:block">
              <div className="space-y-3">
                {["CV", "🎬", "📺", "⚡", "🎨", "🔥", "🎮"].map((icon, i) => (
                  <Link
                    key={i}
                    href={
                      i === 0
                        ? "/rooms"
                        : [
                            "/rooms/cinevault/movie",
                            "/rooms/cinevault/tv",
                            "/rooms/cinevault/anime",
                            "/rooms/cinevault/cartoons",
                            "/rooms/cinevault/spoilers",
                            "/rooms/cinevault/gaming",
                          ][i - 1]
                    }
                    className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-black transition ${
                      i === 0
                        ? "bg-yellow-400 text-black"
                        : "bg-white/[0.07] hover:bg-yellow-400 hover:text-black"
                    }`}
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </aside>

            {/* Channels */}
            <aside className="hidden border-r border-white/10 bg-[#111722] lg:block">
              <div className="border-b border-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300">
                  CineVault
                </p>
                <h1 className="mt-2 text-xl font-black">{title}</h1>
                <p className="mt-1 text-xs text-white/40">
                  Platform: {platform}
                </p>
              </div>

              <div className="p-3">
                <p className="px-2 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/35">
                  Text Channels
                </p>

                <div className="space-y-1">
                  {channels.map((channel, index) => (
                    <button
                      key={channel}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
                        index === 0
                          ? "bg-white/[0.1] text-white"
                          : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      # {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 ml-3 w-[216px] rounded-2xl border border-white/10 bg-black/25 p-3">
                <p className="text-xs font-bold text-white/40">Signed in as</p>
                <p className="mt-1 font-black text-yellow-300">Guest</p>
              </div>
            </aside>

            {/* Chat */}
            <section className="flex min-w-0 flex-col bg-[#0d111b]">
              <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111722] px-5">
                <div>
                  <h2 className="font-black"># general</h2>
                  <p className="text-xs text-white/40">
                    Chat about {title.toLowerCase()} recommendations and reactions.
                  </p>
                </div>

                <Link
                  href="/rooms"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/70 hover:border-yellow-400/60 hover:text-yellow-300"
                >
                  Back to Rooms
                </Link>
              </header>

              <RoomChatClient title={title} />
            </section>

            {/* Members */}
            <aside className="hidden border-l border-white/10 bg-[#111722] p-4 lg:block">      
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">
                Online
              </p>

              <div className="mt-4 space-y-3">
                {members.map((member, index) => (
                  <div key={member} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08] font-black text-yellow-300">
                        {member.slice(0, 1)}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111722] ${
                          index < 5 ? "bg-emerald-400" : "bg-zinc-500"
                        }`}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white/75">{member}</p>
                      <p className="text-xs text-white/30">
                        {index < 2 ? "Watching trailers" : "Online"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                <p className="font-black text-yellow-300">Room Rules</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-white/55">
                  <li>• Be respectful</li>
                  <li>• Use spoiler room for spoilers</li>
                  <li>• No spam</li>
                  <li>• Keep it entertainment focused</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}