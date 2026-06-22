import type { Metadata } from "next";
import Link from "next/link";

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

export default async function RoomPage({ params }: PageProps) {
  const { platform, room } = await params;
  const title = roomNames[room] || room;

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
      <section className="mx-auto max-w-6xl">
        <Link href="/rooms" className="text-sm font-bold text-yellow-300">
          ← Back to Rooms
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b101b]">
          <div className="border-b border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
              {platform} live room
            </p>
            <h1 className="mt-2 text-4xl font-black">{title}</h1>
            <p className="mt-2 text-white/50">
              Chat interface placeholder. Real messages can be connected to Neon later.
            </p>
          </div>

          <div className="space-y-4 p-6">
            {[
              ["CineVault", `Welcome to the ${title}. What are you watching?`],
              ["MovieFan", "Any good recommendation for tonight?"],
              ["VaultUser", "This room is going to be powerful when real chat is connected."],
            ].map(([name, text]) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <p className="font-black text-yellow-300">{name}</p>
                <p className="mt-2 text-sm text-white/70">{text}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 bg-black/25 p-4">
            <div className="flex gap-3">
              <input
                disabled
                placeholder="Login required to send messages"
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-white/50 outline-none"
              />
              <button
                disabled
                className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}