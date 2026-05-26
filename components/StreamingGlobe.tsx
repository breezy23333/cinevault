"use client";

const platforms = [
  { name: "Netflix", short: "N", color: "bg-red-600", url: "https://netflix.com" },
  { name: "Disney+", short: "D+", color: "bg-blue-600", url: "https://disneyplus.com" },
  { name: "Prime", short: "P", color: "bg-cyan-600", url: "https://primevideo.com" },
  { name: "Apple TV", short: "TV", color: "bg-zinc-700", url: "https://tv.apple.com" },
  { name: "YouTube", short: "YT", color: "bg-red-500", url: "https://youtube.com" },
  { name: "HBO", short: "HBO", color: "bg-purple-700", url: "https://max.com" },
  { name: "Hulu", short: "H", color: "bg-green-600", url: "https://hulu.com" },
  { name: "Crunchyroll", short: "C", color: "bg-orange-500", url: "https://crunchyroll.com" },
];

export default function StreamingGlobe() {
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

      <div className="relative mx-auto h-[320px] w-[320px]">

        {/* globe */}
        <div className="stream-globe absolute inset-0 rounded-full" />

        {/* orbit items */}
        {platforms.map((p, i) => {
          const angle = (360 / platforms.length) * i;

          return (
            <button
              key={p.name}
              onClick={() => window.open(p.url, "_blank")}
              className={`stream-node ${p.color}`}
              style={
                {
                  "--angle": `${angle}deg`,
                } as React.CSSProperties
              }
            >
              {p.short}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[11px] text-white/35">
        Drag the streaming world
      </p>
    </div>
  );
}