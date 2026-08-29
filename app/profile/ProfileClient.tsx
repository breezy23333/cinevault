"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Bell,
  Bookmark,
  Camera,
  Clock3,
  Edit3,
  Film,
  Gamepad2,
  LogOut,
  MapPin,
  Save,
  Settings,
  ShieldCheck,
  Star,
  Tv,
  User2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type ProfileData = {
  displayName: string;
  username: string;
  bio: string;
  country: string;
  avatar: string;
  banner: string;
  favouriteMovie: string;
  favouriteShow: string;
  favouriteGame: string;
};

const defaultProfile: ProfileData = {
  displayName: "Cinryvan Member",
  username: "cinryvan_user",
  bio: "Movies, television, animation and gaming all belong in one universe.",
  country: "South Africa",
  avatar: "",
  banner: "",
  favouriteMovie: "Not selected",
  favouriteShow: "Not selected",
  favouriteGame: "Not selected",
};

const PROFILE_STORAGE_KEY = "cinryvan_profile";

export default function ProfileClient() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const storedUser = localStorage.getItem("cinryvan_user");

      let nextProfile = { ...defaultProfile };

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          nextProfile = {
            ...nextProfile,
            displayName:
              user?.name ||
              user?.displayName ||
              user?.username ||
              nextProfile.displayName,
            username:
              user?.username ||
              user?.email?.split("@")[0] ||
              nextProfile.username,
          };
        } catch {
          nextProfile.displayName = storedUser;
        }
      }

      if (storedProfile) {
        nextProfile = {
          ...nextProfile,
          ...JSON.parse(storedProfile),
        };
      }

      setProfile(nextProfile);
      setDraft(nextProfile);
    } catch {
      setProfile(defaultProfile);
      setDraft(defaultProfile);
    } finally {
      setLoaded(true);
    }
  }, []);

  function openEditor() {
    setDraft(profile);
    setEditing(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanProfile = {
      ...draft,
      displayName: draft.displayName.trim() || "Cinryvan Member",
      username:
        draft.username
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "") || "cinryvan_user",
      bio: draft.bio.trim(),
      country: draft.country.trim(),
      avatar: draft.avatar.trim(),
      banner: draft.banner.trim(),
      favouriteMovie: draft.favouriteMovie.trim() || "Not selected",
      favouriteShow: draft.favouriteShow.trim() || "Not selected",
      favouriteGame: draft.favouriteGame.trim() || "Not selected",
    };

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(cleanProfile),
    );

    setProfile(cleanProfile);
    setDraft(cleanProfile);
    setEditing(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("cinryvan_user");
    window.location.href = "/login";
  }

  const initials = profile.displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pb-20 text-white">
      <section className="relative min-h-[350px] border-b border-white/10">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.24),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.14),transparent_28%),linear-gradient(135deg,#22200d,#08101b_55%,#05070d)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/55 to-black/20" />

        <div className="relative mx-auto flex min-h-[350px] max-w-[1450px] items-end px-5 pb-8 pt-32 lg:px-8">
          <div className="flex w-full flex-col gap-6 md:flex-row md:items-end">
            <div className="relative shrink-0">
              <div className="h-36 w-36 overflow-hidden rounded-[28px] border-4 border-[#05070d] bg-yellow-400 shadow-2xl sm:h-44 sm:w-44">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-black text-black">
                    {initials || <User2 className="h-16 w-16" />}
                  </div>
                )}
              </div>

              <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-[#05070d] bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                  {loaded ? profile.displayName : "Loading profile"}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Member
                </span>
              </div>

              <p className="mt-2 font-bold text-white/45">
                @{profile.username}
              </p>

              {profile.country && (
                <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 text-yellow-400" />
                  {profile.country}
                </p>
              )}
            </div>

            <div className="flex gap-3 pb-2">
              <button
                type="button"
                onClick={openEditor}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>

              <Link
                href="/settings"
                aria-label="Profile settings"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-black/35 backdrop-blur-md transition hover:border-white/35"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1450px] gap-6 px-5 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
              About me
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
              {profile.bio || "This member has not added a biography yet."}
            </p>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
                  Recent activity
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Your Cinryvan journey
                </h2>
              </div>

              <Clock3 className="h-7 w-7 text-white/20" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ActivityCard
                icon={<Bookmark className="h-5 w-5" />}
                title="Watchlist"
                text="Open your saved movies, shows and animation."
                href="/watchlist"
              />

              <ActivityCard
                icon={<Clock3 className="h-5 w-5" />}
                title="Continue Watching"
                text="Resume the titles you explored recently."
                href="/watchlist"
              />

              <ActivityCard
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                text="See new releases, updates and alerts."
                href="/notifications"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
              Personal collection
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Favourite worlds
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <FavouriteCard
                icon={<Film className="h-6 w-6" />}
                label="Favourite movie"
                value={profile.favouriteMovie}
                color="yellow"
              />

              <FavouriteCard
                icon={<Tv className="h-6 w-6" />}
                label="Favourite show"
                value={profile.favouriteShow}
                color="purple"
              />

              <FavouriteCard
                icon={<Gamepad2 className="h-6 w-6" />}
                label="Favourite game"
                value={profile.favouriteGame}
                color="cyan"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
              Profile level
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-yellow-400 text-2xl font-black">
                1
              </div>

              <div>
                <h2 className="text-xl font-black">New Explorer</h2>
                <p className="mt-1 text-sm text-white/45">
                  Your journey has started.
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[20%] rounded-full bg-yellow-400" />
            </div>

            <p className="mt-2 text-xs font-bold text-white/35">
              20% until Level 2
            </p>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
              Badges
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Badge
                icon={<Star className="h-5 w-5" />}
                label="Explorer"
              />

              <Badge
                icon={<Film className="h-5 w-5" />}
                label="Cinema"
              />

              <Badge
                icon={<Gamepad2 className="h-5 w-5" />}
                label="Player"
              />
            </div>
          </section>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </aside>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onMouseDown={() => setEditing(false)}
        >
          <form
            onSubmit={saveProfile}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-white/15 bg-[#101218] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
                  Profile customizer
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Make it yours
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <ProfileInput
                label="Display name"
                value={draft.displayName}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    displayName: value,
                  })
                }
              />

              <ProfileInput
                label="Username"
                value={draft.username}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    username: value,
                  })
                }
              />

              <ProfileInput
                label="Country"
                value={draft.country}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    country: value,
                  })
                }
              />

              <ProfileInput
                label="Avatar image URL"
                value={draft.avatar}
                placeholder="https://..."
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    avatar: value,
                  })
                }
              />

              <div className="sm:col-span-2">
                <ProfileInput
                  label="Profile banner URL"
                  value={draft.banner}
                  placeholder="https://..."
                  onChange={(value) =>
                    setDraft({
                      ...draft,
                      banner: value,
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
                  Biography
                </label>

                <textarea
                  value={draft.bio}
                  maxLength={240}
                  rows={4}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      bio: event.target.value,
                    })
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-yellow-400"
                />

                <p className="mt-1 text-right text-xs text-white/30">
                  {draft.bio.length}/240
                </p>
              </div>

              <ProfileInput
                label="Favourite movie"
                value={draft.favouriteMovie}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    favouriteMovie: value,
                  })
                }
              />

              <ProfileInput
                label="Favourite show"
                value={draft.favouriteShow}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    favouriteShow: value,
                  })
                }
              />

              <ProfileInput
                label="Favourite game"
                value={draft.favouriteGame}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    favouriteGame: value,
                  })
                }
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-black transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function ActivityCard({
  icon,
  title,
  text,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[22px] border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/45">
        {text}
      </p>
    </Link>
  );
}

function FavouriteCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: "yellow" | "purple" | "cyan";
}) {
  const colors = {
    yellow: "border-yellow-400/20 bg-yellow-400/[0.06] text-yellow-300",
    purple: "border-purple-400/20 bg-purple-400/[0.06] text-purple-300",
    cyan: "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300",
  };

  return (
    <div className={`rounded-[22px] border p-5 ${colors[color]}`}>
      {icon}

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
        {label}
      </p>

      <h3 className="mt-2 text-xl font-black text-white">
        {value}
      </h3>
    </div>
  );
}

function Badge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
        {icon}
      </div>

      <p className="mt-2 text-[10px] font-bold text-white/45">
        {label}
      </p>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition placeholder:text-white/20 focus:border-yellow-400"
      />
    </label>
  );
}