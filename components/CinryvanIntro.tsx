"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

const posters = [
  "/og-image.png",
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w342/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  "https://image.tmdb.org/t/p/w342/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "https://image.tmdb.org/t/p/w342/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "https://image.tmdb.org/t/p/w342/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/w342/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
  "https://image.tmdb.org/t/p/w342/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg",
  "https://image.tmdb.org/t/p/w342/5ik4ATKmNtmJU6AYD0bLm56BCVM.jpg",
  "https://image.tmdb.org/t/p/w342/A3ZbZsmsvNGdprRi2lKgGEeVLEH.jpg",
  "https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "https://image.tmdb.org/t/p/w342/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
];

const cineVaultLetters = "CINRYVAN".split("");

export default function CinryvanIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    const introDuration = isDesktop ? 10500 : 7000;

    const timer = window.setTimeout(() => {
      setShow(false);
    }, introDuration);

    return () => window.clearTimeout(timer);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="intro-root fixed inset-0 z-[9999] overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.18),transparent_50%)]" />

      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-8">
        <div className="intro-frame relative h-[78vh] min-h-[520px] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-black shadow-[0_0_120px_rgba(250,204,21,0.18)]">
          {/* Existing CINRYVAN images */}
          <div className="absolute inset-0 grid grid-cols-3 gap-2 bg-[#05070d] p-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 md:p-7">
            {posters.map((poster, index) => (
              <div
                key={`${poster}-${index}`}
                className="poster-card relative overflow-hidden rounded-xl border border-yellow-400/15 bg-white/5 md:rounded-2xl"
                style={{
                  animationDelay: `${index * 45}ms`,
                }}
              >
                <Image
                  src={poster}
                  alt="CINRYVAN movie poster"
                  fill
                  sizes="(max-width: 768px) 33vw, 180px"
                  priority={index < 6}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dark cinematic layer behind the lettering */}
          <div className="poster-shade pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(5,7,13,0.2),rgba(5,7,13,0.88))]" />

          {/* Top and bottom zipper fabric */}
          <div className="zipper-fabric zipper-fabric-top" />
          <div className="zipper-fabric zipper-fabric-bottom" />

          {/* Closed zipper teeth */}
          <div className="zipper-track zipper-track-closed" />

          {/* Opening upper teeth */}
          <div className="zipper-track zipper-track-top" />

          {/* Opening lower teeth */}
          <div className="zipper-track zipper-track-bottom" />

          {/* Real zipper slider */}
          <div className="zipper-slider">
            <div className="zipper-slider-body">
              <div className="zipper-slider-slot" />
            </div>

            <div className="zipper-pull">
              <div className="zipper-pull-hole" />
            </div>
          </div>

          {/* Letter-by-letter CINRYVAN reveal */}
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 text-center">
            <div>
              <p className="intro-kicker text-xs font-black uppercase tracking-[0.5em] text-yellow-300 md:text-sm">
                The vault is open
              </p>

              <h1
                aria-label="CINRYVAN"
                className="mt-5 whitespace-nowrap text-4xl font-black tracking-[0.06em] sm:text-6xl md:text-8xl lg:text-9xl"
              >
                {cineVaultLetters.map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className="intro-letter inline-block bg-gradient-to-b from-white via-yellow-100 to-yellow-400 bg-clip-text text-transparent"
                    style={{
                      animationDelay: `${2750 + index * 130}ms`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>

              <div className="intro-line mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-yellow-400 to-transparent md:w-80" />

              <p className="intro-tagline mt-4 text-[10px] font-bold uppercase tracking-[0.35em] text-white/65 md:text-xs">
                Movies • TV • Animation • Games
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .intro-root {
          animation: introExit 7s ease forwards;
        }

        @media (min-width: 769px) {
          .intro-root {
            animation-duration: 10.5s;
          }
        }

        .poster-card {
          transform: scale(1.06);
          filter: brightness(0.78) saturate(0.8);
          animation: posterSettle 3.8s ease forwards;
        }

        .poster-shade {
          opacity: 0;
          animation: posterShade 1s ease 2.65s forwards;
        }

        .zipper-fabric {
          position: absolute;
          inset: 0;
          z-index: 10;
          background:
            radial-gradient(
              circle at 25% 20%,
              rgba(250, 204, 21, 0.07),
              transparent 38%
            ),
            repeating-linear-gradient(
              135deg,
              #080b12 0px,
              #080b12 4px,
              #0d121d 4px,
              #0d121d 8px
            );
        }

        .zipper-fabric-top {
          clip-path: polygon(
            0 0,
            100% 0,
            100% 50%,
            0 50%
          );
          animation: zipperTopOpen 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-fabric-bottom {
          clip-path: polygon(
            0 50%,
            100% 50%,
            100% 100%,
            0 100%
          );
          animation: zipperBottomOpen 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-track {
          position: absolute;
          z-index: 15;
          height: 5px;
          background: #3b2b00;
          box-shadow:
            0 0 15px rgba(250, 204, 21, 0.7),
            0 0 35px rgba(250, 204, 21, 0.25);
        }

        .zipper-track::before,
        .zipper-track::after {
          position: absolute;
          left: 0;
          width: 100%;
          height: 8px;
          content: "";
          background: repeating-linear-gradient(
            90deg,
            #fff1a8 0px,
            #facc15 5px,
            #7c5700 7px,
            #1e1600 10px
          );
        }

        .zipper-track::before {
          bottom: 4px;
        }

        .zipper-track::after {
          top: 4px;
          background-position: 5px 0;
        }

        .zipper-track-closed {
          left: 0;
          top: 50%;
          width: 100%;
          transform: translateY(-50%);
          animation: closedTrack 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-track-top {
          left: 100%;
          top: 50%;
          width: 0;
          opacity: 0;
          transform: translateY(-50%) rotate(0deg);
          transform-origin: left center;
          animation: topTrack 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-track-bottom {
          left: 100%;
          top: 50%;
          width: 0;
          opacity: 0;
          transform: translateY(-50%) rotate(0deg);
          transform-origin: left center;
          animation: bottomTrack 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-slider {
          position: absolute;
          left: calc(100% - 34px);
          top: 50%;
          z-index: 20;
          height: 105px;
          width: 62px;
          transform: translate(-50%, -50%);
          filter: drop-shadow(
            0 0 22px rgba(250, 204, 21, 0.8)
          );
          animation: sliderTravel 2.65s
            cubic-bezier(0.75, 0, 0.18, 1) 0.25s
            forwards;
        }

        .zipper-slider-body {
          position: absolute;
          left: 50%;
          top: 33px;
          height: 50px;
          width: 42px;
          transform: translateX(-50%);
          border: 2px solid #fff1a8;
          border-radius: 10px 10px 14px 14px;
          background: linear-gradient(
            135deg,
            #fff1a8,
            #facc15 38%,
            #7c5700 78%,
            #2d2100
          );
          box-shadow:
            inset 0 0 7px rgba(255, 255, 255, 0.7),
            0 7px 15px rgba(0, 0, 0, 0.6);
        }

        .zipper-slider-slot {
          position: absolute;
          left: 50%;
          top: 16px;
          height: 17px;
          width: 12px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #211800;
          box-shadow: inset 0 2px 4px #000;
        }

        .zipper-pull {
          position: absolute;
          left: 50%;
          top: 0;
          height: 48px;
          width: 29px;
          transform: translateX(-50%);
          border: 3px solid #facc15;
          border-radius: 14px 14px 9px 9px;
          background: linear-gradient(
            90deg,
            #6f4d00,
            #ffe879,
            #8c6500
          );
        }

        .zipper-pull-hole {
          position: absolute;
          left: 50%;
          top: 8px;
          height: 23px;
          width: 12px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #080b12;
          box-shadow: inset 0 0 5px #000;
        }

        .intro-kicker,
        .intro-line,
        .intro-tagline {
          opacity: 0;
          transform: translateY(12px);
          animation: supportingText 0.7s ease 3.85s
            forwards;
        }

        .intro-line {
          animation-delay: 4.05s;
        }

        .intro-tagline {
          animation-delay: 4.2s;
        }

        .intro-letter {
          opacity: 0;
          transform: translateY(35px) scale(0.7);
          filter: blur(12px);
          animation: letterReveal 0.65s
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes zipperTopOpen {
          0%,
          12% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 50%,
              0 50%
            );
          }

          72% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 12%,
              12% 50%,
              0 50%
            );
          }

          88%,
          100% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 0,
              0 0
            );
          }
        }

        @keyframes zipperBottomOpen {
          0%,
          12% {
            clip-path: polygon(
              0 50%,
              100% 50%,
              100% 100%,
              0 100%
            );
          }

          72% {
            clip-path: polygon(
              0 50%,
              12% 50%,
              100% 88%,
              100% 100%,
              0 100%
            );
          }

          88%,
          100% {
            clip-path: polygon(
              0 100%,
              100% 100%,
              100% 100%,
              0 100%
            );
          }
        }

        @keyframes closedTrack {
          0%,
          12% {
            width: 100%;
            opacity: 1;
          }

          72% {
            width: 12%;
            opacity: 1;
          }

          88%,
          100% {
            width: 0;
            opacity: 0;
          }
        }

        @keyframes topTrack {
          0%,
          12% {
            left: 100%;
            width: 0;
            opacity: 0;
            transform: translateY(-50%) rotate(0deg);
          }

          18% {
            opacity: 1;
          }

          72% {
            left: 12%;
            width: 92%;
            opacity: 1;
            transform: translateY(-50%)
              rotate(-12deg);
          }

          88%,
          100% {
            opacity: 0;
          }
        }

        @keyframes bottomTrack {
          0%,
          12% {
            left: 100%;
            width: 0;
            opacity: 0;
            transform: translateY(-50%) rotate(0deg);
          }

          18% {
            opacity: 1;
          }

          72% {
            left: 12%;
            width: 92%;
            opacity: 1;
            transform: translateY(-50%)
              rotate(12deg);
          }

          88%,
          100% {
            opacity: 0;
          }
        }

        @keyframes sliderTravel {
          0%,
          12% {
            left: calc(100% - 34px);
            opacity: 1;
          }

          72% {
            left: 12%;
            opacity: 1;
          }

          84% {
            left: 8%;
            opacity: 1;
          }

          92%,
          100% {
            left: 6%;
            opacity: 0;
          }
        }

        @keyframes letterReveal {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.7);
            filter: blur(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes supportingText {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes posterSettle {
          to {
            transform: scale(1);
            filter: brightness(0.7) saturate(0.9);
          }
        }

        @keyframes posterShade {
          to {
            opacity: 1;
          }
        }

        @keyframes introExit {
          0%,
          91% {
            opacity: 1;
            visibility: visible;
          }

          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        
      `}</style>
    </div>
  );
}