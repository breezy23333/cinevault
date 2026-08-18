import { ExternalLink, Play, Search } from "lucide-react";
import type { GameTrailer as GameTrailerData } from "@/lib/youtube";

type GameTrailerProps = {
  gameTitle: string;
  trailer: GameTrailerData | null;
};

export default function GameTrailer({ gameTitle, trailer }: GameTrailerProps) {
  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${gameTitle} official trailer`,
  )}`;

  return (
    <section id="trailer" className="mt-12 scroll-mt-40" aria-labelledby="trailer-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
            Watch before you play
          </p>
          <h2 id="trailer-title" className="mt-1 text-2xl font-black text-white md:text-3xl">
            Official Trailer
          </h2>
        </div>

        <a
          href={trailer ? `https://www.youtube.com/watch?v=${trailer.videoId}` : youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white/65 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          {trailer ? "Open on YouTube" : "Search YouTube"}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {trailer ? (
        <div className="overflow-hidden border border-white/10 bg-[#101722] shadow-[0_24px_70px_rgba(0,0,0,.45)]">
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

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 py-3 md:px-5">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-white md:text-base">
                {trailer.title}
              </h3>
              <p className="mt-0.5 text-xs text-white/40">
                Uploaded by {trailer.channelTitle}
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${trailer.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 bg-yellow-400 px-4 py-2 text-xs font-black text-black transition hover:bg-yellow-300"
            >
              <Play className="h-3.5 w-3.5" fill="currentColor" />
              Watch on YouTube
            </a>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#151e2d] to-[#0b1019] p-6 shadow-[0_20px_55px_rgba(0,0,0,.35)] md:p-10">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,.12),transparent_65%)]" />
          <div className="relative flex max-w-2xl flex-col items-start">
            <span className="grid h-12 w-12 place-items-center bg-yellow-400 text-black">
              <Play className="h-5 w-5" fill="currentColor" />
            </span>
            <h3 className="mt-5 text-xl font-black text-white md:text-2xl">
              Trailer temporarily unavailable
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              We could not load an official {gameTitle} trailer, but you can search YouTube for the latest official video.
            </p>
            <a
              href={youtubeSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-yellow-400 px-4 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              <Search className="h-4 w-4" />
              Find trailer on YouTube
            </a>
          </div>
        </div>
      )}
    </section>
  );
}