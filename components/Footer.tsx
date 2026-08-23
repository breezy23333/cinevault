// components/Footer.tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Gamepad2,
  Mail,
  MonitorPlay,
  Sparkles,
} from "lucide-react";

const discoveryLinks = [
  { label: "Movies", href: "/movie" },
  { label: "TV Shows", href: "/tv" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Categories", href: "/categories" },
];

const worldsLinks = [
  { label: "Anime", href: "/anime" },
  { label: "Cartoons", href: "/cartoons" },
  { label: "Animation", href: "/animation" },
  { label: "Games", href: "/games" },
  { label: "News", href: "/news" },
  { label: "Community", href: "/community" },
];

const companyLinks = [
  { label: "About CINRYVAN", href: "/about" },
  { label: "Help & Support", href: "/support" },
  { label: "Contact", href: "/contact" },
  { label: "Store", href: "/store" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Library", href: "/library" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "DMCA", href: "/dmca" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(250,204,21,.13),transparent_28%),radial-gradient(circle_at_88%_55%,rgba(37,99,235,.11),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <section className="grid overflow-hidden border border-white/10 bg-[#090d14] lg:grid-cols-[1fr_340px]">
          <div className="relative overflow-hidden p-6 sm:p-9 lg:p-12">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-yellow-400/10" />
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400">
              <Sparkles className="h-3.5 w-3.5" /> Your next story is waiting
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Don’t leave without finding your next world.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
              Move through cinema, television, anime, cartoons and games from one entertainment universe.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Browse CINRYVAN <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
              >
                Search titles <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-yellow-400 p-6 text-black sm:p-8 lg:border-l lg:border-t-0">
            <Mail className="h-7 w-7" />
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-black/55">
              CINRYVAN Signal
            </p>
            <h2 className="mt-2 text-2xl font-black">Stay ahead of every release.</h2>
            <p className="mt-3 text-sm leading-6 text-black/65">
              New movies, shows, animation, games and CINRYVAN features.
            </p>

            {subscribed ? (
              <div className="mt-6 border border-black/20 bg-black px-4 py-4 text-sm font-black text-yellow-300">
                You’re on the CINRYVAN signal ✓
              </div>
            ) : (
              <form className="mt-6" onSubmit={handleSubmit} aria-label="Newsletter subscription">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full border border-black/20 bg-white/70 px-4 text-sm font-semibold text-black outline-none placeholder:text-black/40 focus:border-black"
                />
                <button
                  type="submit"
                  className="mt-2 flex h-12 w-full items-center justify-between bg-black px-4 text-sm font-black text-white transition hover:bg-[#111827]"
                >
                  Join the signal <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="grid gap-9 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:gap-12 lg:py-14">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-yellow-400 text-black">
                <Clapperboard className="h-5 w-5" />
              </span>
              <span className="text-2xl font-black tracking-[-0.04em]">CINRYVAN</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              A cinematic discovery universe for movies, television, anime, cartoons, games and entertainment culture.
            </p>
            <div className="mt-6 flex gap-2">
              <Link href="/movie" aria-label="Movies" className="grid h-10 w-10 place-items-center border border-white/10 text-white/45 hover:border-yellow-400/60 hover:text-yellow-300">
                <Clapperboard className="h-4 w-4" />
              </Link>
              <Link href="/tv" aria-label="TV shows" className="grid h-10 w-10 place-items-center border border-white/10 text-white/45 hover:border-yellow-400/60 hover:text-yellow-300">
                <MonitorPlay className="h-4 w-4" />
              </Link>
              <Link href="/games" aria-label="Games" className="grid h-10 w-10 place-items-center border border-white/10 text-white/45 hover:border-yellow-400/60 hover:text-yellow-300">
                <Gamepad2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <FooterColumn title="Discover" links={discoveryLinks} />
          <FooterColumn title="Worlds" links={worldsLinks} />
          <FooterColumn title="CINRYVAN" links={companyLinks} />
        </section>

        <section className="flex flex-col gap-5 py-6 text-[11px] font-semibold text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} CINRYVAN. Built for people who love stories.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-yellow-300">
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/20">Movies · TV · Animation · Games</p>
        </section>

        <div aria-hidden="true" className="select-none overflow-hidden border-t border-white/5 pt-4 text-center text-[17vw] font-black leading-[0.72] tracking-[-0.09em] text-white/[0.025] sm:text-[14vw] lg:text-[180px]">
          CINRYVAN
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">{title}</h2>
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-white/50 sm:grid-cols-1">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-white">
              <span className="h-px w-0 bg-yellow-400 transition-all group-hover:w-3" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}