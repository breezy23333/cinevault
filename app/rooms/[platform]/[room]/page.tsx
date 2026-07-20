import type { Metadata } from "next";
import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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


export default async function RoomPage({ params }: PageProps) {
  const { platform, room } = await params;

  if (platform !== "cinevault" || !roomNames[room]) {
    notFound();
  }

  const cookieStore = await cookies();

  const userId =
    cookieStore.get("cinevault_user_id")?.value ||
    cookieStore.get("cinevault_user")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const title = roomNames[room];
  const username = (
    user.name ||
    user.email?.split("@")[0] ||
    "CineVault Member"
  )
    .trim()
    .slice(0, 40);

  const roomKey = `${platform}:${room}:general`;

  return (
    <main className="min-h-screen bg-[#05070d] pt-20 text-white">
      <section className="mx-auto max-w-[1600px] px-3 py-4">
       <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#10141f] shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
          <div className="grid h-[calc(100vh-7rem)] min-h-[680px] grid-cols-1 lg:grid-cols-[72px_240px_1fr]">
            
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
                <p className="mt-1 font-black text-yellow-300">
                  {username}
                </p>
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

              <RoomChatClient
                title={title}
                roomKey={roomKey}
                userId={user.id}
                username={username}
              /> 
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}