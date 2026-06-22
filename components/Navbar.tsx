"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import StreamingGlobe from "@/components/StreamingGlobe";
import SettingsPanel from "@/components/SettingsPanel";
import { FormEvent, useEffect, useState } from "react";

import {
  Menu,
  X,
  Search,
  Bell,
  User2,
  Sparkles,
  Mic,
  Bookmark
} from "lucide-react";

const NAV_GROUPS = [
  { label: "Home", href: "/" },

  {
    label: "Movies",
    href: "/movie",
    dropdown: [
      { label: "Popular Movies", href: "/movie" },
      { label: "Trending Movies", href: "/trending" },
      { label: "Top Rated", href: "/top" },
      { label: "Upcoming Movies", href: "/upcoming" },
    ],
  },

  {
    label: "TV Shows",
    href: "/tv",
    dropdown: [
      { label: "Popular TV Shows", href: "/tv/popular" },
      { label: "Trending TV Shows", href: "/tv/trending" },
      { label: "Top Rated TV Shows", href: "/tv/top" },
      { label: "Upcoming TV Shows", href: "/upcoming" },
    ],
  },

  {
    label: "Animation",
    href: "/animation",
    dropdown: [
      { label: "Anime", href: "/anime" },
      { label: "Cartoons", href: "/cartoons" },
    ],
  },

  {
  label: "Browse",
  href: "/search",
  dropdown: [
    { label: "Search", href: "/search" },
    { label: "Rooms", href: "/rooms" },
    { label: "Library", href: "/library" },
    { label: "Community", href: "/community" },
    { label: "Store", href: "/store" },
    { label: "Support", href: "/support" },
  ],
},

  {
    label: "News",
    href: "/news",
    dropdown: [
      { label: "Entertainment", href: "/news/entertainment" },
      { label: "Gaming", href: "/news/gaming" },
      { label: "Sports", href: "/news/sports" },
    ],
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const labels: Record<string, string> = {
  home: "Home",
  browse: "Browse",
  upcoming: "Upcoming",
  store: "Store",
  about: "About",
  support: "Support",
  news: "News",
  search: "Search movies, shows...",
};
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
 

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
  const user = localStorage.getItem("cinevault_user");
  setIsLoggedIn(!!user);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function startVoiceSearch() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      let spokenText = event.results[0][0].transcript.toLowerCase();

        if (spokenText.includes("superheroes are evil")) {
          spokenText = "The Boys";
        }

        if (spokenText.includes("astronauts in space")) {
          spokenText = "Interstellar";
        }

        if (spokenText.includes("blue aliens")) {
          spokenText = "Avatar";
        }

        if (spokenText.includes("wizard school")) {
          spokenText = "Harry Potter";
        }

        setQ(spokenText);

        router.push(
          `/search?q=${encodeURIComponent(spokenText)}`
        );
    };

    recognition.onerror = () => {
      alert("Voice search failed.");
    };
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // pill style like Categories (slightly compact)
  const pillBase =
    "rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm ring-1 ring-amber-400/70 text-amber-200 " +
    "hover:bg-amber-400 hover:text-black transition-colors duration-150 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

  return (
    <>
      {/* Fixed, compact navbar that changes bg once scrolled */}
      <header
          className={`fixed top-0 inset-x-0 z-50 border-b border-white/10 transition-all duration-300 ${
            scrolled
              ? "bg-[#05070d]/95 backdrop-blur-xl"
              : "bg-[#05070d]/80 backdrop-blur-md"
          }`}
        >
       <nav className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] h-12 md:h-14 px-4 md:px-8 flex items-center gap-3">
          {/* Burger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand */}
          <Link href="/" className="text-lg font-semibold tracking-tight">
            CineVault
          </Link>

          {/* Links with category-like animation */}
          <ul className="hidden md:flex items-center gap-2 ml-2">
            {NAV_GROUPS.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`${pillBase} ${active ? "bg-amber-400 text-black" : ""}`}
                  >
                    {item.label}
                  </Link>

                  {"dropdown" in item && item.dropdown && (
                    <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-2xl border border-white/10 bg-[#0b0f1a]/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:opacity-100">
                      {item.dropdown.map((drop) => (
                        <Link
                          key={drop.href}
                          href={drop.href}
                          className="block rounded-xl px-4 py-3 text-sm font-bold text-white/75 hover:bg-yellow-400 hover:text-black"
                        >
                          {drop.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex-1" />

          {/* Search (desktop) */}
          <form onSubmit={submit} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.search}
                className="pl-8 pr-3 py-2 text-sm rounded-lg bg-zinc-900 ring-1 ring-white/10 outline-none focus:ring-white/20 w-72"
              />
            </div>
          </form>

          {/* Right actions */}
                  {/* Right actions */}
          <div className="flex items-center gap-2">

            <Link
              href="/watchlist"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Watchlist"
            >
              <Bookmark className="h-5 w-5" />
            </Link>

            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </Link>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Settings"
            >
              <Sparkles className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={startVoiceSearch}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black shadow-[0_0_18px_rgba(250,204,21,0.35)] transition hover:scale-105 hover:bg-yellow-300"
              aria-label="Voice search"
              title="Describe a movie or show"
            >
              <Mic className="h-5 w-5" />
            </button>

            {!isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="https://cinevault-tau-drab.vercel.app/login"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="https://cinevault-tau-drab.vercel.app/signup"
                  className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.18)] transition hover:bg-yellow-400 hover:text-black"
                aria-label="Profile"
                title="Logged in"
              >
                <User2 className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

          </div>
        </nav>
      </header>

      {mobileSearchOpen && (
        <form
          onSubmit={(e) => {
            submit(e);
            setMobileSearchOpen(false);
          }}
          className="fixed left-3 right-3 top-16 z-[55] md:hidden"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />

            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, shows..."
              className="w-full rounded-2xl border border-yellow-400/30 bg-[#070a12] py-3 pl-10 pr-4 text-sm text-white outline-none shadow-2xl"
            />
          </div>
        </form>
      )}     

      {/* Drawer */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        {/* panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-[#0c111b] ring-1 ring-white/10 shadow-2xl
                      transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 h-14">
            <span className="font-semibold">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="h-[calc(100vh-56px)] overflow-y-auto px-3 py-2 space-y-2 hide-scrollbar">

            {NAV_GROUPS.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 font-bold hover:bg-white/10"
                >
                  {item.label}
                </Link>

                {"dropdown" in item && item.dropdown && (
                  <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
                    {item.dropdown.map((drop) => (
                      <Link
                        key={drop.href}
                        href={drop.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/10 hover:text-white"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 border-t border-white/10 pt-4">

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-white/10 px-3 py-2 text-center"
              >
                Login
              </Link>

             <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-yellow-400 px-3 py-2 text-center font-bold text-black"
              > 
                Sign Up
              </Link>

            </div>

            <div className="mt-4 border-t border-white/10 pt-4 space-y-2">

              <Link
                href="/watchlist"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Watchlist
              </Link>

              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Notifications
              </Link>

              <Link
                href="/anime"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Anime
              </Link>

              <Link
                href="/cartoons"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Cartoons
              </Link>

              <Link
                href="/trending"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Trending
              </Link>

              <Link
                href="/top"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                Top Rated
              </Link>

            </div>

            <div className="mt-6 rounded-2xl border border-yellow-400/25 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-3 shadow-[0_0_30px_rgba(250,204,21,0.08)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-400">
                  Where to watch
                </p>

                <Sparkles className="h-4 w-4 text-yellow-400" />
              </div>

            <div className="mt-6">
              <StreamingGlobe />
            </div>

            </div>
          </nav>
        </aside>
      </div>

       {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}     
              
    </>
  );
}

