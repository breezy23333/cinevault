"use client";

/* eslint-disable @next/next/no-img-element */

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Platform = {
  name: string;
  shortName: string;
  description: string;
  href: string;
  logo: string;
  color: string;
  glow: string;
  region: string;
};

const platforms: Platform[] = [
  { name: "Netflix", shortName: "Netflix", description: "Global films, series, documentaries and Netflix originals.", href: "https://www.netflix.com/za/", logo: "https://cdn.simpleicons.org/netflix/E50914", color: "#E50914", glow: "rgba(229,9,20,.38)", region: "South Africa & global" },
  { name: "Prime Video", shortName: "Prime Video", description: "Amazon originals, movies, series and selected rentals or purchases.", href: "https://www.primevideo.com/", logo: "https://cdn.simpleicons.org/primevideo/00A8E1", color: "#00A8E1", glow: "rgba(0,168,225,.34)", region: "South Africa & global" },
  { name: "Disney+", shortName: "Disney+", description: "Disney, Pixar, Marvel, Star Wars and National Geographic.", href: "https://www.disneyplus.com/", logo: "https://cdn.simpleicons.org/disneyplus/ffffff", color: "#5865F2", glow: "rgba(88,101,242,.38)", region: "South Africa & global" },
  { name: "Apple TV+", shortName: "Apple TV+", description: "Apple Originals plus access to eligible rentals and purchases.", href: "https://tv.apple.com/za", logo: "https://cdn.simpleicons.org/appletv/ffffff", color: "#f5f5f5", glow: "rgba(255,255,255,.2)", region: "South Africa & global" },
  { name: "Showmax", shortName: "Showmax", description: "African originals, international entertainment and selected sport plans.", href: "https://www.showmax.com/za", logo: "https://cdn.simpleicons.org/showmax/ffffff", color: "#ff1675", glow: "rgba(255,22,117,.38)", region: "Africa" },
  { name: "DStv Stream", shortName: "DStv", description: "Live television and on-demand entertainment for eligible DStv plans.", href: "https://dstvstream.com/", logo: "https://cdn.simpleicons.org/dstv/00A9E0", color: "#00A9E0", glow: "rgba(0,169,224,.35)", region: "Africa" },
  { name: "Crunchyroll", shortName: "Crunchyroll", description: "Anime series, movies and simulcasts from Japan and beyond.", href: "https://www.crunchyroll.com/", logo: "https://cdn.simpleicons.org/crunchyroll/F47521", color: "#F47521", glow: "rgba(244,117,33,.38)", region: "Global" },
  { name: "YouTube Movies", shortName: "YouTube", description: "Movies and programmes available to rent or purchase in supported regions.", href: "https://www.youtube.com/feed/storefront", logo: "https://cdn.simpleicons.org/youtube/FF0000", color: "#FF0000", glow: "rgba(255,0,0,.34)", region: "Selected regions" },
  { name: "Max", shortName: "Max", description: "HBO originals, Warner Bros. films and premium entertainment.", href: "https://www.max.com/", logo: "https://cdn.simpleicons.org/max/ffffff", color: "#5B35F5", glow: "rgba(91,53,245,.4)", region: "Selected regions" },
  { name: "Hulu", shortName: "Hulu", description: "Current television, originals and films in the United States.", href: "https://www.hulu.com/", logo: "https://cdn.simpleicons.org/hulu/1CE783", color: "#1CE783", glow: "rgba(28,231,131,.32)", region: "United States" },
  { name: "Paramount+", shortName: "Paramount+", description: "Paramount films, CBS shows, originals and live programming.", href: "https://www.paramountplus.com/", logo: "https://cdn.simpleicons.org/paramountplus/ffffff", color: "#0064FF", glow: "rgba(0,100,255,.4)", region: "Selected regions" },
  { name: "Peacock", shortName: "Peacock", description: "NBCUniversal series, movies, originals, news and sport.", href: "https://www.peacocktv.com/", logo: "https://cdn.simpleicons.org/peacock/ffffff", color: "#F5C518", glow: "rgba(245,197,24,.3)", region: "United States" },
  { name: "MUBI", shortName: "MUBI", description: "Hand-picked international, independent and classic cinema.", href: "https://mubi.com/", logo: "https://cdn.simpleicons.org/mubi/ffffff", color: "#ffffff", glow: "rgba(255,255,255,.2)", region: "Global" },
  { name: "BritBox", shortName: "BritBox", description: "British drama, comedy, mysteries and television favourites.", href: "https://www.britbox.com/", logo: "https://cdn.simpleicons.org/britbox/ffffff", color: "#00BEAB", glow: "rgba(0,190,171,.35)", region: "Selected regions" },
  { name: "STARZ", shortName: "STARZ", description: "STARZ originals, premium series and a rotating movie catalogue.", href: "https://www.starz.com/", logo: "https://cdn.simpleicons.org/starz/ffffff", color: "#ffffff", glow: "rgba(255,255,255,.18)", region: "Selected regions" },
  { name: "AMC+", shortName: "AMC+", description: "AMC originals, thrillers, horror and curated partner channels.", href: "https://www.amcplus.com/", logo: "https://cdn.simpleicons.org/amc/ffffff", color: "#f3c900", glow: "rgba(243,201,0,.3)", region: "Selected regions" },
  { name: "Discovery+", shortName: "Discovery+", description: "Reality, lifestyle, nature and factual entertainment.", href: "https://www.discoveryplus.com/", logo: "https://cdn.simpleicons.org/discovery/ffffff", color: "#2A74E7", glow: "rgba(42,116,231,.36)", region: "Selected regions" },
  { name: "CuriosityStream", shortName: "CuriosityStream", description: "Science, history, technology and nature documentaries.", href: "https://curiositystream.com/", logo: "https://cdn.simpleicons.org/curiositystream/ffffff", color: "#53B848", glow: "rgba(83,184,72,.34)", region: "Global" },
  { name: "Tubi", shortName: "Tubi", description: "Free ad-supported movies, shows and live channels.", href: "https://tubitv.com/", logo: "https://cdn.simpleicons.org/tubi/ffffff", color: "#FA382F", glow: "rgba(250,56,47,.36)", region: "Selected regions" },
  { name: "Pluto TV", shortName: "Pluto TV", description: "Free live channels and an ad-supported on-demand library.", href: "https://pluto.tv/", logo: "https://cdn.simpleicons.org/plutotv/ffffff", color: "#F4D03F", glow: "rgba(244,208,63,.3)", region: "Selected regions" },
  { name: "Plex", shortName: "Plex", description: "Free movies, shows, live channels and personal media tools.", href: "https://www.plex.tv/watch-free-tv/", logo: "https://cdn.simpleicons.org/plex/E5A00D", color: "#E5A00D", glow: "rgba(229,160,13,.34)", region: "Global" },
  { name: "Rakuten TV", shortName: "Rakuten TV", description: "Rentals, purchases and free ad-supported entertainment.", href: "https://www.rakuten.tv/", logo: "https://cdn.simpleicons.org/rakuten/ffffff", color: "#BF0000", glow: "rgba(191,0,0,.38)", region: "Europe" },
  { name: "Viaplay", shortName: "Viaplay", description: "Nordic drama, films, documentaries and selected live sport.", href: "https://viaplay.com/", logo: "https://cdn.simpleicons.org/viaplay/FF0046", color: "#FF0046", glow: "rgba(255,0,70,.36)", region: "Selected regions" },
  { name: "iQIYI", shortName: "iQIYI", description: "Asian drama, anime, variety programmes and movies.", href: "https://www.iq.com/", logo: "https://cdn.simpleicons.org/iqiyi/00CC36", color: "#00CC36", glow: "rgba(0,204,54,.32)", region: "Global" },
  { name: "Rakuten Viki", shortName: "Viki", description: "Korean, Chinese, Japanese and other Asian entertainment.", href: "https://www.viki.com/", logo: "https://cdn.simpleicons.org/viki/ffffff", color: "#0C9BFF", glow: "rgba(12,155,255,.36)", region: "Global" },
  { name: "ZEE5", shortName: "ZEE5", description: "Indian movies, original series, television and regional content.", href: "https://www.zee5.com/", logo: "https://cdn.simpleicons.org/zee5/ffffff", color: "#8230C6", glow: "rgba(130,48,198,.38)", region: "Global" },
  { name: "Shudder", shortName: "Shudder", description: "Horror, thrillers and supernatural films and series.", href: "https://www.shudder.com/", logo: "https://cdn.simpleicons.org/shudder/ffffff", color: "#C6102E", glow: "rgba(198,16,46,.36)", region: "Selected regions" },
  { name: "Kanopy", shortName: "Kanopy", description: "Thoughtful films available through participating libraries and universities.", href: "https://www.kanopy.com/", logo: "https://cdn.simpleicons.org/kanopy/ffffff", color: "#FF5B35", glow: "rgba(255,91,53,.34)", region: "Participating institutions" },
  { name: "Sling TV", shortName: "Sling", description: "Live television packages and on-demand programming.", href: "https://www.sling.com/", logo: "https://cdn.simpleicons.org/sling/ffffff", color: "#00A4E4", glow: "rgba(0,164,228,.36)", region: "United States" },
  { name: "Fubo", shortName: "Fubo", description: "Live sport, television channels and on-demand entertainment.", href: "https://www.fubo.tv/", logo: "https://cdn.simpleicons.org/fubo/ffffff", color: "#E83888", glow: "rgba(232,56,136,.36)", region: "Selected regions" },
];

