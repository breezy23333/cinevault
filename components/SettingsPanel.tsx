"use client";

import { useEffect, useState } from "react";
import { Bell, Globe2, Moon, User2, X } from "lucide-react";

const languages = [
  "English",
  "Spanish",
  "French",
  "Portuguese",
  "German",
  "Hindi",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
];

const themes = ["Midnight", "Cinematic Gold", "Neon Blue"];

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Midnight");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    setLanguage(localStorage.getItem("cinevault_language") || "English");
    const savedTheme = localStorage.getItem("cinevault_theme") || "Midnight";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setNotifications(localStorage.getItem("cinevault_notifications") !== "false");
  }, []);

  function updateLanguage(value: string) {
    setLanguage(value);
    localStorage.setItem("cinevault_language", value);
  }

  function updateTheme(value: string) {
    setTheme(value);
    localStorage.setItem("cinevault_theme", value);
    document.documentElement.setAttribute("data-theme", value);
    }

  function updateNotifications(value: boolean) {
    setNotifications(value);
    localStorage.setItem("cinevault_notifications", String(value));
  }

  return (
    <div className="fixed right-4 top-20 z-[9999] w-[92vw] max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#07111f]/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-lg font-black text-white">Settings</h2>
          <p className="text-xs text-white/50">Customize your CineVault experience</p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <SettingItem
          icon={<Globe2 size={18} />}
          title="Language"
          text="Choose your display language"
        >
          <select
            value={language}
            onChange={(e) => updateLanguage(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            {languages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>
        </SettingItem>

        <SettingItem
          icon={<Moon size={18} />}
          title="Theme"
          text="Change CineVault appearance"
        >
          <select
            value={theme}
            onChange={(e) => updateTheme(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            {themes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </SettingItem>

        <SettingItem
          icon={<Bell size={18} />}
          title="Notifications"
          text="Trending and watchlist alerts"
        >
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => updateNotifications(e.target.checked)}
            className="h-5 w-5 accent-yellow-400"
          />
        </SettingItem>

        <SettingItem
          icon={<User2 size={18} />}
          title="Account"
          text="Profile, watchlist and preferences"
        >
          <button className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300">
            Manage
          </button>
        </SettingItem>
      </div>
    </div>
  );
}

function SettingItem({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-yellow-400/15 p-3 text-yellow-300">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-xs text-white/45">{text}</p>
        </div>
      </div>

      {children}
    </div>
  );
}