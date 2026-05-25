"use client";

import Image from "next/image";
import { useState } from "react";

const posters = [
  "/og-image.png",
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "https://image.tmdb.org/t/p/w342/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  "https://image.tmdb.org/t/p/w342/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "https://image.tmdb.org/t/p/w342/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  "https://image.tmdb.org/t/p/w342/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
];

export default function CineVaultIntro() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  function handleMove(clientX: number) {
    const width = window.innerWidth;
    const next = Math.min(100, Math.max(0, ((width - clientX) / width) * 100));
    setProgress(next);

    if (next > 92) {
      setTimeout(() => setShow(false), 350);
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#05070d] text-white"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.16),transparent_45%)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative h-[430px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-black/50">
          <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 md:grid-cols-6">
            {posters.map((poster, i) => (
              <div
                key={poster + i}
                className="relative animate-[cardShake_0.22s_ease-in-out_infinite] overflow-hidden rounded-2xl border border-yellow-400/20 bg-white/5"
              >
                <Image
                  src={poster}
                  alt="CineVault movie poster"
                  fill
                  sizes="180px"
                  className="object-cover"
                  priority={i < 3}
                />
              </div>
            ))}
          </div>

          <div
            className="absolute inset-y-0 right-0 z-10 bg-[#05070d]"
            style={{ width: `${100 - progress}%` }}
          />

          <div
            className="absolute top-0 z-20 h-full w-[6px] bg-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.9)]"
            style={{ right: `${100 - progress}%` }}
          />

          <button
            type="button"
            onMouseDown={(e) => handleMove(e.clientX)}
            onTouchStart={(e) => handleMove(e.touches[0].clientX)}
            className="absolute top-1/2 z-30 flex h-24 w-16 -translate-y-1/2 cursor-grab flex-col items-center justify-center rounded-full bg-yellow-400 text-black shadow-[0_0_70px_rgba(250,204,21,0.9)] active:cursor-grabbing"
            style={{ right: `calc(${100 - progress}% - 32px)` }}
          >
            <span className="text-2xl">▣</span>
            <span className="text-xl">▣</span>
            <span className="text-2xl">▣</span>
          </button>

          <div
            className="absolute top-1/2 z-30 -translate-y-1/2 rounded-2xl border border-yellow-400/20 bg-black/70 px-5 py-3 text-sm font-bold text-yellow-300"
            style={{ right: `calc(${100 - progress}% + 55px)` }}
          >
            Drag the zipper to open the vault →
          </div>

          <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300">
              CineVault System
            </p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">
              Open the Vault
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}