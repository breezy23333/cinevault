import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";
import CineVaultIntro from "@/components/CineVaultIntro";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";


export const metadata: Metadata = {
  metadataBase: new URL("https://cinevault-tau-drab.vercel.app"),
  title: {
    default: "CineVault – Movies, TV Shows, Anime & Cartoons",
    template: "%s | CineVault",
  },
  description:
    "Stream trending movies, TV shows, anime, cartoons, trailers, and cinematic discoveries on CineVault. Explore the live TMDB universe with rich visuals and watchlists.",
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CineVault - Discover movies and shows",
      },
    ],
    title: "CineVault – Movies, TV Shows, Anime & Cartoons",
    description:
      "Stream trending movies, TV shows, anime, cartoons, trailers, and cinematic discoveries on CineVault. Explore the live TMDB universe with rich visuals and watchlists.",
    url: "https://cinevault-tau-drab.vercel.app",
    siteName: "CineVault",
    type: "website",
  },
  twitter: {
    images: ["/og-image.png"],
    card: "summary_large_image",
    title: "CineVault – Movies, TV Shows, Anime & Cartoons",
    description:
      "Stream trending movies, TV shows, anime, cartoons, trailers, and cinematic discoveries on CineVault. Explore the live TMDB universe with rich visuals and watchlists.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CineVault",
    url: "https://cinevault-tau-drab.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://cinevault-tau-drab.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CineVault",
    url: "https://cinevault-tau-drab.vercel.app",
    logo: "https://cinevault-tau-drab.vercel.app/og-image.png",
    sameAs: [],
  };

return (
  <html lang="en">
    <body className="bg-[#05070d] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <>
          <CineVaultIntro />
          <AppShell>{children}</AppShell>
        </>

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CineVault",
            url: "https://cinevault-tau-drab.vercel.app",
            description:
              "CineVault helps you discover movies, TV shows, anime, cartoons, trending titles, top-rated content, and entertainment news.",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://cinevault-tau-drab.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />

        <GoogleAnalytics />
    </body>
  </html>
);
}