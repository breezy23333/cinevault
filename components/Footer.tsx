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
    <footer className="mt-12 border-t border-white/10 bg-[#0c111b]">
      <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] px-4 md:px-8 py-10">
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
              <li><Link href="/browse" className="hover:underline">All titles</Link></li>
              <li><Link href="/categories" className="hover:underline">Categories</Link></li>
              <li><Link href="/trending" className="hover:underline">Trending</Link></li>
              <li><Link href="/top" className="hover:underline">Top rated</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Support</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/support" className="hover:underline">Help center</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
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
                className="flex-1 rounded-lg bg-zinc-900 ring-1 ring-white/10 px-3 py-2 text-sm outline-none focus:ring-white/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-amber-400 text-black text-sm font-semibold px-3 py-2 hover:brightness-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>© {year} CineVault. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/cookies" className="hover:underline">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
