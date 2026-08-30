"use client";

import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Eye,
  Film,
  Gamepad2,
  Globe2,
  Lock,
  Mail,
  MonitorPlay,
  Palette,
  ShieldCheck,
  Sparkles,
  User2,
  Volume2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  changeWebsiteLanguage,
  languages,
} from "@/context/LanguageContext";

type Tab = "experience" | "alerts" | "privacy" | "account";

type Preferences = {
  language: string;
  theme: string;
  notifications: boolean;
  autoplay: boolean;
  trailerSound: boolean;
  reducedMotion: boolean;
  publicProfile: boolean;
  showActivity: boolean;
  matureContent: boolean;
};

const STORAGE_KEY = "cinryvan_preferences";

const defaults: Preferences = {
  language: "en",
  theme: "Midnight",
  notifications: true,
  autoplay: false,
  trailerSound: false,
  reducedMotion: false,
  publicProfile: true,
  showActivity: true,
  matureContent: false,
};

const themes = [
  {
    name: "Midnight",
    className: "from-[#111827] to-[#02040a]",
  },
  {
    name: "Cinematic Gold",
    className: "from-[#6b4f00] to-[#0d0900]",
  },
  {
    name: "Neon Blue",
    className: "from-[#075985] to-[#020617]",
  },
];

const tabs: Array<{ id: Tab; label: string; icon: typeof Sparkles }> = [
  { id: "experience", label: "Experience", icon: Sparkles },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "account", label: "Account", icon: User2 },
];

export default function SettingsContent({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>("experience");
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const oldTheme = localStorage.getItem("cinryvan_theme");
      const oldNotifications = localStorage.getItem("cinryvan_notifications");

      const next = stored
        ? { ...defaults, ...JSON.parse(stored) }
        : {
            ...defaults,
            theme: oldTheme || defaults.theme,
            notifications: oldNotifications !== "false",
          };

      setPreferences(next);
      document.documentElement.setAttribute("data-theme", next.theme);
    } catch {
      setPreferences(defaults);
    }
  }, []);

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    if (key === "theme") {
      localStorage.setItem("cinryvan_theme", String(value));
      document.documentElement.setAttribute("data-theme", String(value));
    }

    if (key === "notifications") {
      localStorage.setItem("cinryvan_notifications", String(value));
    }

    if (key === "language") {
      changeWebsiteLanguage(String(value));
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className={compact ? "p-5 sm:p-7" : "p-5 sm:p-8"}>
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
              activeTab === id
                ? "bg-yellow-400 text-black"
                : "border border-white/10 bg-white/[0.035] text-white/50 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "experience" && (
          <div className="space-y-5">
            <SectionTitle
              eyebrow="Look and feel"
              title="Your viewing experience"
              text="Control how CINRYVAN looks, moves and plays media."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => update("theme", theme.name)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    preferences.theme === theme.name
                      ? "border-yellow-400"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`h-20 bg-gradient-to-br ${theme.className}`} />
                  <div className="flex items-center justify-between bg-white/[0.035] px-4 py-3">
                    <span className="text-sm font-black">{theme.name}</span>
                    {preferences.theme === theme.name && (
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <SettingRow
              icon={<Globe2 />}
              title="Language"
              text="Choose the language used across the interface."
            >
              <select
                value={preferences.language}
                onChange={(event) => update("language", event.target.value)}
                className="max-w-[170px] rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold outline-none"
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow icon={<MonitorPlay />} title="Hero autoplay" text="Automatically rotate large featured carousels.">
              <Toggle checked={preferences.autoplay} onChange={(value) => update("autoplay", value)} />
            </SettingRow>

            <SettingRow icon={<Volume2 />} title="Trailer sound" text="Allow hover trailers to play sound when enabled.">
              <Toggle checked={preferences.trailerSound} onChange={(value) => update("trailerSound", value)} />
            </SettingRow>

            <SettingRow icon={<Palette />} title="Reduce motion" text="Limit animations and large movement effects.">
              <Toggle checked={preferences.reducedMotion} onChange={(value) => update("reducedMotion", value)} />
            </SettingRow>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-5">
            <SectionTitle eyebrow="Stay informed" title="Notification controls" text="Choose how CINRYVAN keeps you updated." />

            <SettingRow icon={<Bell />} title="In-app notifications" text="Trending titles, watchlist updates and release alerts.">
              <Toggle checked={preferences.notifications} onChange={(value) => update("notifications", value)} />
            </SettingRow>

            <ActionRow
              href="/notifications"
              icon={<Mail />}
              title="Email alerts"
              text="Subscribe without an account and choose alert topics."
              action="Manage"
            />

            <ActionRow
              href="/watchlist"
              icon={<Film />}
              title="Watchlist alerts"
              text="Review the titles that can generate future updates."
              action="Open"
            />
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-5">
            <SectionTitle eyebrow="Your visibility" title="Privacy and content" text="Control what other members can see." />

            <SettingRow icon={<Eye />} title="Public profile" text="Allow people to view your CINRYVAN profile.">
              <Toggle checked={preferences.publicProfile} onChange={(value) => update("publicProfile", value)} />
            </SettingRow>

            <SettingRow icon={<ShieldCheck />} title="Show recent activity" text="Display watchlist and discovery activity publicly.">
              <Toggle checked={preferences.showActivity} onChange={(value) => update("showActivity", value)} />
            </SettingRow>

            <SettingRow icon={<Film />} title="Mature content" text="Include mature titles in recommendations and search.">
              <Toggle checked={preferences.matureContent} onChange={(value) => update("matureContent", value)} />
            </SettingRow>

            <ActionRow href="/privacy" icon={<Lock />} title="Privacy policy" text="See how CINRYVAN handles account and usage data." action="Read" />
          </div>
        )}

        {activeTab === "account" && (
          <div className="space-y-5">
            <SectionTitle eyebrow="Your account" title="Profile and collection" text="Manage your identity and saved entertainment." />

            <ActionRow href="/profile" icon={<User2 />} title="Profile customizer" text="Change your banner, avatar, biography and favourites." action="Edit" />
            <ActionRow href="/watchlist" icon={<Film />} title="Watchlist" text="Manage saved movies, series and animation." action="Open" />
            <ActionRow href="/games" icon={<Gamepad2 />} title="Gaming hub" text="Explore games and platform collections." action="Explore" />
          </div>
        )}
      </div>

      <div className={`pointer-events-none fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-[#04110b] shadow-2xl transition ${saved ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
        Preferences saved
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="border-b border-white/10 pb-5">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
    </div>
  );
}

function SettingRow({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
        <div>
          <h3 className="font-black">{title}</h3>
          <p className="mt-1 text-sm text-white/40">{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ActionRow({ href, icon, title, text, action }: { href: string; icon: ReactNode; title: string; text: string; action: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-yellow-400/35">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm text-white/40">{text}</p>
      </div>
      <span className="hidden text-sm font-black text-white/40 group-hover:text-yellow-300 sm:block">{action}</span>
      <ChevronRight className="h-5 w-5 text-white/25 group-hover:text-yellow-300" />
    </Link>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-yellow-400" : "bg-white/15"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}
