import type { GameTrailer as GameTrailerData } from "@/lib/youtube";

type GameTrailerProps = {
  gameTitle: string;
  trailer: GameTrailerData | null;
};

export default function GameTrailer({
  gameTitle,
  trailer,
}: GameTrailerProps) {
  return (
    <section id="trailer" className="mt-16 scroll-mt-40">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Watch before you play
        </p>

        <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
          Official trailer
        </h2>
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

          <div className="p-5 md:p-6">
            <h3 className="font-black text-white">
              {trailer.title}
            </h3>

            <p className="mt-1 text-sm text-white/50">
              Uploaded by {trailer.channelTitle}
            </p>

            <a
              href={`https://www.youtube.com/watch?v=${trailer.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
            >
              Watch on YouTube ↗
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
              Trailer temporarily unavailable
            </h3>

            <p className="mt-3 text-white/55">
              The official {gameTitle} trailer could not be loaded.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}