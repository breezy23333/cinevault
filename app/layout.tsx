import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";
import CinryvanIntro from "@/components/CinryvanIntro";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";


export const metadata: Metadata = {
  metadataBase: new URL("https://cinryvan.vercel.app"),
  
  title: {
    default: "CINRYVAN – Movies, TV Shows, Anime & Cartoons",
    template: "%s",
  },
  description:
    "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CINRYVAN. Explore ratings, casts, watch options, and cinematic discoveries.",
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN - Discover movies and shows",
      },
    ],
    title: "CINRYVAN – Movies, TV Shows, Anime & Cartoons",
    description:
      "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CINRYVAN. Explore ratings, casts, watch options, and cinematic discoveries.",
    
    siteName: "CINRYVAN",
    type: "website",
  },
  twitter: {
    images: ["/og-image.png"],
    card: "summary_large_image",
    title: "CINRYVAN – Movies, TV Shows, Anime & Cartoons",
    description:
      "Discover trending movies, TV shows, anime, cartoons, games, trailers, and entertainment news on CINRYVAN. Explore ratings, casts, watch options, and cinematic discoveries.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {

return (
  <html lang="en">
    <body className="bg-[#05070d] text-white">
      <CinryvanIntro />
      <AppShell>{children}</AppShell>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CINRYVAN",
          url: "https://cinryvan.vercel.app",
          description:
            "CINRYVAN helps you discover movies, TV shows, anime, cartoons, trending titles, top-rated content, and entertainment news.",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://cinryvan.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CINRYVAN",
          url: "https://cinryvan.vercel.app",
          logo: "https://cinryvan.vercel.app/og-image.png",
          sameAs: [],
        }}
      />

      <Analytics />    
      <GoogleAnalytics />
    </body>
  </html>
);
}