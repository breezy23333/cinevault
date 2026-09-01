"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Menu,
  Mic,
  Search,
  Settings,
  User2,
  X,
} from "lucide-react";
import SettingsPanel from "@/components/SettingsPanel";
import StreamingGlobe from "@/components/StreamingGlobe";

const NAV_GROUPS = [
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
      { label: "Upcoming TV Shows", href: "/upcoming/tv" },
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
    label: "Celebrities",
    href: "/people",
    dropdown: [
      { label: "Celebrity Hub", href: "/people" },
      { label: "Trending Celebrities", href: "/people#trending" },
      { label: "Celebrity Birthdays", href: "/people#birthdays" },
      { label: "Actors & Performers", href: "/people#actors" },
      { label: "Directors & Creators", href: "/people#filmmakers" },
    ],
  },
  {
    label: "Games",
    href: "/games",
    dropdown: [
      { label: "All Games", href: "/games" },
      { label: "Popular Games", href: "/games/category/popular" },
      { label: "New Releases", href: "/games/category/new-releases" },
      { label: "Top Rated", href: "/games/category/top-rated" },
      { label: "Upcoming Games", href: "/games/category/upcoming" },
      { label: "PC Games", href: "/games/category/pc" },
      { label: "PlayStation", href: "/games/category/playstation" },
      { label: "Racing Games", href: "/games/category/racing" },
    ],
  },
  {
    label: "Browse",
    href: "/browse",
    dropdown: [
      { label: "Browse Everything", href: "/browse" },
      { label: "Search", href: "/search" },
      { label: "Categories", href: "/categories" },
      { label: "Trending", href: "/trending" },
      { label: "Community", href: "/community" },
      { label: "Rooms", href: "/rooms" },
    ],
  },
  {
    label: "Watch & Tickets",
    href: "/watch",
    dropdown: [
      { label: "Where to Watch", href: "/watch#streaming" },
      { label: "Streaming Platforms", href: "/watch#platforms" },
      { label: "Rent or Buy", href: "/watch#rent-buy" },
      { label: "Cinema Showtimes", href: "/watch#cinemas" },
      { label: "Buy Tickets", href: "/watch#tickets" },
      { label: "Store & Deals", href: "/store" },
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
  const accountRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("cinryvan_user")));
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeAccount = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", closeAccount);
    return () => document.removeEventListener("mousedown", closeAccount);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function startVoiceSearch() {
    const Recognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Recognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const spokenText = String(event.results[0][0].transcript || "").trim();
      setQ(spokenText);
      setListening(false);
      if (spokenText) {
        router.push(`/search?q=${encodeURIComponent(spokenText)}`);
      }
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Voice search failed. Please try again.");
    };

    recognition.onend = () => setListening(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const pillBase =
    "whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-amber-100 ring-1 ring-amber-400/65 transition hover:bg-amber-400 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition ${
          scrolled
            ? "bg-[#05070d]/95 backdrop-blur-xl"
            : "bg-[#05070d]/85 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-[1920px] items-center gap-2 px-3 sm:px-4 xl:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="cinryvan-navigation-drawer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="shrink-0 text-base font-black tracking-tight sm:text-lg"
          >
            CINRYVAN
          </Link>

          <ul className="ml-2 hidden items-center gap-2 2xl:flex">
            {NAV_GROUPS.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`${pillBase} ${
                      active ? "bg-amber-400 text-black" : ""
                    }`}
                  >
                    {item.label}
                  </Link>

                  <div className="invisible absolute left-0 top-full z-50 mt-2 w-60 translate-y-2 rounded-2xl border border-white/10 bg-[#0b0f1a]/98 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.dropdown.map((drop) => (
                      <Link
                        key={`${drop.href}-${drop.label}`}
                        href={drop.href}
                        className="block rounded-xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-yellow-400 hover:text-black"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="min-w-0 flex-1" />

          <form onSubmit={submit} className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search or describe a movie..."
                className="h-10 w-56 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-11 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-yellow-400/60 xl:w-64 2xl:w-72"
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                aria-label="Describe a movie or show"
                title="Describe a movie or show"
                className={`absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition ${
                  listening
                    ? "animate-pulse bg-yellow-400 text-black"
                    : "text-yellow-300 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div ref={accountRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setAccountOpen((value) => !value)}
              aria-label="Open account menu"
              aria-expanded={accountOpen}
              className="flex h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-bold text-white/85 transition hover:bg-white/10"
            >
              <User2 className="h-5 w-5 text-yellow-300" />
              <span className="hidden xl:inline">
                {isLoggedIn ? "Account" : "Sign in"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b0f1a]/98 p-2 shadow-2xl backdrop-blur-xl">
                <Link
                  href="/watchlist"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  <Bookmark className="h-4 w-4 text-yellow-400" /> Watchlist
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  <span className="relative">
                    <Bell className="h-4 w-4 text-yellow-400" />
                    <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  </span>
                  Notifications
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    setShowSettings(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  <Settings className="h-4 w-4 text-yellow-400" /> Settings
                </button>

                <div className="my-2 border-t border-white/10" />

                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="block rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black hover:bg-yellow-300"
                  >
                    Open Profile
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="rounded-xl bg-white/10 px-3 py-2.5 text-center text-sm font-bold hover:bg-white/15"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-xl bg-yellow-400 px-3 py-2.5 text-center text-sm font-black text-black hover:bg-yellow-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileSearchOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 lg:hidden"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 lg:hidden"
            aria-label="Open account and navigation menu"
          >
            <User2 className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {mobileSearchOpen && (
        <form
          onSubmit={(event) => {
            submit(event);
            setMobileSearchOpen(false);
          }}
          className="fixed left-3 right-3 top-[4.5rem] z-[55] lg:hidden"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              autoFocus
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search or describe a movie..."
              className="h-12 w-full rounded-xl border border-yellow-400/30 bg-[#070a12] pl-10 pr-14 text-sm text-white outline-none shadow-2xl focus:border-yellow-400/70"
            />
            <button
              type="button"
              onClick={startVoiceSearch}
              aria-label="Describe a movie or show"
              className={`absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg ${
                listening
                  ? "animate-pulse bg-yellow-400 text-black"
                  : "bg-yellow-400/10 text-yellow-300"
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-[60] ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/65 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        <aside
          id="cinryvan-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="CINRYVAN navigation"
          className={`absolute left-0 top-0 h-[100dvh] w-[min(90vw,360px)] bg-[#0c111b] shadow-2xl ring-1 ring-white/10 transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="font-black"
            >
              CINRYVAN
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="hide-scrollbar h-[calc(100dvh-64px)] overflow-y-auto px-3 py-3">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="mb-1 block rounded-lg px-3 py-2 text-sm font-bold hover:bg-white/10"
            >
              Home
            </Link>

            {NAV_GROUPS.map((item) => (
              <div key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-white/10"
                >
                  {item.label}
                </Link>
                <div className="ml-3 grid grid-cols-2 gap-1 border-l border-white/10 pl-3">
                  {item.dropdown.map((drop) => (
                    <Link
                      key={`${drop.href}-${drop.label}`}
                      href={drop.href}
                      onClick={() => setDrawerOpen(false)}
                      className="rounded-lg px-2 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                    >
                      {drop.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
              <Link
                href="/watchlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                <Bookmark className="h-4 w-4 text-yellow-400" /> Watchlist
              </Link>
              <Link
                href="/notifications"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                <Bell className="h-4 w-4 text-yellow-400" /> Alerts
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setShowSettings(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left text-xs hover:bg-white/10"
              >
                <Settings className="h-4 w-4 text-yellow-400" /> Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  startVoiceSearch();
                }}
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-left text-xs font-bold text-black hover:bg-yellow-300"
              >
                <Mic className="h-4 w-4" /> Voice search
              </button>
            </div>

            {!isLoggedIn ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-bold hover:bg-white/15"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg bg-yellow-400 px-3 py-2 text-center text-sm font-black text-black hover:bg-yellow-300"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-sm font-bold text-yellow-300"
              >
                <User2 className="h-4 w-4" /> Profile
              </Link>
            )}

            <div className="mt-3 rounded-xl border border-yellow-400/20 bg-white/[0.04] p-2.5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-400">
                Streaming worldwide
              </p>
              <div className="mt-2 scale-75">
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
