// components/Footer.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up later
    setEmail("");
  };

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0f1726] to-[#0b1220]">
    <div className="absolute inset-0 bg-[#0f1726] z-0" />
     <div className="relative z-10 mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 md:px-8 py-14">
      
      <div className="grid gap-10 md:grid-cols-4">
        
        <div className="space-y-4">
          <div className="text-2xl font-bold text-amber-400">
            CineVault
          </div>

          <p className="text-sm leading-relaxed text-white/100">
            Discover and track movies & shows with a cinematic experience built for modern streaming lovers.
          </p>
        </div>

        <div>
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Browse
          </div>

          <ul className="space-y-3 text-sm text-white/100">
            <li><Link href="/browse" className="transition hover:text-amber-300">All titles</Link></li>
            <li><Link href="/categories" className="transition hover:text-amber-300">Categories</Link></li>
            <li><Link href="/trending" className="transition hover:text-amber-300">Trending</Link></li>
            <li><Link href="/top" className="transition hover:text-amber-300">Top rated</Link></li>
            <li><Link href="/tv" className="transition hover:text-amber-300">TV Shows</Link></li>
            <li><Link href="/anime" className="transition hover:text-amber-300">Anime</Link></li>
            <li><Link href="/cartoons" className="transition hover:text-amber-300">Cartoons</Link></li>
            <li><Link href="/news" className="transition hover:text-amber-300">News</Link></li>
            <li><Link href="/watchlist" className="transition hover:text-amber-300">Watchlist</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Support
          </div>

          <ul className="space-y-3 text-sm text-white/100">
            <li><Link href="/support" className="transition hover:text-amber-300">Help center</Link></li>
            <li><Link href="/contact" className="transition hover:text-amber-300">Contact</Link></li>
            <li><Link href="/about" className="transition hover:text-amber-300">About</Link></li>
            <li><Link href="/privacy" className="transition hover:text-amber-300">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Stay Updated
          </div>

          <p className="text-sm text-white/100">
            Get updates on new releases and features.
          </p>

          <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
            />

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/100 md:flex-row">
        <div>© {year} CineVault. All rights reserved.</div>

        <div className="flex items-center gap-5">
          <Link href="/terms" className="transition hover:text-amber-300">Terms</Link>
          <Link href="/privacy" className="transition hover:text-amber-300">Privacy</Link>
          <Link href="/cookies" className="transition hover:text-amber-300">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
  );
}
