"use client";

const providers = [
  {
    name: "Netflix",
    color: "from-red-600 to-red-900",
    icon: "▶",
    url: "https://www.netflix.com/search?q=",
  },
  {
    name: "Disney+",
    color: "from-blue-600 to-indigo-900",
    icon: "✦",
    url: "https://www.disneyplus.com/search/",
  },
  {
    name: "Prime Video",
    color: "from-cyan-500 to-blue-900",
    icon: "▶",
    url: "https://www.primevideo.com/search/ref=atv_nb_sr?phrase=",
  },
  {
    name: "Apple TV",
    color: "from-zinc-500 to-zinc-900",
    icon: "",
    url: "https://tv.apple.com/search?term=",
  },
  {
    name: "YouTube",
    color: "from-red-500 to-orange-800",
    icon: "▶",
    url: "https://www.youtube.com/results?search_query=",
  },
];

export default function WatchOptions({ title }: { title: string }) {
  return (
    <section id="watch-section" className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Streaming Access
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">
          Where to watch
        </h2>
        <p className="mt-2 max-w-2xl text-white/55">
          Search for <span className="text-white">{title}</span> across popular streaming platforms.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {providers.map((provider) => (
          <button
            key={provider.name}
            onClick={() =>
              window.open(
                `${provider.url}${encodeURIComponent(title)}`,
                "_blank"
              )
            }
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:bg-white/[0.08]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-0 transition duration-300 group-hover:opacity-30`}
            />

            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl font-black text-black shadow-lg shadow-yellow-500/20">
                {provider.icon}
              </div>

              <h3 className="text-lg font-black text-white">
                {provider.name}
              </h3>

              <p className="mt-2 text-sm text-white/50">
                Search availability
              </p>

              <div className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-yellow-300 transition group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
                Open provider →
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}