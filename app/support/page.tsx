// app/support/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../../components/support/ContactForm";
import FAQ from "../../components/support/FAQ";

export const metadata: Metadata = {
  title: "Support • CineVault",
  description: "Get help, contact us, and browse FAQs.",
};

const CATEGORIES = [
  { title: "Account & Profile", href: "/support/account", desc: "Password, email, profile & region." },
  { title: "Search & Browse", href: "/support/search", desc: "Find movies, shows, and providers." },
  { title: "Watch Providers", href: "/support/providers", desc: "Netflix, Prime Video, Showmax, etc." },
  { title: "Technical Issues", href: "/support/tech", desc: "Loading errors, layout glitches." },
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO — solid background */}
      <section className="relative h-[320px] sm:h-[420px] lg:h-[500px] overflow-hidden rounded-[28px] bg-[#0f1218] ring-1 ring-white/5">
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Need Help?</h1>
          <p className="mt-3 max-w-2xl text-lg opacity-95">
            We’ve got you covered — browse quick topics, read FAQs, or message us.
          </p>
        </div>
      </section>

      {/* HORIZONTAL CARDS — hover turns yellow */}
      <section className="mt-8 flex snap-x gap-6 overflow-x-auto pb-6 hide-scrollbar">
        {CATEGORIES.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group min-w-[240px] snap-start rounded-2xl bg-zinc-900 text-white p-5 shadow-lg ring-1 ring-white/10
                       transition-transform hover:-translate-y-1 hover:bg-yellow-400 hover:text-zinc-900 hover:ring-yellow-400
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm opacity-80 group-hover:opacity-90">{c.desc}</p>
          </Link>
        ))}
      </section>

      {/* ABOUT + WHAT'S INCLUDED */}
      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">About CineVault Support</h2>
          <p className="mt-3 text-zinc-600">
            We help you find where to watch — and fix issues quickly. Our team
            monitors provider feeds and resolves account or region problems fast.
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-sm text-emerald-700">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />
              All systems operational. See <Link className="underline" href="/status">status page</Link>.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">What’s included</h3>
          <ul className="grid gap-3 text-zinc-700">
            <li className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Help articles & FAQs
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Under-24h responses
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Region-specific provider guidance
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Troubleshooting for layout & loading
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold">Frequently Asked Questions</h2>
        <FAQ />
      </section>

      {/* CONTACT — solid dark background */}
      <section className="relative mt-16 overflow-hidden rounded-[28px] bg-[#0b0f14] ring-1 ring-white/5">
        <div className="relative z-10 mx-auto max-w-3xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl font-bold">Still have questions?</h2>
          <p className="mt-2 max-w-2xl opacity-90">
            Send us a message with screenshots, page links, and your browser version for a faster fix.
          </p>

          {/* Put the form on a white card for readability */}
          <div className="mt-6 rounded-2xl bg-white p-4 sm:p-6 text-zinc-900 ring-1 ring-black/5">
            <ContactForm />
          </div>
        </div>
      </section>

      <p className="mt-10 text-sm text-zinc-500">
        Tip: include the page URL and steps to reproduce any issue.
      </p>
    </main>
  );
}
