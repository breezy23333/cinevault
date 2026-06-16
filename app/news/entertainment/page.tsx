import { getEntertainmentNews } from "@/lib/news";
import NewsCategoryGrid from "@/components/NewsCategoryGrid";
import EntertainmentSubCategories from "@/components/EntertainmentSubCategories";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Entertainment News | CineVault",
  description:
    "Read the latest entertainment news, movie updates, celebrity stories, TV headlines, streaming news, and industry updates on CineVault.",
  alternates: {
    canonical: "/news/entertainment",
  },
  openGraph: {
    title: "Entertainment News | CineVault",
    description:
      "Latest entertainment, movie, celebrity, TV, and streaming news on CineVault.",
    url: "/news/entertainment",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entertainment News | CineVault",
    description:
      "Read entertainment, movie, celebrity, TV, and streaming news.",
    images: ["/og-image.png"],
  },
};

export default async function EntertainmentNewsPage() {
  const news = await getEntertainmentNews();

const entertainmentJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Entertainment News",
  description:
    "Latest entertainment, movie, celebrity, TV, streaming, and industry news.",
  url: "https://cinevault-tau-drab.vercel.app/news/entertainment",
};

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-24 text-white md:px-8">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(entertainmentJsonLd),
            }}
        />
      <div className="mx-auto max-w-[1500px]">
        <section className="mb-10 rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-yellow-400/10 p-8">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
                CineVault News Room
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Entertainment News
            </h1>

            <p className="mt-4 max-w-3xl text-white/65">
                Fresh headlines, breaking updates, and major stories updated regularly.
            </p>
            </section>
            <NewsCategoryGrid
            eyebrow="Entertainment Radar"
            title="Entertainment News"
            items={news}
            color="yellow"
            />
            <EntertainmentSubCategories />

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