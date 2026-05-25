"use client";

import { useEffect, useState } from "react";

export default function CineVaultIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem("cinevault_intro_played");

    if (!played) {
      setShow(true);
      sessionStorage.setItem("cinevault_intro_played", "true");

      const timer = setTimeout(() => {
        setShow(false);
      }, 3600);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.16),transparent_45%)]" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="relative h-[430px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-black/50 shadow-[0_0_100px_rgba(250,204,21,0.15)]">
          <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 md:grid-cols-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="animate-[cardShake_0.22s_ease-in-out_infinite] rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/25 via-white/10 to-black shadow-[0_0_30px_rgba(250,204,21,0.12)]"
                style={{ animationDelay: `${i * 0.04}s` }}
              />
            ))}
          </div>

          <div className="absolute inset-y-0 right-0 z-10 w-full animate-[zipOpen_3.2s_ease-in-out_forwards] bg-[#05070d]" />

          <div className="absolute top-1/2 right-0 z-20 flex h-20 w-20 -translate-y-1/2 animate-[zipMove_3.2s_ease-in-out_forwards] items-center justify-center rounded-full bg-yellow-400 text-4xl font-black text-black shadow-[0_0_60px_rgba(250,204,21,0.8)]">
            ⛓
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