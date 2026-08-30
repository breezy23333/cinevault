"use client";

import { Settings, X } from "lucide-react";
import SettingsContent from "@/components/SettingsContent";

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm" onMouseDown={onClose}>
      <aside
        className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-white/10 bg-[#080d16] shadow-2xl sm:max-w-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#080d16]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Settings</h2>
              <p className="text-xs text-white/45">Control your CINRYVAN experience</p>
            </div>
          </div>

          <button type="button" onClick={onClose} aria-label="Close settings" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </header>

        <SettingsContent compact />
      </aside>
    </div>
  );
}
