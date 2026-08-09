import { getSportsNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import Link from "next/link";
import SportsSubCategories from "@/components/SportsSubCategories";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sports News | CINRYVAN",
  description:
    "Read the latest sports news, soccer headlines, football updates, racing stories, basketball news, tennis updates, and live sports coverage on CINRYVAN.",
  alternates: {
    canonical: "/news/sports",
  },
  openGraph: {
    title: "Sports News | CINRYVAN",
    description:
      "Latest sports headlines, soccer, football, racing, basketball, tennis, and live sports updates.",
    url: "/news/sports",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports News | CINRYVAN",
    description:
      "Read sports headlines, soccer, football, racing, basketball, and tennis updates.",
    images: ["/og-image.png"],
  },
};

export default async function SportsNewsPage() {
  const news = await getSportsNews();

 const sportsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Sports News",
  description:
    "Latest sports headlines, soccer, football, racing, basketball, tennis, and live sports updates.",
  url: "https://cinryvan.vercel.app/news/sports",
}; 

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(sportsJsonLd),
            }}
        />
      <div className="mx-auto max-w-[1500px]">
        <section className="mb-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/10 p-8">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
                CINRYVAN News Room
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Sports News
            </h1>

            <p className="mt-4 max-w-3xl text-white/65">
                Fresh headlines, breaking updates, and major stories updated regularly.
            </p>
            </section>
            <NewsCategoryGrid
            eyebrow="Live Sports"
            title="Sports Headlines"
            items={news}
            color="green"
            />
        <SportsSubCategories />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
            href="/news/entertainment"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-yellow-400/60"
        >
            Entertainment News →
        </Link>

        <Link
            href="/news/gaming"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-cyan-400/60"
        >
            Gaming News →
        </Link>

        <Link
            href="/news/sports"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 font-bold hover:border-green-400/60"
        >
            Sports News →
        </Link>
        </div>

      </div>
    </main>
  );
}