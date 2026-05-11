import Link from "next/link";
import { Bell, Film, Mic, Star, Sparkles } from "lucide-react";

const notifications = [
  {
    icon: Film,
    title: "New trailers are available",
    message: "Fresh trailers have been added across movies and TV shows.",
    time: "Today",
    href: "/trending",
  },
  {
    icon: Sparkles,
    title: "CineVault recommendations updated",
    message: "Explore new picks based on trending movies, series, anime, and cartoons.",
    time: "Today",
    href: "/browse",
  },
  {
    icon: Mic,
    title: "Voice search is now active",
    message: "Describe a movie or show using your voice and CineVault will search for it.",
    time: "New",
    href: "/search",
  },
  {
    icon: Star,
    title: "Top rated titles refreshed",
    message: "The top-rated movie and TV lists have been updated.",
    time: "Recently",
    href: "/top",
  },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#080d16] px-4 pb-20 pt-28 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400/15 via-white/[0.04] to-transparent p-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
            <Bell className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black">Notifications</h1>

          <p className="mt-3 max-w-2xl text-white/65">
            Stay updated with new trailers, recommendations, platform features,
            and trending CineVault activity.
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-yellow-400/40 hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold">{item.title}</h2>
                    <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs text-yellow-300">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/60">
                    {item.message}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}