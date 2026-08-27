"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowUpRight,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { RawgGame } from "@/lib/games";

function getPlatformNames(game: RawgGame) {
  const platforms = game.parent_platforms?.length
    ? game.parent_platforms
    : game.platforms ?? [];

  return [
    ...new Set(
      platforms.map((item) => item.platform.name),
    ),
  ].slice(0, 2);
}

export default function GameCard({
  game,
}: {
  game: RawgGame;
}) {
  const platforms = getPlatformNames(game);
  const hoverTimer =
  useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHovering = useRef(false);
  const trailerRequested = useRef(false);
  const trailerFrame = useRef<HTMLIFrameElement>(null);

  const [trailerId, setTrailerId] =
    useState<string | null>(null);
  const [showTrailer, setShowTrailer] =
    useState(false);
  const [trailerReady, setTrailerReady] =
    useState(false);
  const [soundOn, setSoundOn] =
    useState(false);

  const releaseYear = game.released
    ? new Date(game.released).getUTCFullYear()
    : null;

   function startTrailer() {
  isHovering.current = true;

  if (hoverTimer.current) {
    clearTimeout(hoverTimer.current);
  }

  hoverTimer.current = setTimeout(async () => {
    let videoId = trailerId;

    if (!videoId && !trailerRequested.current) {
      trailerRequested.current = true;

      try {
        const response = await fetch(
          `/api/games/trailer?name=${encodeURIComponent(
            game.name,
          )}`,
        );

        if (response.ok) {
          const data = (await response.json()) as {
            trailer?: {
              videoId?: string;
            } | null;
          };

          videoId =
            data.trailer?.videoId || null;

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
  event: MouseEvent<HTMLButtonElement>,
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
      href={`/games/${game.id}`}
      onMouseEnter={startTrailer}
      onMouseLeave={stopTrailer}
      aria-label={`View ${game.name}`}
      className="
        group block w-full self-start overflow-hidden
        border border-white/10 bg-[#121a27]
        shadow-[0_10px_28px_rgba(0,0,0,.25)]
        transition duration-300
        hover:-translate-y-1
        hover:border-yellow-400/60
        hover:shadow-[0_16px_38px_rgba(0,0,0,.45)]
      "
    >
      {/* Compact artwork */}
      <div className="relative aspect-video overflow-hidden bg-[#080d14]">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`
              h-full w-full object-cover object-center
              transition duration-500
              group-hover:scale-[1.025]
              group-hover:brightness-110
              ${
                showTrailer && trailerReady
                  ? "opacity-0"
                  : "opacity-100"
              }
            `}
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#1a2433] to-[#0b1019] px-3 text-center text-xs font-bold uppercase tracking-wider text-white/30">
            Image unavailable
          </div>
          )}

        {trailerSrc && (
          <iframe
            ref={trailerFrame}
            src={trailerSrc}
            title={`${game.name} trailer preview`}
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setTrailerReady(true)}
            className={`
              pointer-events-none absolute inset-0
              h-full w-full border-0
              transition-opacity duration-500
              ${
                trailerReady
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />

        {!showTrailer && (
          <span className="pointer-events-none absolute left-2 top-2 hidden rounded-full bg-black/75 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white/80 opacity-0 backdrop-blur-md transition group-hover:opacity-100 md:block">
            Hover 1 second
          </span>
        )}

        {showTrailer && trailerReady && (
          <span className="pointer-events-none absolute left-2 top-2 hidden items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white backdrop-blur-md md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Preview
          </span>
        )}

        {showTrailer && trailerReady && (
          <button
            type="button"
            onClick={toggleTrailerSound}
            aria-label={
              soundOn
                ? `Mute ${game.name} trailer`
                : `Turn on ${game.name} trailer sound`
            }
            className="
              absolute bottom-2 right-2 z-30
              hidden items-center gap-1.5
              rounded-full border border-white/20
              bg-black/80 px-2.5 py-1.5
              text-[8px] font-black uppercase
              tracking-wider text-white
              backdrop-blur-md transition
              hover:border-yellow-400
              hover:text-yellow-300
              md:flex
            "
          >
            {soundOn ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}

            {soundOn ? "Sound on" : "Sound off"}
          </button>
        )}

        {typeof game.metacritic === "number" ? (
          <span className="absolute right-2 top-2 border border-emerald-300/30 bg-[#123b28]/90 px-2 py-1 text-[10px] font-black text-emerald-200">
            {game.metacritic}
          </span>
        ) : null}

        {releaseYear ? (
          <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 text-[10px] font-bold text-white/70 backdrop-blur-sm">
            {releaseYear}
          </span>
        ) : null}

        <span className="absolute bottom-2 right-2 grid h-8 w-8 translate-y-2 place-items-center bg-yellow-400 text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Compact details */}
      <div className="p-3.5">
        <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-white transition group-hover:text-yellow-400">
          {game.name}
        </h3>

        <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px]">
          <span className="inline-flex shrink-0 items-center gap-1 font-black text-yellow-400">
            <Star
              className="h-3 w-3"
              fill="currentColor"
            />

            {game.rating > 0
              ? game.rating.toFixed(1)
              : "N/A"}
          </span>

          {game.genres?.[0] ? (
            <>
              <span className="text-white/20">•</span>

              <span className="truncate font-semibold text-white/45">
                {game.genres[0].name}
              </span>
            </>
          ) : null}
        </div>

        {platforms.length ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="border border-white/10 bg-black/20 px-1.5 py-1 text-[8px] font-black uppercase tracking-wide text-white/40 transition group-hover:border-yellow-400/20 group-hover:text-white/60"
              >
                {platform}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}