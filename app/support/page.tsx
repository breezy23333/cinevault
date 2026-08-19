import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../../components/support/ContactForm";
import FAQ from "../../components/support/FAQ";

export const metadata: Metadata = {
  title: "Support | CINRYVAN",
  description:
    "Get CINRYVAN support for account issues, search problems, watch providers, technical bugs, FAQs, and platform help.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support | CINRYVAN",
    description:
      "Browse CINRYVAN FAQs, support topics, account help, provider guidance, and technical troubleshooting.",
    url: "/support",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | CINRYVAN",
    description:
      "Get help with CINRYVAN accounts, search, providers, and technical issues.",
    images: ["/og-image.png"],
  },
};

const CATEGORIES = [
  {
    number: "01",
    title: "Account & Profile",
    href: "/support/account",
    desc: "Passwords, email, profile settings and region preferences.",
  },
  {
    number: "02",
    title: "Search & Browse",
    href: "/support/search",
    desc: "Find movies, shows, animation, games and news.",
  },
  {
    number: "03",
    title: "Watch Providers",
    href: "/support/providers",
    desc: "Streaming availability, provider links and regional access.",
  },
  {
    number: "04",
    title: "Technical Issues",
    href: "/support/tech",
    desc: "Loading errors, broken pages and display problems.",
  },
];

const supportJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "CINRYVAN Support",
  description:
    "Get CINRYVAN support for account issues, search problems, watch providers, technical bugs, FAQs, and platform help.",
  url: "https://cinryvan.vercel.app/support",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative overflow-hidden border border-white/10 bg-[#111925] px-6 py-14 shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:px-10 md:py-20 lg:px-16">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-yellow-400">
                CINRYVAN Support
              </p>
              <h1 className="mt-4 text-4xl font-black leading-none tracking-tight sm:text-5xl md:text-6xl">
                How can we help?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
                Find quick answers for your account, discovery tools, watch
                providers and technical issues—or send us a message.
              </p>
            </div>

            <a
              href="#contact-support"
              className="inline-flex w-fit items-center justify-center bg-yellow-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111925]"
            >
              Contact support
              <span aria-hidden="true" className="ml-2">→</span>
            </a>
          </div>
        </section>

        <section aria-labelledby="support-topics" className="py-12">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Quick help
              </p>
              <h2 id="support-topics" className="mt-2 text-2xl font-black sm:text-3xl">
                Choose a support topic
              </h2>
            </div>
            <p className="hidden text-sm text-white/40 sm:block">4 help areas</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative min-h-52 overflow-hidden border border-white/10 bg-[#111925] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/70 hover:bg-[#161f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-black tracking-[0.25em] text-yellow-400">
                    {category.number}
                  </span>
                  <span className="grid h-9 w-9 place-items-center border border-white/10 bg-white/5 text-white transition group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
                    ↗
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-black transition group-hover:text-yellow-300">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  {category.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Support guide
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Get a faster, clearer answer
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/55">
              Start with the topic closest to your issue. If you contact us,
              include the page address and what happened before the problem
              appeared.
            </p>
          </div>

          <div className="border border-white/10 bg-[#111925] p-6 sm:p-8">
            <h3 className="text-lg font-black">Useful details to include</h3>
            <ul className="mt-5 grid gap-4 text-sm text-white/60">
              {["The page URL", "Your device and browser", "Steps to reproduce it", "A screenshot, when possible"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 bg-yellow-400" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="frequently-asked-questions">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Common answers
            </p>
            <h2
              id="frequently-asked-questions"
              className="mt-2 text-3xl font-black"
            >
              Frequently asked questions
            </h2>
          </div>
          <div className="border border-white/10 bg-white/[0.025] p-4 sm:p-6">
            <FAQ />
          </div>
        </section>

        <section
          id="contact-support"
          className="relative mt-16 scroll-mt-28 overflow-hidden border border-yellow-400/20 bg-[#101722]"
        >
          <div className="absolute right-0 top-0 h-64 w-64 bg-yellow-400/10 blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-[.72fr_1.28fr]">
            <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Contact us
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Still need help?
              </h2>
              <p className="mt-4 leading-7 text-white/55">
                Send us the details and we’ll review your question or technical
                report.
              </p>
              <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-6 text-white/40">
                Please do not include passwords or payment information.
              </p>
            </div>

            <div className="bg-white p-5 text-zinc-900 sm:p-8 lg:p-10">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}