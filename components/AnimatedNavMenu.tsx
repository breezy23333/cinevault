
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Clapperboard,
  Compass,
  Film,
  Gamepad2,
  Newspaper,
  Sparkles,
  Ticket,
  Tv,
  UsersRound,
  X,
} from "lucide-react";

type NavLinkItem = {
  readonly label: string;
  readonly href: string;
};

type NavGroup = NavLinkItem & {
  readonly dropdown?: readonly NavLinkItem[];
};

type Props = {
  groups: readonly NavGroup[];
};

const NAV_ICONS: Record<string, typeof Sparkles> = {
  Movies: Clapperboard,
  "TV Shows": Tv,
  Animation: Film,
  Celebrities: UsersRound,
  Games: Gamepad2,
  Browse: Compass,
  "Watch & Tickets": Ticket,
  News: Newspaper,
};

export default function AnimatedNavMenu({ groups }: Props) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Close after navigating to a different page.
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;

    const onOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setExpanded(null);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setExpanded(null);
      }
    };

    document.addEventListener("pointerdown", onOutsideClick);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const selected = groups.find(
    (group) => group.href === expanded
  );

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div
      ref={rootRef}
      className="relative ml-2 hidden min-w-0 flex-1 items-center justify-center lg:flex"
    >
      {/* ANIMATED EXPLORE BUTTON */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="cinryvan-explore-panel"
        onClick={() => {
          setOpen((value) => !value);
          setExpanded(null);
        }}
        className="group relative isolate inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full border border-amber-400/60 bg-[#180d12] px-5 text-sm font-black tracking-[0.13em] text-amber-200 shadow-[0_0_28px_rgba(217,119,6,0.13)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-[#301319] hover:shadow-[0_0_38px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-red-700/35 via-amber-400/25 to-red-700/35 opacity-60 blur-lg transition-opacity group-hover:opacity-100" />

        <Sparkles
          className="h-4 w-4 text-amber-300"
          aria-hidden="true"
        />

        <span>EXPLORE</span>

        {open ? (
          <X
            className="h-4 w-4 text-amber-300"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </button>

      {/* EXPANDING CINEMATIC NAVIGATION PANEL */}
      {open && (
        <div
          id="cinryvan-explore-panel"
          role="region"
          aria-label="Explore CINRYVAN categories"
          className="fixed left-1/2 top-[76px] z-[80] w-[min(940px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[28px] border border-amber-400/35 bg-[#0d0a11] shadow-[0_28px_100px_rgba(0,0,0,0.85),0_0_45px_rgba(185,28,28,0.13)]"
          style={{
            animation:
              "cinryvan-panel-reveal 350ms cubic-bezier(.2,.8,.2,1) both",
          }}
        >
          <div className="max-h-[calc(100dvh-90px)] overflow-y-auto p-4 sm:p-6">

            {/* PANEL HEADING */}
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-amber-400">
                  CINRYVAN UNIVERSE
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Choose your next world
                </h2>
              </div>

              <div
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-xl text-amber-400 sm:flex"
                aria-hidden="true"
              >
                ✦
              </div>
            </div>

            {/* ANIMATED CATEGORIES */}
            <nav
              aria-label="CINRYVAN categories"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
            >
              {groups.map((group, index) => {
                const Icon =
                  NAV_ICONS[group.label] ?? Sparkles;

                const active =
                  pathname === group.href ||
                  pathname.startsWith(`${group.href}/`) ||
                  group.dropdown?.some(
                    (link) =>
                      link.href.split("#")[0] === pathname
                  );

                // Center cards reveal first, then outer cards.
                const delay =
                  Math.abs(
                    index - (groups.length - 1) / 2
                  ) * 70;

                return (
                  <div
                    key={group.href}
                    style={{
                      animation:
                        "cinryvan-category-reveal 620ms cubic-bezier(.16,1,.3,1) both",
                      animationDelay: `${delay}ms`,
                    }}
                  >
                    <div
                      className={`group flex h-[76px] items-stretch rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/80 hover:bg-red-950/45 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:h-[86px] ${
                        active
                          ? "border-amber-400/70 bg-amber-400/10"
                          : "border-white/15 bg-white/[0.045]"
                      }`}
                    >
                      <Link
                        href={group.href}
                        onClick={closeMenu}
                        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-1 text-center text-xs font-bold text-white/90 outline-none transition-colors hover:text-amber-300 focus-visible:text-amber-300 sm:text-sm"
                      >
                        <Icon
                          className="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:scale-125"
                          aria-hidden="true"
                        />
                        <span>{group.label}</span>
                      </Link>

                      {/* SUBCATEGORY BUTTON */}
                      {group.dropdown &&
                        group.dropdown.length > 0 && (
                          <button
                            type="button"
                            aria-label={`More ${group.label} links`}
                            aria-expanded={
                              expanded === group.href
                            }
                            onClick={() =>
                              setExpanded((value) =>
                                value === group.href
                                  ? null
                                  : group.href
                              )
                            }
                            className="flex w-7 shrink-0 items-center justify-center rounded-r-2xl border-l border-white/10 text-white/55 outline-none transition-colors hover:bg-amber-400/15 hover:text-amber-300 focus-visible:text-amber-300"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-300 ${
                                expanded === group.href
                                  ? "rotate-180"
                                  : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* EXPANDABLE SUBCATEGORIES */}
            {selected?.dropdown && (
              <div
                className="mt-4 rounded-2xl border border-amber-400/20 bg-black/35 p-4"
                style={{
                  animation:
                    "cinryvan-submenu-reveal 300ms ease-out both",
                }}
              >
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">
                  {selected.label} — Explore more
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selected.dropdown.map((link) => (
                    <Link
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      onClick={closeMenu}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold text-white/80 transition-all hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-200 sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-5 text-center text-[11px] tracking-wide text-white/40">
              Select a category, or tap its arrow to
              discover more.
            </p>
          </div>
        </div>
      )}

      {/* CINEMATIC ENTRANCE ANIMATIONS */}
      <style>{`
        @keyframes cinryvan-panel-reveal {
          from {
            opacity: 0;
            transform:
              translateX(-50%)
              translateY(-14px)
              scale(.96);
          }
          to {
            opacity: 1;
            transform:
              translateX(-50%)
              translateY(0)
              scale(1);
          }
        }

        @keyframes cinryvan-category-reveal {
          from {
            opacity: 0;
            transform:
              translateY(22px)
              scale(.77);
            filter: blur(7px);
          }
          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes cinryvan-submenu-reveal {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #cinryvan-explore-panel,
          #cinryvan-explore-panel > div,
          #cinryvan-explore-panel nav > div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
