import { Bookmark, Bell, Clock, User2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 shadow-[0_0_80px_rgba(250,204,21,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            CineVault Account
          </p>

          <div className="mt-6 flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 text-black">
              <User2 className="h-10 w-10" />
            </div>

            <div>
              <h1 className="text-4xl font-black">Your profile</h1>
              <p className="mt-2 text-white/60">
                Logged in and ready to continue your cinematic journey.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ProfileCard icon={<Bookmark />} title="Watchlist" text="Saved movies and shows." />
          <ProfileCard icon={<Clock />} title="Continue Watching" text="Resume titles later." />
          <ProfileCard icon={<Bell />} title="Notifications" text="New releases and alerts." />
        </div>
      </section>
    </main>
  );
}

function ProfileCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-300">
        {icon}
      </div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{text}</p>
    </div>
  );
}