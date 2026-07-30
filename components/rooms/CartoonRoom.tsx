import Link from "next/link";
import RoomChatClient from "@/components/RoomChatClient";

type CartoonRoomProps = {
  userId: string;
  username: string;
  activeChannel?: string;
};

const cartoonChannels = [
  {
    slug: "general",
    label: "toon-town",
    icon: "🏙️",
    description: "The colourful centre of the CineVault cartoon community.",
  },
  {
    slug: "classics",
    label: "classic-cartoons",
    icon: "📼",
    description: "Celebrate timeless animated shows and nostalgic favourites.",
  },
  {
    slug: "modern",
    label: "modern-animation",
    icon: "✨",
    description: "Discuss today’s best animated series and new releases.",
  },
  {
    slug: "family",
    label: "family-favourites",
    icon: "👨‍👩‍👧",
    description: "Wholesome animated adventures for the whole family.",
  },
  {
    slug: "superheroes",
    label: "animated-heroes",
    icon: "🦸",
    description: "Superheroes, villains and animated comic-book worlds.",
  },
  {
    slug: "comedy",
    label: "cartoon-comedy",
    icon: "😂",
    description: "The funniest characters, episodes and animated moments.",
  },
  {
    slug: "art",
    label: "animation-art",
    icon: "🎨",
    description: "Animation styles, character design and creative techniques.",
  },
  {
    slug: "recommendations",
    label: "recommendations",
    icon: "🌈",
    description: "Find your next cartoon or animated series.",
  },
];

const cartoonCollections = [
  {
    title: "Saturday Morning",
    icon: "🥣",
    colour: "from-yellow-400 to-orange-500",
  },
  {
    title: "Adventure Time",
    icon: "🗺️",
    colour: "from-cyan-400 to-blue-500",
  },
  {
    title: "Comedy Corner",
    icon: "🤣",
    colour: "from-pink-400 to-fuchsia-500",
  },
];

