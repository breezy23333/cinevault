"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Film,
  Flame,
  Gamepad2,
  Loader2,
  Mail,
  ShieldCheck,
  Star,
  Trophy,
  Tv,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  href: string;
  type: "trending" | "trailer" | "episode" | "watchlist" | "rating";
};

type AlertTopic =
  | "movies"
  | "tv"
  | "gaming"
  | "sports"
  | "trailers";

const defaultNotifications: Notification[] = [
  {
    id: "trending-movies",
    title: "Trending movies updated",
    message: "Fresh trending movies are now available on CINRYVAN.",
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
    message:
      "CINRYVAN will notify you when tracked TV shows release new episodes.",
    time: "Beta",
    href: "/tv",
    type: "episode",
  },
  {
    id: "watchlist-alerts",
    title: "Watchlist alerts enabled",
    message:
      "Titles saved to your watchlist can now generate update alerts.",
    time: "New",
    href: "/watchlist",
    type: "watchlist",
  },
  {
    id: "top-rated-refresh",
    title: "Top-rated titles refreshed",
    message: "Top-rated movies and TV shows have been updated.",
    time: "Recently",
    href: "/top",
    type: "rating",
  },
];

const alertTopics: Array<{
  id: AlertTopic;
  label: string;
  description: string;
  icon: typeof Film;
}> = [
  {
    id: "movies",
    label: "Movies",
    description: "Releases and trending films",
    icon: Film,
  },
  {
    id: "tv",
    label: "TV Shows",
    description: "Premieres and episode updates",
    icon: Tv,
  },
  {
    id: "gaming",
    label: "Gaming",
    description: "Game releases and announcements",
    icon: Gamepad2,
  },
  {
    id: "sports",
    label: "Sports",
    description: "Major stories and results",
    icon: Trophy,
  },
  {
    id: "trailers",
    label: "Trailers",
    description: "New movie and TV trailers",
    icon: Flame,
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
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<AlertTopic[]>([
    "movies",
    "tv",
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");

  const allNotifications = useMemo(
    () => [...tmdbNotifications, ...defaultNotifications],
    [tmdbNotifications],
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "cinryvan-read-notifications",
      );

      if (saved) {
        setReadIds(JSON.parse(saved));
      }

      const storedUser = localStorage.getItem("cinryvan_user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          if (user?.email) {
            setEmail(user.email);
          }
        } catch {
          // The stored value may not contain structured account data.
        }
      }
    } catch {
      setReadIds([]);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search,
    );

    const result = searchParams.get("subscription");

    if (result === "confirmed") {
      setSubscriptionMessage(
        "Your email is confirmed. CINRYVAN alerts are now active.",
      );
    }

    if (result === "expired") {
      setSubscriptionError(
        "That confirmation link expired. Enter your email again to receive a new link.",
      );
    }

    if (result === "invalid") {
      setSubscriptionError(
        "That confirmation link is invalid or has already been used.",
      );
    }

    if (result) {
      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );
    }

    if (result === "unsubscribed") {
      setSubscriptionMessage(
        "You have been unsubscribed from CINRYVAN email alerts.",
      );
    }
  }, []);

  const unreadCount = allNotifications.filter(
    (notification) => !readIds.includes(notification.id),
  ).length;

  function saveReadIds(next: string[]) {
    setReadIds(next);

    localStorage.setItem(
      "cinryvan-read-notifications",
      JSON.stringify(next),
    );
  }

  function markAsRead(id: string) {
    saveReadIds(Array.from(new Set([...readIds, id])));
  }

  function markAllAsRead() {
    saveReadIds(allNotifications.map((notification) => notification.id));
  }

  function toggleTopic(topic: AlertTopic) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubscriptionMessage("");
    setSubscriptionError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setSubscriptionError("Enter a valid email address.");
      return;
    }

    if (!selectedTopics.length) {
      setSubscriptionError("Choose at least one alert topic.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          topics: selectedTopics,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not create your subscription.",
        );
      }

      setSubscriptionMessage(
        data?.message ||
          "Check your email to confirm your CINRYVAN alerts.",
      );
    } catch (error) {
      setSubscriptionError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1450px]">
      <header className="relative overflow-hidden rounded-[34px] border border-yellow-400/20 bg-[#10131a] p-7 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(250,204,21,0.18),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(34,211,238,0.1),transparent_28%)]" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
              Live alert centre
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-7xl">
              Never miss the moment.
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-white/55">
              Follow new releases, trailers, gaming stories and sports
              headlines inside CINRYVAN or through optional email alerts.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-black">
              <Bell className="h-6 w-6" />
            </div>

            <div>
              <p className="text-2xl font-black">{unreadCount}</p>
              <p className="text-xs font-bold text-white/45">
                Unread updates
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
                Your feed
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Latest notifications
              </h2>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-black transition hover:border-yellow-400/40 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>

          <div className="space-y-3">
            {allNotifications.map((item) => {
              const Icon = getIcon(item.type);
              const isRead = readIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className={`group rounded-[22px] border p-5 transition ${
                    isRead
                      ? "border-white/10 bg-white/[0.025]"
                      : "border-yellow-400/20 bg-yellow-400/[0.045]"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                        isRead
                          ? "bg-white/[0.06] text-white/35"
                          : "bg-yellow-400/10 text-yellow-300 group-hover:bg-yellow-400 group-hover:text-black"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className={`font-black ${
                            isRead ? "text-white/55" : "text-white"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                            isRead
                              ? "bg-white/[0.05] text-white/30"
                              : "bg-yellow-400/10 text-yellow-300"
                          }`}
                        >
                          {isRead ? "Read" : item.time}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {item.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={item.href}
                          onClick={() => markAsRead(item.id)}
                          className="rounded-lg bg-white/10 px-4 py-2 text-xs font-black transition hover:bg-yellow-400 hover:text-black"
                        >
                          Open update
                        </Link>

                        {!isRead && (
                          <button
                            type="button"
                            onClick={() => markAsRead(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-black text-white/55 transition hover:border-yellow-400/40 hover:text-yellow-300"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <form
            onSubmit={subscribe}
            className="overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[#0b1118]"
          >
            <div className="border-b border-white/10 bg-cyan-400 px-6 py-6 text-[#041015]">
              <Mail className="h-7 w-7" />

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] opacity-60">
                Optional email alerts
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">
                Take the news with you
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-white/50">
                No account is required. Enter your email, choose what
                interests you and confirm through the message we send.
              </p>

              <label className="mt-6 block">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                  Email address
                </span>

                <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-cyan-300">
                  <Mail className="h-4 w-4 shrink-0 text-white/30" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-white/20"
                  />
                </div>
              </label>

              <fieldset className="mt-6">
                <legend className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                  Choose your alerts
                </legend>

                <div className="mt-3 space-y-2">
                  {alertTopics.map((topic) => {
                    const Icon = topic.icon;
                    const selected = selectedTopics.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-cyan-300/40 bg-cyan-400/10"
                            : "border-white/[0.07] bg-white/[0.025] hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-cyan-400 text-black"
                              : "bg-white/[0.06] text-white/40"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black">
                            {topic.label}
                          </p>

                          <p className="mt-0.5 text-xs text-white/35">
                            {topic.description}
                          </p>
                        </div>

                        {selected && (
                          <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {subscriptionError && (
                <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
                  {subscriptionError}
                </p>
              )}

              {subscriptionMessage && (
                <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300">
                  {subscriptionMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-[#041015] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Enable Email Alerts
                  </>
                )}
              </button>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-white/30">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/60" />
                You must confirm your email before alerts begin. Every email
                will contain an unsubscribe link.
              </p>
            </div>
          </form>
        </aside>
      </div>
    </section>
  );
}