function wrappedDistance(index: number, active: number, total: number) {
  let distance = index - active;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

export default function StreamingPlatformCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const frameRef = useRef<HTMLDivElement>(null);
  const active = platforms[activeIndex];

  const move = useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + platforms.length) % platforms.length);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    frame.addEventListener("keydown", onKeyDown);
    return () => frame.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return (
    <div className="mt-10">
      <div
        ref={frameRef}
        tabIndex={0}
        aria-label="Streaming platform carousel"
        className="relative h-[370px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#070a11] outline-none [--card-step:58vw] sm:h-[410px] sm:[--card-step:300px] lg:h-[440px] lg:[--card-step:340px]"
        onPointerDown={(event) => {
          setDragStart(event.clientX);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (dragStart === null) return;
          const distance = event.clientX - dragStart;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
          setDragStart(null);
        }}
        onPointerCancel={() => setDragStart(null)}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${active.glow}, transparent 42%)` }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#070a11] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070a11] via-[#070a11]/85 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-[82%] h-16 w-[72%] -translate-x-1/2 rounded-[50%] border-t border-white/15 bg-white/[0.025] blur-[1px]" />

        <div className="absolute left-5 top-5 z-40 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/55 backdrop-blur-xl sm:left-8 sm:top-8">
          {String(activeIndex + 1).padStart(2, "0")} / {platforms.length}
        </div>

        <div className="absolute inset-0" style={{ perspective: "1400px" }}>
          {platforms.map((platform, index) => {
            const distance = wrappedDistance(index, activeIndex, platforms.length);
            const absoluteDistance = Math.abs(distance);
            if (absoluteDistance > 2) return null;
            const isActive = distance === 0;
            const rotateY = distance * -14;
            const scale = isActive ? 1 : Math.max(0.72, 0.86 - absoluteDistance * 0.07);
            return (
              <button
                key={platform.name}
                type="button"
                aria-label={`Select ${platform.name}`}
                onClick={() => setActiveIndex(index)}
                className="absolute left-1/2 top-[47%] h-[220px] w-[70vw] max-w-[360px] overflow-hidden rounded-[1.75rem] border text-left shadow-2xl transition-all duration-500 ease-out sm:h-[260px] sm:w-[360px] lg:h-[290px] lg:w-[400px] lg:max-w-[400px]"
                style={{
                  transform: `translate(-50%, -50%) translateX(calc(var(--card-step) * ${distance})) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  zIndex: 20 - absoluteDistance,
                  opacity: 1 - absoluteDistance * 0.14,
                  borderColor: isActive ? platform.color : "rgba(255,255,255,.12)",
                  background: `linear-gradient(145deg, ${platform.glow}, #111722 48%, #080b12)`,
                  boxShadow: isActive ? `0 34px 100px ${platform.glow}` : "0 24px 60px rgba(0,0,0,.55)",
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.09),transparent_35%,rgba(0,0,0,.22))]" />
                <div className="relative flex h-full flex-col items-center justify-center px-8">
                  {!logoErrors[platform.name] ? (
                    <img
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      className="h-14 w-[68%] object-contain drop-shadow-2xl sm:h-16"
                      onError={() => setLogoErrors((errors) => ({ ...errors, [platform.name]: true }))}
                    />
                  ) : (
                    <span className="text-center text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">{platform.shortName}</span>
                  )}
                  {isActive && <span className="mt-6 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 backdrop-blur-xl">Selected platform</span>}
                </div>
              </button>
            );
          })}
        </div>

        <button type="button" onClick={() => move(-1)} aria-label="Previous streaming platform" className="absolute bottom-5 left-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-xl transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:bottom-auto sm:left-7 sm:top-1/2 sm:-translate-y-1/2">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Next streaming platform" className="absolute bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-xl transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:bottom-auto sm:right-7 sm:top-1/2 sm:-translate-y-1/2">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="relative z-50 mx-auto -mt-1 grid max-w-5xl gap-5 rounded-b-[2rem] border border-t-0 border-white/10 bg-[#0b1018] px-6 py-6 shadow-2xl sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">{active.name}</h3>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">{active.region}</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{active.description}</p>
        </div>
        <a href={active.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300">
          Open official service <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5 flex justify-center gap-1.5" aria-label="Carousel position">
        {platforms.map((platform, index) => (
          <button key={platform.name} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show ${platform.name}`} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-yellow-400" : "w-1.5 bg-white/20 hover:bg-white/45"}`} />
        ))}
      </div>
    </div>
  );
}
