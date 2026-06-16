import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | CineVault",
  description:
    "Read the CineVault Terms of Use covering platform access, accounts, watchlists, copyright, service availability, and user responsibilities.",
  keywords: [
    "terms of use",
    "terms and conditions",
    "CineVault terms",
    "user agreement",
    "watchlist terms",
    "copyright",
  ],
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use | CineVault",
    description:
      "Read CineVault's terms covering accounts, watchlists, copyright, and platform usage.",
    url: "/terms",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | CineVault",
    description:
      "Read CineVault's Terms of Use and platform policies.",
    images: ["/og-image.png"],
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Use",
  description:
    "Terms of Use governing access to and use of CineVault services.",
  url: "https://cinevault-tau-drab.vercel.app/terms",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsJsonLd),
        }}
      />
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-14">
          <p className="text-yellow-400 uppercase tracking-[0.35em] text-sm font-bold">
            CineVault
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-100 bg-clip-text text-transparent">
            Terms of Use
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-white/70 leading-relaxed">
            These Terms of Use govern your access to and use of CineVault,
            including movies, TV show discovery features, watchlists,
            trailers, recommendations, and related entertainment services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Platform Usage
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              By using CineVault, you agree to use the platform only for
              lawful, personal, and informational purposes. Users may not
              misuse, disrupt, reverse engineer, or attempt unauthorized
              access to platform systems.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Content & Copyright
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              CineVault does not host or distribute copyrighted movies,
              episodes, or premium streaming content directly. Posters,
              trailers, ratings, and metadata belong to their respective
              owners and providers.
            </p>

            <p className="mt-4 text-white/70 leading-8">
              Third-party media content may be provided through services such
              as TMDB and YouTube.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Accounts & Watchlists
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              Users are responsible for maintaining the security of their
              accounts and personal watchlists. CineVault reserves the right
              to suspend accounts involved in abuse, spam, or malicious
              activity.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Service Availability
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              CineVault may update, modify, or temporarily suspend features
              as the platform evolves. We do not guarantee uninterrupted
              availability of all services or third-party integrations.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400">
              Limitation of Liability
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              CineVault is provided “as is” without warranties of any kind.
              We are not responsible for external websites, third-party
              services, or content linked through the platform.
            </p>
          </section>

          <section className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.05] p-8">
            <h2 className="text-2xl font-bold text-yellow-300">
              Updates to Terms
            </h2>

            <p className="mt-4 text-white/70 leading-8">
              These terms may evolve as CineVault expands. Continued use of
              the platform after updates means you accept the revised terms.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}