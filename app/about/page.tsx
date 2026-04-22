import AboutFeatures from "@/components/AboutFeatures";
import Image from "next/image";
import Link from "next/link";
import SpotlightDeck from "@/components/SpotlightDeck";

export const metadata = {
  title: "About — CineVault",
  description: "Who we are and how we help you find where to watch.",
};

export default function AboutPage() {
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/15 via-emerald-300/10 to-sky-300/10" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_40%_-150px,rgba(255,255,255,0.65),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
          <p className="about-reveal text-xs uppercase tracking-[0.2em] text-yellow-400/90">
            Our Mission
          </p>
          <h1 className="about-reveal mt-2 text-3xl font-bold text-zinc-50 md:text-4xl">
            Find where to watch—fast, accurate, beautiful.
          </h1>
          <p className="about-reveal mt-3 max-w-3xl text-zinc-300">
            CineVault helps you discover movies and shows and jump straight to
            official streaming sources. No noise, no dead links—just clean,
            verified results.
          </p>

          {/* Stats row */}
          <div className="about-reveal mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["55k+", "Titles indexed"],
              ["7k+", "Providers & regions"],
              ["24/7", "Support"],
            ].map(([n, label], i) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-zinc-900/40 px-5 py-4"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <div className="text-2xl font-bold text-yellow-400">{n}</div>
                <div className="text-sm text-zinc-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us — 3 feature blocks with animation */}
      <section className="mx-auto mt-6 max-w-6xl px-4">
        <h2 className="about-reveal text-xl font-semibold text-zinc-100">Why choose CineVault</h2>
        <p className="about-reveal mt-2 max-w-2xl text-zinc-400">
          Built for speed and trust. Designed to feel familiar—like browsing your
          favorite store or game launcher.
        </p>

        <div className="mt-5">
          <AboutFeatures />
        </div>
      </section>

      {/* Story / image strip */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <div className="about-reveal grid items-center gap-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Our story</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              We started CineVault after getting tired of bouncing between search
              engines, apps, and sketchy sites just to watch one film. So we built
              a fast indexer, clean UI, and a direct line to support. That’s it—
              no tracking, no clutter.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/contact"
                className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300 hover:bg-yellow-400/20"
              >
                Contact Support
              </Link>
              <Link
                href="/browse"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Browse Titles
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10">
            {/* replace with your branded image if you want */}
            <Image
              alt="CineVault preview"
              fill
              src="https://images.unsplash.com/photo-1608178398319-48f814d0750c?q=80&w=1974&auto=format&fit=crop"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
