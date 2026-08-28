"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export type ShelfMedia = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  year?: string;
  rating?: number;
  trailer?: string | null;
};

function getYouTubeId(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();

  // Accept a plain YouTube video key.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((part) =>
        ["embed", "shorts", "live"].includes(part),
      );

      if (markerIndex >= 0) {
        return parts[markerIndex + 1] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function ShelfCard({
  item,
  href,
  onExpand,
}: {
  item: ShelfMedia;
  href: string;
  onExpand?: (
    card: HTMLAnchorElement,
  ) => void;
}) {
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isHovering = useRef(false);
  const trailerFrame = useRef<HTMLIFrameElement>(null);
  const trailerRequested = useRef(false);

  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [trailerId, setTrailerId] = useState<string | null>(() =>
    getYouTubeId(item.trailer),
  );

  const score =
    typeof item.rating === "number" ? item.rating.toFixed(1) : null;

    function startTrailer() {
    isHovering.current = true;

    if (cardRef.current) {
      onExpand?.(cardRef.current);
    }

    hoverTimer.current = setTimeout(async () => {
      let videoId = trailerId;

      if (!videoId && !trailerRequested.current) {
        trailerRequested.current = true;

        try {
          const response = await fetch(
            `/api/trailer?media=${item.media}&id=${item.id}`,
          );

          if (response.ok) {
            const data = (await response.json()) as {
              trailer?: string | null;
            };

            videoId = data.trailer || null;

            if (videoId) {
              setTrailerId(videoId);
            }
          }
        } catch {
          videoId = null;
        }
      }

      if (videoId && isHovering.current) {
        setShowTrailer(true);
      }
    }, 0);
  }

  function toggleTrailerSound(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const nextSoundOn = !soundOn;

    trailerFrame.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: nextSoundOn ? "unMute" : "mute",
        args: [],
      }),
      "*",
    );

    if (nextSoundOn) {
      trailerFrame.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [65],
        }),
        "*",
      );
    }

    setSoundOn(nextSoundOn);
  }

  function stopTrailer() {
    isHovering.current = false;

    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }

    setShowTrailer(false);
    setTrailerReady(false);
    setSoundOn(false);
  }

  const trailerSrc =
    showTrailer && trailerId
      ? `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`
      : null;

  return (
    <Link
      ref={cardRef}
      href={href}
      aria-label={`Open ${item.title}`}
      onMouseEnter={startTrailer}
      onMouseLeave={stopTrailer}
      onFocus={startTrailer}
      onBlur={stopTrailer}
      className="
        group relative z-10 block
        w-[108px] shrink-0 snap-start
        outline-none
        transition-[width] duration-500
        hover:z-40
        sm:w-[140px]
        md:w-[160px] md:hover:w-[320px]
        lg:w-[172px] lg:hover:w-[360px]
      "
    >
      <div
        className="
          relative aspect-[2/3] overflow-hidden
          transition-[aspect-ratio] duration-200
          md:group-hover:aspect-video
          rounded-xl border border-white/10
          bg-[#111722]
          shadow-[0_12px_30px_rgba(0,0,0,0.28)]
          transition duration-300
          group-hover:-translate-y-1
          group-hover:border-yellow-400/50
          group-hover:shadow-[0_18px_45px_rgba(250,204,21,0.14)]
          group-focus-visible:border-yellow-400
          sm:rounded-2xl
        "
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`
              h-full w-full object-cover
              transition duration-200
              group-hover:scale-[1.04]
              ${
                showTrailer && trailerReady
                  ? "opacity-0"
                  : "opacity-100 group-hover:brightness-110"
              }
            `}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[#111722] px-2 text-center text-[10px] text-white/35">
            Poster unavailable
          </div>
        )}

        {trailerSrc && (
          <iframe
            ref={trailerFrame}
            src={trailerSrc}
            title={`${item.title} trailer preview`}
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setTrailerReady(true)}
            className={`
              pointer-events-none absolute inset-0
              h-full w-full border-0
              transition-opacity duration-200
              ${trailerReady ? "opacity-100" : "opacity-0"}
            `}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 opacity-70" />

        {score && (
          <span
            className="
              absolute left-1.5 top-1.5
              rounded-md border border-yellow-400/25
              bg-black/75 px-1.5 py-0.5
              text-[9px] font-black text-yellow-300
              backdrop-blur-md
              sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px]
            "
          >
            ★ {score}
          </span>
        )}

        {trailerId && !showTrailer && (
          <span
            className="
              pointer-events-none absolute bottom-2 right-2
              hidden rounded-full border border-white/15
              bg-black/70 px-2 py-1
              text-[8px] font-black uppercase tracking-wider text-white/80
              opacity-0 backdrop-blur-md transition
              group-hover:opacity-100
              md:block
            "
          >
            Trailer
          </span>
        )}

        {showTrailer && trailerReady && (
          <span
            className="
              pointer-events-none absolute bottom-2 left-2
              hidden items-center gap-1.5 rounded-full
              bg-red-600/90 px-2.5 py-1
              text-[8px] font-black uppercase tracking-wider text-white
              backdrop-blur-md
              md:flex
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Preview
          </span>
        )}

        {showTrailer && trailerReady && (
          <button
            type="button"
            onClick={toggleTrailerSound}
            aria-label={soundOn ? "Mute trailer" : "Turn trailer sound on"}
            className="
              absolute bottom-2 right-2 z-30
              hidden h-7 w-7 items-center justify-center
              rounded-full border border-white/20
              bg-black/80 text-white
              shadow-lg backdrop-blur-md
              transition
              hover:border-yellow-400 hover:text-yellow-300
              md:flex
            "
          >
            {soundOn ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-yellow-400 transition duration-300 group-hover:scale-x-100" />
      </div>

      <div className="px-0.5 pt-1.5 sm:pt-2">
        <h3
          className="
            line-clamp-1
            text-[11px] font-bold leading-tight text-white/90
            transition group-hover:text-yellow-300
            sm:text-sm
          "
        >
          {item.title}
        </h3>

        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-white/40 sm:text-xs">
          {item.year && <span>{item.year}</span>}

          {item.year && (
            <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          )}

          <span className="uppercase">
            {item.media === "tv" ? "TV" : "Movie"}
          </span>
        </div>
      </div>
    </Link>
  );
}