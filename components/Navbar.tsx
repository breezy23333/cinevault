"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Menu, X, Search, Bell, User2 } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
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
        className={`fixed top-0 inset-x-0 z-50 transition-colors ${
          scrolled
            ? "bg-[#0b0f1a]/70 backdrop-blur border-b border-white/10"
            : "bg-transparent"
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
            {LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${pillBase} ${active ? "bg-amber-400 text-black" : ""}`}
                  >
                    {label}
                  </Link>
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
                placeholder="Search movies, shows..."
                className="pl-8 pr-3 py-2 text-sm rounded-lg bg-zinc-900 ring-1 ring-white/10 outline-none focus:ring-white/20 w-72"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link href="/notifications" className="p-2 rounded-lg hover:bg-white/10" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </Link>
            <Link href="/account" className="p-2 rounded-lg hover:bg-white/10" aria-label="Account">
              <User2 className="w-5 h-5" />
            </Link>
            <Link href="/search" className="md:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </header>

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
          <nav className="px-3 py-2 space-y-2">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