export default function CartoonRoom({
  userId,
  username,
  activeChannel = "general",
}: CartoonRoomProps) {
  const selectedChannel =
    cartoonChannels.find((channel) => channel.slug === activeChannel) ||
    cartoonChannels[0];

  const roomKey = `cinevault:cartoons:${selectedChannel.slug}`;

  return (
    <main className="min-h-screen bg-[#07111d] pt-20 text-white">
      <section className="mx-auto max-w-[1700px] px-3 py-4">
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-yellow-300/70 bg-[#0c1725] shadow-[0_30px_130px_rgba(34,211,238,0.2)]">
          {/* Cartoon title card */}
          <header className="relative overflow-hidden border-b-4 border-[#07111d] bg-[linear-gradient(110deg,#22d3ee_0%,#fde047_45%,#fb7185_100%)] px-6 py-5 text-[#08111d]">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/25" />
            <div className="absolute right-1/4 top-2 h-12 w-12 rotate-12 rounded-xl bg-white/20" />
            <div className="absolute bottom-2 right-10 h-16 w-16 rounded-full border-8 border-white/20" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 -rotate-3 place-items-center rounded-[1.4rem] border-4 border-[#08111d] bg-white text-3xl shadow-[6px_6px_0_#08111d]">
                  🎨
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em]">
                    CineVault Animation
                  </p>
                  <h1 className="mt-1 text-4xl font-black tracking-tight">
                    Cartoon Room!
                  </h1>
                </div>
              </div>

              <div className="rotate-1 rounded-[1.3rem] border-4 border-[#08111d] bg-white px-5 py-3 text-sm font-black shadow-[5px_5px_0_#08111d]">
                💬 Let’s talk cartoons!
              </div>

              <Link
                href="/rooms"
                className="rounded-full border-4 border-[#08111d] bg-[#08111d] px-5 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-white hover:text-[#08111d]"
              >
                Back to Rooms
              </Link>
            </div>
          </header>

          <div className="grid h-[calc(100vh-11rem)] min-h-[690px] grid-cols-1 lg:grid-cols-[270px_1fr_290px]">
            {/* Cartoon channels */}
            <aside className="hidden border-r-4 border-[#07111d] bg-[#102136] lg:block">
              <div className="border-b-4 border-[#07111d] bg-cyan-400 p-4 text-[#07111d]">
                <p className="text-xs font-black uppercase tracking-[0.25em]">
                  Pick a channel
                </p>
              </div>

              <div className="space-y-2 p-3">
                {cartoonChannels.map((channel, index) => {
                  const active = channel.slug === selectedChannel.slug;

                  const inactiveColours = [
                    "hover:bg-yellow-400 hover:text-[#07111d]",
                    "hover:bg-cyan-400 hover:text-[#07111d]",
                    "hover:bg-pink-400 hover:text-[#07111d]",
                  ];

                  return (
                    <Link
                      key={channel.slug}
                      href={`/rooms/cinevault/cartoons?channel=${channel.slug}`}
                      className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-3 text-sm font-black transition ${
                        active
                          ? "border-yellow-300 bg-yellow-300 text-[#07111d] shadow-[4px_4px_0_rgba(250,204,21,0.25)]"
                          : `border-white/10 bg-white/[0.04] text-white/55 ${
                              inactiveColours[index % inactiveColours.length]
                            }`
                      }`}
                    >
                      <span className="text-xl">{channel.icon}</span>
                      <span className="truncate"># {channel.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mx-3 mt-4 rotate-1 rounded-2xl border-2 border-pink-300 bg-pink-400/10 p-4">
                <p className="text-xs font-black uppercase text-pink-300">
                  Toon town citizen
                </p>
                <p className="mt-2 truncate font-black">
                  {username}
                </p>
              </div>
            </aside>

            {/* Cartoon conversation */}
            <section className="flex min-w-0 flex-col bg-[#0b1828]">
              <div className="border-b-4 border-[#07111d] bg-[#102136] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-pink-400 px-3 py-1 text-[10px] font-black uppercase text-[#07111d]">
                      New episode
                    </span>

                    <h2 className="mt-2 truncate text-2xl font-black text-yellow-300">
                      {selectedChannel.icon} # {selectedChannel.label}
                    </h2>

                    <p className="mt-1 truncate text-xs text-white/45">
                      {selectedChannel.description}
                    </p>
                  </div>

                  <Link
                    href="/cartoons"
                    className="shrink-0 rounded-2xl border-2 border-cyan-300 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-200 hover:bg-cyan-300 hover:text-[#07111d]"
                  >
                    Browse Cartoons
                  </Link>
                </div>
              </div>

              {/* Speech-bubble prompt */}
              <div className="border-b-4 border-[#07111d] bg-yellow-300 px-5 py-3 text-[#07111d]">
                <p className="text-xs font-black">
                  💭 TODAY’S QUESTION: Which cartoon character would be the best
                  roommate?
                </p>
              </div>

              {/* Mobile channels */}
              <div className="flex gap-2 overflow-x-auto border-b-4 border-[#07111d] bg-[#102136] p-3 lg:hidden">
                {cartoonChannels.map((channel) => (
                  <Link
                    key={channel.slug}
                    href={`/rooms/cinevault/cartoons?channel=${channel.slug}`}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${
                      channel.slug === selectedChannel.slug
                        ? "bg-yellow-300 text-[#07111d]"
                        : "bg-white/[0.07] text-white/50"
                    }`}
                  >
                    {channel.icon} {channel.label}
                  </Link>
                ))}
              </div>

              <RoomChatClient
                title="Cartoon Room"
                roomKey={roomKey}
                userId={userId}
                username={username}
              />
            </section>

            {/* Animated collections */}
            <aside className="hidden border-l-4 border-[#07111d] bg-[#102136] p-4 lg:block">
              <div className="rounded-2xl border-2 border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Featured collections
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {cartoonCollections.map((collection) => (
                  <div
                    key={collection.title}
                    className="overflow-hidden rounded-2xl border-2 border-white/10 bg-[#0b1828]"
                  >
                    <div
                      className={`grid h-20 place-items-center bg-gradient-to-r ${collection.colour} text-3xl`}
                    >
                      {collection.icon}
                    </div>

                    <div className="p-3">
                      <p className="font-black">
                        {collection.title}
                      </p>
                      <p className="mt-1 text-xs text-white/35">
                        Join discussion →
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 -rotate-1 rounded-2xl border-2 border-yellow-300 bg-yellow-300 p-4 text-[#07111d] shadow-[5px_5px_0_#fb7185]">
                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  Toon Town Rules
                </p>

                <ul className="mt-3 space-y-2 text-xs font-bold leading-5">
                  <li>• Keep discussions fun and welcoming.</li>
                  <li>• Use Spoiler Room for major story reveals.</li>
                  <li>• Respect classic and modern animation fans.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}