import { Settings } from "lucide-react";
import SettingsContent from "@/components/SettingsContent";

export const metadata = {
  title: "Settings",
  description: "Manage your CINRYVAN account, privacy, alerts and viewing preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 pb-20 pt-28 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-[32px] border border-yellow-400/15 bg-[#10131a] p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(250,204,21,0.17),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.08),transparent_25%)]" />
          <div className="relative flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">Control centre</p>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-6xl">Settings</h1>
              <p className="mt-2 text-white/45">Make CINRYVAN work the way you want.</p>
            </div>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0f16]">
          <SettingsContent />
        </section>
      </div>
    </main>
  );
}
