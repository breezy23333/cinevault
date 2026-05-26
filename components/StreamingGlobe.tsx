"use client";

import {
  SiNetflix,
  SiYoutube,
  SiCrunchyroll,
  SiPlex,
  SiTubi,
  SiRakuten,
  SiAppletv,
  SiAmazonprime,
} from "react-icons/si";

const platforms = [
  { name: "Netflix", icon: SiNetflix, color: "text-red-500", url: "https://netflix.com", ring: "outer" },
  { name: "Disney+", label: "D+", color: "text-blue-400", url: "https://disneyplus.com", ring: "outer" },
  { name: "Prime Video", icon: SiAmazonprime, color: "text-cyan-400", url: "https://primevideo.com", ring: "outer" },
  { name: "Apple TV", icon: SiAppletv, color: "text-white", url: "https://tv.apple.com", ring: "outer" },
  { name: "YouTube", icon: SiYoutube, color: "text-red-500", url: "https://youtube.com", ring: "outer" },
  { name: "Max", label: "MAX", color: "text-purple-400", url: "https://max.com", ring: "outer" },
  { name: "Hulu", label: "HU", color: "text-green-400", url: "https://hulu.com", ring: "outer" },
  { name: "Crunchyroll", icon: SiCrunchyroll, color: "text-orange-400", url: "https://crunchyroll.com", ring: "outer" },
  { name: "Paramount+", label: "P+", color: "text-blue-500", url: "https://paramountplus.com", ring: "outer" },
  { name: "Peacock", label: "PC", color: "text-yellow-400", url: "https://peacocktv.com", ring: "inner" },
  { name: "Tubi", icon: SiTubi, color: "text-violet-400", url: "https://tubitv.com", ring: "inner" },
  { name: "Starz", label: "SZ", color: "text-yellow-300", url: "https://starz.com", ring: "inner" },
  { name: "Showmax", label: "SM", color: "text-pink-400", url: "https://showmax.com", ring: "inner" },
  { name: "MUBI", label: "MB", color: "text-white", url: "https://mubi.com", ring: "inner" },
  { name: "Plex", icon: SiPlex, color: "text-yellow-300", url: "https://plex.tv", ring: "inner" },
  { name: "Rakuten TV", icon: SiRakuten, color: "text-indigo-400", url: "https://rakuten.tv", ring: "inner" },
  { name: "BritBox", label: "BB", color: "text-sky-400", url: "https://britbox.com", ring: "inner" },
  { name: "AMC+", label: "AMC", color: "text-emerald-400", url: "https://amcplus.com", ring: "inner" },
];

export default function StreamingGlobe() {
  const outer = platforms.filter((p) => p.ring === "outer");
  const inner = platforms.filter((p) => p.ring === "inner");

  return (
    <div className="rounded-[30px] border border-yellow-400/20 bg-black/40 p-4 shadow-[0_0_60px_rgba(250,204,21,0.08)]">
      <div className="mb-4 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-yellow-400">
          Where To Watch
        </p>

        <p className="mt-2 text-xs text-white/45">
          Explore streaming universes
        </p>
      </div>

      <div className="relative mx-auto flex h-[230px] w-[230px] items-center justify-center overflow-visible">
        <div className="stream-globe absolute inset-0 rounded-full" />
        <div className="stream-ring stream-ring-outer" />
        <div className="stream-ring stream-ring-inner" />

        {outer.map((p, i) => (
          <PlatformNode
            key={p.name}
            platform={p}
            angle={(360 / outer.length) * i}
            radius={62}
          />
        ))}

        {inner.map((p, i) => (
          <PlatformNode
            key={p.name}
            platform={p}
            angle={(360 / inner.length) * i + 18}
            radius={34}
            small
          />
        ))}
      </div>

      <p className="mt-5 text-center text-[11px] text-white/35">
        Streaming platforms orbit CineVault
      </p>
    </div>
  );
}

function PlatformNode({
  platform,
  angle,
  radius,
  small = false,
}: {
  platform: any;
  angle: number;
  radius: number;
  small?: boolean;
}) {
  const Icon = platform.icon;

  return (
    <button
      type="button"
      title={platform.name}
      onClick={() => window.open(platform.url, "_blank", "noopener,noreferrer")}
      className={`stream-logo-node ${small ? "stream-logo-node-small" : ""}`}
      style={
        {
          "--angle": `${angle}deg`,
          "--radius": `${radius}px`,
        } as React.CSSProperties
      }
    >
      {Icon ? (
        <Icon className={`text-lg ${platform.color}`} />
      ) : (
        <span className={`text-[9px] font-black ${platform.color}`}>
          {platform.label}
        </span>
      )}
    </button>
  );
}