"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const rooms = [
  {
    icon: "🎬",
    eyebrow: "Premium Cinema",
    title: "Movie Room",
    text: "Enter a premium screening lounge for new releases, classics, horror, reviews, trailers and community watch parties.",
    href: "/rooms/cinryvan/movie",
    background:
      "from-[#4a0d16] via-[#170b0e] to-[#050505]",
    accent: "bg-amber-400 text-black hover:bg-amber-300",
    accentText: "text-amber-300",
    border: "border-amber-400/25",
    glow: "shadow-[0_35px_120px_rgba(180,60,20,0.3)]",
    channels: ["the-lobby", "new-releases", "cinema-classics", "horror-vault"],
  },
  {
    icon: "📺",
    eyebrow: "Streaming Community",
    title: "TV Room",
    text: "Discuss episodes, season finales, fan theories, reality television and the shows everyone is binge-watching.",
    href: "/rooms/cinryvan/tv",
    background:
      "from-[#171958] via-[#201442] to-[#080913]",
    accent: "bg-indigo-300 text-indigo-950 hover:bg-white",
    accentText: "text-indigo-200",
    border: "border-indigo-300/25",
    glow: "shadow-[0_35px_120px_rgba(79,70,229,0.28)]",
    channels: ["series-lounge", "latest-episodes", "season-finales", "fan-theories"],
  },
  {
    icon: "⚡",
    eyebrow: "Neon Anime District",
    title: "Anime Room",
    text: "Join anime fans discussing current series, manga, shonen battles, theories, openings, cosplay and recommendations.",
    href: "/rooms/cinryvan/anime",
    background:
      "from-[#43105e] via-[#180b36] to-[#06243b]",
    accent: "bg-pink-400 text-[#170522] hover:bg-cyan-300",
    accentText: "text-cyan-300",
    border: "border-pink-400/25",
    glow: "shadow-[0_35px_120px_rgba(236,72,153,0.25)]",
    channels: ["anime-hub", "currently-watching", "shonen-arena", "manga-corner"],
  },
  {
    icon: "🎨",
    eyebrow: "Animated Toon Town",
    title: "Cartoon Room",
    text: "A colourful home for animated classics, modern cartoons, family favourites, comedy and creative animation.",
    href: "/rooms/cinryvan/cartoons",
    background:
      "from-[#0891b2] via-[#172554] to-[#db2777]",
    accent: "bg-yellow-300 text-[#07111d] hover:bg-white",
    accentText: "text-yellow-300",
    border: "border-yellow-300/35",
    glow: "shadow-[0_35px_120px_rgba(34,211,238,0.22)]",
    channels: ["toon-town", "classic-cartoons", "modern-animation", "cartoon-comedy"],
  },
  {
    icon: "🔥",
    eyebrow: "Unfiltered Discussion",
    title: "Spoiler Room",
    text: "A warning-marked social feed for endings, plot twists, theories, hidden clues and unrestricted story discussions.",
    href: "/rooms/cinryvan/spoilers",
    background:
      "from-[#3c0b06] via-[#120706] to-[#030303]",
    accent: "bg-orange-500 text-black hover:bg-orange-300",
    accentText: "text-orange-300",
    border: "border-orange-400/25",
    glow: "shadow-[0_35px_120px_rgba(249,115,22,0.22)]",
    channels: ["spoiler-feed", "movie-spoilers", "tv-spoilers", "ending-explained"],
  },
  {
    icon: "📰",
    eyebrow: "Live News Desk",
    title: "News Room",
    text: "React to breaking entertainment stories, casting news, trailers, box-office results, gaming and sports updates.",
    href: "/rooms/cinryvan/news",
    background:
      "from-[#0b3a5b] via-[#071827] to-[#140608]",
    accent: "bg-red-600 text-white hover:bg-white hover:text-black",
    accentText: "text-sky-300",
    border: "border-sky-300/25",
    glow: "shadow-[0_35px_120px_rgba(14,116,144,0.25)]",
    channels: ["news-desk", "entertainment", "casting-news", "box-office"],
  },
  {
    icon: "🎮",
    eyebrow: "CINRYVAN Live",
    title: "Gaming Room",
    text: "A livestream-inspired space for new games, esports, multiplayer, reviews, clips, hardware and finding teammates.",
    href: "/rooms/cinryvan/gaming",
    background:
      "from-[#4c1d95] via-[#1c102c] to-[#09070d]",
    accent: "bg-purple-500 text-white hover:bg-purple-300 hover:text-black",
    accentText: "text-purple-300",
    border: "border-purple-400/30",
    glow: "shadow-[0_35px_120px_rgba(147,51,234,0.3)]",
    channels: ["live-chat", "new-releases", "esports-arena", "looking-for-group"],
  },
];

export default function RoomsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeRoom = rooms[activeIndex];

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % rooms.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused]);

  function previousRoom() {
    setActiveIndex(
      (current) => (current - 1 + rooms.length) % rooms.length
    );
  }

  function nextRoom() {
    setActiveIndex((current) => (current + 1) % rooms.length);
  }

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden rounded-[2.5rem] border bg-gradient-to-br ${activeRoom.background} ${activeRoom.border} ${activeRoom.glow}`}
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl" />

      <div
        key={activeRoom.href}
        className="relative grid min-h-[560px] gap-10 p-7 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-black/25 text-3xl backdrop-blur">
              {activeRoom.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  Real-time room
                </span>
              </div>

              <p
                className={`mt-2 text-xs font-black uppercase tracking-[0.35em] ${activeRoom.accentText}`}
              >
                {activeRoom.eyebrow}
              </p>
            </div>
          </div>

          <h2 className="mt-7 text-5xl font-black leading-none md:text-7xl">
            {activeRoom.title}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            {activeRoom.text}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={activeRoom.href}
              className={`rounded-full px-6 py-3 font-black transition ${activeRoom.accent}`}
            >
              Enter {activeRoom.title} →
            </Link>

            <Link
              href="/community"
              className="rounded-full border border-white/20 bg-black/15 px-6 py-3 font-black text-white/75 backdrop-blur hover:bg-white hover:text-black"
            >
              Community Hub
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-black/30 p-5 backdrop-blur-xl md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-black uppercase tracking-[0.3em] ${activeRoom.accentText}`}
              >
                Inside the room
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Choose a conversation
              </h3>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
              Live
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activeRoom.channels.map((channel, index) => (
              <Link
                key={channel}
                href={`${activeRoom.href}?channel=${
                  index === 0
                    ? "general"
                    : channel
                }`}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.1]"
              >
                <p className="text-sm font-black text-white/80">
                  # {channel}
                </p>
                <p className="mt-2 text-xs text-white/35">
                  Join discussion →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-black">
              Live messages, online presence and typing indicators
            </p>
            <p className="mt-2 text-xs leading-5 text-white/40">
              Sign in to join conversations and meet other CINRYVAN members.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/20 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          {rooms.map((room, index) => (
            <button
              key={room.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${room.title}`}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-9 bg-white"
                  : "w-2.5 bg-white/25 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousRoom}
            aria-label="Previous room"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/20 text-xl hover:bg-white hover:text-black"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextRoom}
            aria-label="Next room"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/20 text-xl hover:bg-white hover:text-black"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}