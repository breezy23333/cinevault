

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Clapperboard,
  Gamepad2,
  Mail,
  MonitorPlay,
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,.08),transparent_25%),radial-gradient(circle_at_90%_65%,rgba(37,99,235,.07),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/75 to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e15]">
          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-yellow-400/[0.08] blur-[70px]" />
          <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_minmax(430px,0.8fr)] lg:items-center lg:gap-10 lg:px-9 lg:py-7">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400 text-black">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400">
                  CINRYVAN Signal
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                  Never miss what&apos;s next.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                  New releases, trailers, games and important CINRYVAN updates—without the noise.
                </p>
              </div>
            </div>

            {subscribed ? (
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-yellow-400/25 bg-yellow-400/[0.08] px-4 text-sm font-black text-yellow-300">
                <Check className="h-5 w-5" /> You&apos;re on the CINRYVAN signal.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-label="Newsletter subscription"
                className="flex flex-col gap-2 sm:flex-row"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-yellow-400/60 focus:bg-white/[0.075]"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Join the signal <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="grid gap-9 border-b border-white/10 py-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:gap-12 lg:py-11">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-yellow-400 text-black">
                <Clapperboard className="h-5 w-5" />
              </span>
              <span className="text-2xl font-black tracking-[-0.04em]">
                CINRYVAN
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              Discover movies, television, anime, cartoons, games and entertainment culture in one universe.
            </p>
            <div className="mt-5 flex gap-2">
              <FooterIcon href="/movie" label="Movies">
                <Clapperboard className="h-4 w-4" />
              </FooterIcon>
              <FooterIcon href="/tv" label="TV shows">
                <MonitorPlay className="h-4 w-4" />
              </FooterIcon>
              <FooterIcon href="/games" label="Games">
                <Gamepad2 className="h-4 w-4" />
              </FooterIcon>
            </div>
          </div>

          <FooterColumn title="Discover" links={discoveryLinks} />
          <FooterColumn title="Worlds" links={worldsLinks} />
          <FooterColumn title="CINRYVAN" links={companyLinks} />
        </section>

        <section className="flex flex-col gap-4 py-5 text-[11px] font-semibold text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} CINRYVAN. Built for people who love stories.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-yellow-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
            Movies · TV · Animation · Games
          </p>
        </section>
      </div>
    </footer>
  );
}

function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/40 transition hover:border-yellow-400/60 hover:text-yellow-300"
    >
      {children}
    </Link>
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
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
        {title}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/45 sm:grid-cols-1">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-white"
            >
              <span className="h-px w-0 bg-yellow-400 transition-all group-hover:w-3" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
