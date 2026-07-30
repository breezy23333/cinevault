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
    "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CineVault. Explore ratings, casts, watch options, and cinematic discoveries.",
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
      "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CineVault. Explore ratings, casts, watch options, and cinematic discoveries.",
    
    siteName: "CineVault",
    type: "website",
  },
  twitter: {
    images: ["/og-image.png"],
    card: "summary_large_image",
    title: "CineVault – Movies, TV Shows, Anime & Cartoons",
    description:
      "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CineVault. Explore ratings, casts, watch options, and cinematic discoveries.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {

return (
  <html lang="en">
    <body className="bg-[#05070d] text-white">
      <CineVaultIntro />
      <AppShell>{children}</AppShell>

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

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CineVault",
          url: "https://cinevault-tau-drab.vercel.app",
          logo: "https://cinevault-tau-drab.vercel.app/og-image.png",
          sameAs: [],
        }}
      />

      <GoogleAnalytics />
    </body>
  </html>
);
}