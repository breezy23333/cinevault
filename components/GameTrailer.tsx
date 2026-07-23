import type { GameTrailer as GameTrailerData } from "@/lib/youtube";

type GameTrailerProps = {
  gameTitle: string;
  trailer: GameTrailerData | null;
};

export default function GameTrailer({
  gameTitle,
  trailer,
}: GameTrailerProps) {
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${gameTitle} official game trailer`,
  )}`;

  return (
    <section id="trailer" className="mt-16 scroll-mt-28">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            Watch before you play
          </p>

          <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
            Official trailer
          </h2>
        </div>

        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-white/60 transition hover:text-yellow-400"
        >
          View more videos on YouTube ↗
        </a>
      </div>

      {trailer ? (
        <div className="overflow-hidden rounded-3xl bg-[#101722] shadow-2xl ring-1 ring-white/10">
          <div className="relative aspect-video bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.videoId}?rel=0&playsinline=1`}
              title={`${gameTitle} official trailer`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h3 className="font-black text-white">{trailer.title}</h3>

              <p className="mt-1 text-sm text-white/50">
                Uploaded by {trailer.channelTitle}
              </p>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${trailer.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              Open on YouTube ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101722] p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-yellow-400 text-2xl text-black">
              ▶
            </div>

            <h3 className="text-2xl font-black text-white">
              Trailer not available inside CineVault
            </h3>

            <p className="mt-3 text-white/55">
              Search YouTube for the official {gameTitle} trailer.
            </p>

            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-black text-black transition hover:bg-yellow-300"
            >
              Search for trailer ↗
            </a>
          </div>
        </div>
      )}
    </section>
  );
}