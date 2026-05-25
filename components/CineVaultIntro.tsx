"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function CineVaultIntro() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
  const timer = setTimeout(() => {
    setShow(false);
  }, 3600);

    return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
    const stopDragging = () => setDragging(false);

    window.addEventListener("mouseup", stopDragging);

    return () => {
        window.removeEventListener("mouseup", stopDragging);
    };
    }, []);

  if (!show) return null;



  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.16),transparent_45%)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative h-[560px] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-black/50 shadow-[0_0_100px_rgba(250,204,21,0.15)]">
          <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 md:grid-cols-6">
            {posters.map((poster, i) => (
              <div
                key={poster + i}
                className="relative animate-[cardShake_0.22s_ease-in-out_infinite] overflow-hidden rounded-2xl border border-yellow-400/20 bg-white/5 shadow-[0_0_30px_rgba(250,204,21,0.12)]"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Image
                  src={poster}
                  alt="CineVault movie poster"
                  fill
                  sizes="180px"
                  className="object-cover"
                  priority={i < 4}
                />
              </div>
            ))}
          </div>

          <div
            className="absolute inset-y-0 right-0 z-10 bg-[#05070d] transition-all duration-75"
            style={{
                width: `${100 - progress}%`,
                
            }}
            />

          <div
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                onMouseMove={(e) => {
                    if (!dragging) return;

                    const width = window.innerWidth;
                    const next = Math.min(
                    100,
                    Math.max(0, ((width - e.clientX) / width) * 100)
                    );

                    setProgress(next);

                    if (next > 95) {
                    setTimeout(() => setShow(false), 250);
                    }
                }}
                className="absolute top-1/2 z-20 flex h-20 w-20 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-yellow-400 text-4xl font-black text-black shadow-[0_0_60px_rgba(250,204,21,0.8)] active:cursor-grabbing"
                style={{
                    right: `${100 - progress}%`,
                    
                }}
                >
                ⛓
                </div>

                <div className="absolute right-8 top-8 z-30 rounded-2xl border border-yellow-400/20 bg-black/60 px-4 py-3 text-sm font-bold text-yellow-300 backdrop-blur">
                Drag the zipper to open the vault →
                </div>

          <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300">
              CineVault System
            </p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">
              Opening the Vault
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}