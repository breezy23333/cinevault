"use client";

import Link from "next/link";
import { Bell, Flame, Film, Star, Tv, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  href: string;
  type: "trending" | "trailer" | "episode" | "watchlist" | "rating";
};

const notifications: Notification[] = [
  {
    id: "trending-movies",
    title: "Trending movies updated",
    message: "Fresh trending movies are now available on CineVault.",
    time: "Today",
    href: "/trending",
    type: "trending",
  },
  {
    id: "new-trailers",
    title: "New trailers added",
    message: "Movie and TV trailers have been refreshed from TMDB.",
    time: "Today",
    href: "/search",
    type: "trailer",
  },
  {
    id: "new-episode-alerts",
    title: "New episode alerts coming online",
    message: "CineVault will notify you when tracked TV shows release new episodes.",
    time: "Beta",
    href: "/tv",
    type: "episode",
  },
  {
    id: "watchlist-alerts",
    title: "Watchlist alerts enabled",
    message: "Titles saved to your watchlist can now generate update alerts.",
    time: "New",
    href: "/watchlist",
    type: "watchlist",
  },
  {
    id: "top-rated-refresh",
    title: "Top rated titles refreshed",
    message: "Top-rated movies and TV shows have been updated.",
    time: "Recently",
    href: "/top",
    type: "rating",
  },
];

function getIcon(type: Notification["type"]) {
  if (type === "trending") return Flame;
  if (type === "trailer") return Film;
  if (type === "episode") return Tv;
  if (type === "watchlist") return Bell;
  return Star;
}

export default function NotificationsClient({
    tmdbNotifications = [],
    }: {
    tmdbNotifications?: Notification[];
    }) {
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cinevault-read-notifications");
    if (saved) setReadIds(JSON.parse(saved));
  }, []);

  function markAsRead(id: string) {
    const next = Array.from(new Set([...readIds, id]));
    setReadIds(next);
    localStorage.setItem("cinevault-read-notifications", JSON.stringify(next));
  }

  function markAllAsRead() {
    const allIds = allNotifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem("cinevault-read-notifications", JSON.stringify(allIds));
  }

  const allNotifications = [...tmdbNotifications, ...notifications];

  const unreadCount = allNotifications.filter((n) => !readIds.includes(n.id)).length;

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400/15 via-white/[0.04] to-transparent p-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
          <Bell className="h-7 w-7" />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Notifications</h1>
            <p className="mt-3 max-w-2xl text-white/65">
              You have {unreadCount} unread CineVault updates.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="space-y-4">
      {allNotifications.map((item) => {
          const Icon = getIcon(item.type);
          const isRead = readIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`group rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
                isRead
                  ? "border-white/10 bg-white/[0.03] opacity-60"
                  : "border-yellow-400/25 bg-white/[0.06]"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold">{item.title}</h2>

                    <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs text-yellow-300">
                      {isRead ? "Read" : item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/60">{item.message}</p>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={item.href}
                      onClick={() => markAsRead(item.id)}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-yellow-400 hover:text-black"
                    >
                      Open
                    </Link>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item.id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-yellow-400/40 hover:text-yellow-300"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}