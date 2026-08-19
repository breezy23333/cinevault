import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | CINRYVAN",
  description:
    "Learn how CINRYVAN uses cookies, browser storage, privacy-friendly analytics and related technologies.",
  keywords: [
    "cookie policy",
    "CINRYVAN cookies",
    "website cookies",
    "browser storage",
    "privacy",
    "analytics",
  ],
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Cookie Policy | CINRYVAN",
    description:
      "Understand how CINRYVAN uses cookies, browser storage and related technologies.",
    url: "/cookies",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | CINRYVAN",
    description:
      "Learn how CINRYVAN uses cookies, privacy-friendly analytics and browser storage.",
    images: ["/og-image.png"],
  },
};

const policyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "CINRYVAN Cookie Policy",
  description:
    "Learn how CINRYVAN uses cookies, browser storage, analytics and related technologies.",
  url: "https://cinryvan.vercel.app/cookies",
  dateModified: "2026-08-19",
};

const SECTIONS = [
  { number: "01", label: "Overview", href: "#overview" },
  { number: "02", label: "Technologies we use", href: "#technologies" },
  { number: "03", label: "Third parties", href: "#third-parties" },
  { number: "04", label: "Your choices", href: "#choices" },
  { number: "05", label: "Updates & contact", href: "#updates" },
];

const TECHNOLOGIES = [
  {
    type: "Essential storage",
    purpose: "Keeps core features working, including authentication and security.",
    duration: "Session or as required",
    choice: "Required for affected features",
  },
  {
    type: "Preference storage",
    purpose: "Remembers settings or choices on the device where they were made.",
    duration: "Until cleared or replaced",
    choice: "Can be cleared in your browser",
  },
  {
    type: "Privacy-friendly analytics",
    purpose: "Helps us understand page traffic and general platform performance.",
    duration: "No analytics cookie used by Vercel Web Analytics",
    choice: "Subject to browser privacy controls",
  },
  {
    type: "Embedded media storage",
    purpose: "May support video playback and preferences when you interact with embedded content.",
    duration: "Controlled by the media provider",
    choice: "Avoid or block third-party content",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(policyJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className="relative overflow-hidden border border-white/10 bg-[#101722] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full border-[54px] border-yellow-400/[0.06]" />
          <div className="absolute right-20 top-16 h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_28px_8px_rgba(250,204,21,.4)]" />
          <div className="relative z-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.3em]">
              <span className="text-yellow-400">CINRYVAN Legal</span>
              <span className="h-px w-8 bg-white/20" />
              <span className="text-white/35">Last updated 19 August 2026</span>
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Cookie Policy
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
              This policy explains when CINRYVAN uses cookies, local browser
              storage and related technologies, what they do, and the choices
              available to you.
            </p>
          </div>
        </header>

        <div className="grid gap-10 py-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-white/35">
              On this page
            </p>
            <nav aria-label="Cookie policy sections" className="border-y border-white/10">
              {SECTIONS.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="group flex items-center gap-4 border-b border-white/10 py-4 text-sm font-bold text-white/55 transition last:border-b-0 hover:text-yellow-300"
                >
                  <span className="text-[10px] font-black text-yellow-400/70">
                    {section.number}
                  </span>
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 border border-yellow-400/20 bg-yellow-400/[0.06] p-5">
              <p className="text-sm leading-6 text-white/55">
                This policy should be read together with our privacy information.
              </p>
              <Link
                href="/privacy"
                className="mt-4 inline-flex text-sm font-black text-yellow-400 hover:text-yellow-300"
              >
                Read Privacy Policy →
              </Link>
            </div>
          </aside>

          <article className="min-w-0 space-y-14">
            <section id="overview" className="scroll-mt-32">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                01 · Overview
              </p>
              <h2 className="mt-3 text-3xl font-black">What are cookies and browser storage?</h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-white/60">
                <p>
                  Cookies are small pieces of data a website can ask your
                  browser to store. They can help maintain a secure session,
                  remember a preference, or enable content supplied by another
                  service.
                </p>
                <p>
                  Browsers also provide storage technologies such as local
                  storage and session storage. These are not cookies, but they
                  can serve similar purposes, such as remembering an interface
                  choice on your device.
                </p>
              </div>
            </section>

            <section id="technologies" className="scroll-mt-32">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                02 · Technologies we use
              </p>
              <h2 className="mt-3 text-3xl font-black">How storage may be used</h2>
              <p className="mt-4 max-w-3xl leading-7 text-white/55">
                The exact items present can depend on the features you use,
                whether you are signed in, and how your browser is configured.
              </p>

              <div className="mt-7 overflow-hidden border border-white/10">
                <div className="hidden grid-cols-[.8fr_1.35fr_.9fr_.9fr] bg-white/[0.06] px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 md:grid">
                  <span>Category</span>
                  <span>Purpose</span>
                  <span>Typical duration</span>
                  <span>Your choice</span>
                </div>
                {TECHNOLOGIES.map((item) => (
                  <div
                    key={item.type}
                    className="grid gap-4 border-t border-white/10 bg-[#0d131e] p-5 first:border-t-0 md:grid-cols-[.8fr_1.35fr_.9fr_.9fr] md:items-start"
                  >
                    <h3 className="font-black text-white">{item.type}</h3>
                    <p className="text-sm leading-6 text-white/55">{item.purpose}</p>
                    <p className="text-sm leading-6 text-white/45">{item.duration}</p>
                    <p className="text-sm leading-6 text-white/45">{item.choice}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="third-parties" className="scroll-mt-32">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                03 · Third parties
              </p>
              <h2 className="mt-3 text-3xl font-black">Analytics, media and external services</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                    Platform analytics
                  </span>
                  <h3 className="mt-3 text-xl font-black">Vercel Web Analytics</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    CINRYVAN uses privacy-friendly traffic measurement. Vercel
                    states that its Web Analytics product does not use cookies
                    and stores anonymized data.
                  </p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                    Embedded content
                  </span>
                  <h3 className="mt-3 text-xl font-black">Video and external media</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Embedded videos may come from YouTube using its
                    privacy-enhanced mode. The provider may still process data
                    when you interact with its player, under its own policies.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/45">
                Selecting a streaming provider, store, news article or another
                external link takes you to that service. Its own privacy and
                cookie terms then apply.
              </p>
            </section>

            <section id="choices" className="scroll-mt-32">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                04 · Your choices
              </p>
              <h2 className="mt-3 text-3xl font-black">Managing stored data</h2>
              <p className="mt-5 leading-8 text-white/60">
                Most browsers let you view, delete or block cookies and site
                data. You can also clear local storage, restrict third-party
                content, or use private-browsing controls. Blocking essential
                storage may prevent sign-in or other account features from
                working correctly.
              </p>
              <div className="mt-6 border-l-2 border-yellow-400 bg-yellow-400/[0.06] p-5 text-sm leading-7 text-white/60">
                Browser menus differ. Look for settings named Privacy,
                Cookies, Site Data or Tracking Protection.
              </div>
            </section>

            <section id="updates" className="scroll-mt-32 border-t border-white/10 pt-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                05 · Updates & contact
              </p>
              <h2 className="mt-3 text-3xl font-black">Changes to this policy</h2>
              <p className="mt-5 leading-8 text-white/60">
                We may update this page when CINRYVAN’s features, storage
                practices or service providers change. The date at the top of
                this page identifies the latest revision.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/support"
                  className="bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Ask a privacy question
                </Link>
                <Link
                  href="/privacy"
                  className="border border-white/15 bg-white/5 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300"
                >
                  Privacy Policy
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}