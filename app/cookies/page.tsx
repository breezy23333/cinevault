import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | CineVault",
  description:
    "Learn how CineVault uses cookies, browser storage, analytics, personalization, and related technologies.",
  keywords: [
    "cookie policy",
    "CineVault cookies",
    "website cookies",
    "browser storage",
    "privacy",
    "analytics cookies",
  ],
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    title: "Cookie Policy | CineVault",
    description:
      "Understand how CineVault uses cookies and browser storage technologies.",
    url: "/cookies",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | CineVault",
    description:
      "Learn how CineVault uses cookies, analytics, and browser storage.",
    images: ["/og-image.png"],
  },
};

const policyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cookie Policy",
  description:
    "Learn how CineVault uses cookies, browser storage, analytics, and personalization technologies.",
  url: "https://cinevault-tau-drab.vercel.app/cookies",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(policyJsonLd),
        }}
      />

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-14">
          <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm font-bold">
            CineVault
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-100 bg-clip-text text-transparent">
            Cookie Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-white/70 leading-relaxed">
            This Cookie Policy explains how CineVault uses cookies,
            browser storage, and related technologies to improve
            platform functionality, personalization, analytics,
            and entertainment discovery experiences.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              What Are Cookies?
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              Cookies are small data files stored on your device that help
              websites remember preferences, maintain sessions, and improve
              overall user experiences.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              How CineVault Uses Cookies
            </h2>

            <ul className="mt-4 space-y-3 text-white/70 leading-7 list-disc pl-6">
              <li>Remember login sessions and preferences</li>
              <li>Store watchlist and personalization settings</li>
              <li>Improve search and recommendation systems</li>
              <li>Analyze traffic and platform engagement</li>
              <li>Enhance performance and stability</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Third-Party Services
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              CineVault may use trusted third-party services such as TMDB,
              YouTube, analytics providers, or embedded content platforms.
              These services may use their own cookies or tracking
              technologies subject to their individual policies.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Managing Cookies
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              You can manage or disable cookies through your browser
              settings. Some CineVault features may not function correctly
              if cookies or local storage are disabled.
            </p>
          </section>

          <section className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.05] p-8">
            <h2 className="text-2xl font-bold text-yellow-300">
              Policy Updates
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              This Cookie Policy may be updated periodically as CineVault
              evolves and introduces new features or technologies.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}