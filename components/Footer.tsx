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
    <footer className="relative mt-12 overflow-hidden border-t border-white/10 bg-[#0b1220]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,191,0,0.10),transparent_45%)] pointer-events-none" />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 md:px-8 py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-lg font-semibold">CineVault</div>
            <p className="text-sm text-white/70">
              Discover and track movies & shows. Beautiful browsing, fast search.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Browse</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/browse" className="transition hover:text-amber-300">All titles</Link></li>
              <li><Link href="/categories" className="transition hover:text-amber-300">Categories</Link></li>
              <li><Link href="/trending" className="transition hover:text-amber-300">Trending</Link></li>
              <li><Link href="/top" className="transition hover:text-amber-300">Top rated</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Support</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/support" className="transition hover:text-amber-300">Help center</Link></li>
              <li><Link href="/contact" className="transition hover:text-amber-300">Contact</Link></li>
              <li><Link href="/about" className="transition hover:text-amber-300">About</Link></li>
              <li><Link href="/privacy" className="transition hover:text-amber-300">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Get the latest</div>
            <p className="text-sm text-white/70">
              Join our newsletter for new releases and features.
            </p>
            <form className="mt-3 flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-amber-300/40"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-400 text-black text-sm font-semibold px-4 py-2 transition hover:scale-105 hover:bg-amber-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>© {year} CineVault. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="transition hover:text-amber-300">Terms</Link>
            <Link href="/privacy" className="transition hover:text-amber-300">Privacy</Link>
            <Link href="/cookies" className="transition hover:text-amber-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
