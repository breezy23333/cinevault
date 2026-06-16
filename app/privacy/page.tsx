import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CineVault",
  description:
    "Learn how CineVault collects, uses, protects, and manages personal information, cookies, analytics, and user data.",
  keywords: [
    "privacy policy",
    "CineVault privacy",
    "user data",
    "data protection",
    "cookies",
    "analytics",
  ],
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | CineVault",
    description:
      "Learn how CineVault handles privacy, cookies, analytics, and user data.",
    url: "/privacy",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | CineVault",
    description:
      "Learn how CineVault collects, uses, and protects user information.",
    images: ["/og-image.png"],
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  description:
    "Learn how CineVault collects, uses, protects, and manages personal information and user data.",
  url: "https://cinevault-tau-drab.vercel.app/privacy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyJsonLd),
        }}
      />
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-3xl">
            CineVault respects your privacy and is committed to protecting
            your personal information while delivering a cinematic discovery
            experience for movies, TV shows, anime, and entertainment news.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Information We Collect
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              We may collect basic account information, watchlist activity,
              search preferences, device information, and anonymous analytics
              data to improve platform performance and user experience.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              How We Use Data
            </h2>

            <ul className="mt-4 space-y-3 text-white/70 leading-7 list-disc pl-6">
              <li>Improve recommendations and discovery systems</li>
              <li>Enhance performance and platform stability</li>
              <li>Personalize your CineVault experience</li>
              <li>Monitor trending content and analytics</li>
              <li>Protect against abuse and unauthorized access</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Cookies & Analytics
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              CineVault may use cookies and analytics technologies to
              understand engagement, improve features, and optimize content
              delivery. These tools help us understand how users interact
              with the platform.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Third-Party Services
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              Some content, trailers, posters, and metadata are provided by
              third-party services such as TMDB and YouTube. External
              platforms may apply their own privacy policies and terms.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Data Protection
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              We do not sell personal information. CineVault uses reasonable
              security practices designed to protect user information and
              maintain platform integrity.
            </p>
          </section>

          <section className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.05] p-8">
            <h2 className="text-2xl font-bold text-yellow-300">
              Contact
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              If you have any questions regarding this Privacy Policy,
              platform practices, or your data, please contact the
              CineVault team through the Support page.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}