import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | CINRYVAN",
  description: "Manage your CINRYVAN settings and preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white p-10">
      <h1 className="text-4xl font-black">CINRYVAN Settings</h1>

      <p className="mt-4 text-white/60">
        Settings system coming soon.
      </p>
    </main>
  );
}