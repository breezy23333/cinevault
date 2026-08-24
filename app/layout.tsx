import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import AppShell from "@/components/AppShell";
import CinryvanIntro from "@/components/CinryvanIntro";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://cinryvan.vercel.app";

const SITE_TITLE =
  "CINRYVAN — Movies, TV Shows, Anime, Games & Where to Watch";

const SITE_DESCRIPTION =
  "Find what to watch and play next on CINRYVAN. Discover trending movies, TV shows, anime, cartoons and games with trailers, ratings, casts, release details, watch options and entertainment news.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "CINRYVAN",

  title: {
    default: SITE_TITLE,
    template: "%s | CINRYVAN",
  },

  description: SITE_DESCRIPTION,

  creator: "CINRYVAN",
  publisher: "CINRYVAN",

  category: "Entertainment",

  keywords: [
    "movies",
    "TV shows",
    "anime",
    "cartoons",
    "games",
    "where to watch",
    "movie trailers",
    "movie cast",
    "streaming guide",
    "upcoming movies",
    "trending movies",
    "top rated movies",
    "entertainment news",
    "game discovery",
    "CINRYVAN",
  ],

  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "CINRYVAN",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CINRYVAN — Discover movies, shows, anime and games",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        alt: "CINRYVAN — Discover movies, shows, anime and games",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  other: {
    "theme-color": "#05070d",
    "color-scheme": "dark",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "CINRYVAN",
        alternateName: [
          "Cinryvan",
          "CINRYVAN Entertainment",
        ],
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "CINRYVAN",
        alternateName: "Cinryvan",
        url: SITE_URL,
        description:
          "CINRYVAN is an entertainment discovery platform for movies, television, anime, cartoons, games and entertainment news.",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
        image: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body className="bg-[#05070d] text-white">
        <CinryvanIntro />

        <AppShell>{children}</AppShell>

        <JsonLd data={structuredData} />

        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}