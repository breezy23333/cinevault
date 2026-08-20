// components/Footer.tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const browseLinks = [
  { label: "All titles", href: "/browse" },
  { label: "Categories", href: "/categories" },
  { label: "Trending", href: "/trending" },
  { label: "Top rated", href: "/top" },
  { label: "TV Shows", href: "/tv" },
  { label: "Anime", href: "/anime" },
  { label: "Cartoons", href: "/cartoons" },
  { label: "News", href: "/news" },
  { label: "Watchlist", href: "/watchlist" },
];

const supportLinks = [
  { label: "Help center", href: "/support" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0f1726]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1726] to-[#0b1220]" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 md:px-8 lg:py-14 xl:max-w-[1600px] 2xl:max-w-[1800px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-black tracking-tight text-amber-400 sm:text-2xl">
              CINRYVAN
            </div>

            <p className="mt-2 max-w-md text-xs leading-5 text-white/70 sm:mt-4 sm:text-sm sm:leading-relaxed">
              Discover and track movies, shows, anime, cartoons and games
              through one cinematic entertainment universe.
            </p>
          </div>

          {/* Browse */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-sm">
              Browse
            </h2>

            <ul className="grid grid-cols-3 gap-x-3 gap-y-2 text-xs text-white/70 md:grid-cols-1 md:gap-0 md:space-y-3 md:text-sm">
              {browseLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-0.5 transition hover:text-amber-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-sm">
              Support
            </h2>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/70 md:grid-cols-1 md:gap-0 md:space-y-3 md:text-sm">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-0.5 transition hover:text-amber-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-sm">
              Stay updated
            </h2>

            <p className="text-xs text-white/65 sm:text-sm">
              Get updates about releases and new Cinryvan features.
            </p>

            <form
              className="mt-3 flex gap-2 sm:mt-4"
              onSubmit={handleSubmit}
              aria-label="Newsletter subscription"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/60 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
              />

              <button
                type="submit"
                className="h-10 shrink-0 rounded-lg bg-amber-400 px-3 text-xs font-black text-black transition hover:bg-amber-300 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-4 text-[11px] text-white/55 sm:mt-10 sm:pt-6 md:flex-row md:items-center md:justify-between md:text-xs">
          <div>© {year} CINRYVAN. All rights reserved.</div>

          <div className="flex items-center gap-4 sm:gap-5">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-amber-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}