import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import AppShell from "@/components/AppShell";
import CinryvanIntro from "@/components/CinryvanIntro";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://cinryvan.vercel.app";
const SITE_NAME = "CINRYVAN";
const CREATOR_NAME = "Luvo Maphela";

const SITE_TITLE =
  "CINRYVAN: Movies, TV Shows, Anime, Games & Streaming Guides";

const SITE_DESCRIPTION =
  "Discover movies, TV shows, anime, cartoons and games on CINRYVAN. Explore trailers, ratings, casts, release dates, streaming options, gaming deals and the latest entertainment news.";

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "CINRYVAN — Discover movies, TV shows, anime and games",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,
  generator: "Next.js",

  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  authors: [
    {
      name: CREATOR_NAME,
      url: `${SITE_URL}/about`,
    },
  ],

  creator: CREATOR_NAME,
  publisher: SITE_NAME,
  category: "Entertainment",

  /*
   * Google does not use meta keywords for ranking.
   * These remain as secondary classification signals for
   * other services and search engines.
   */
  keywords: [
    "CINRYVAN",
    "movie discovery",
    "movies",
    "TV shows",
    "anime",
    "cartoons",
    "video games",
    "where to watch movies",
    "streaming guide",
    "movie trailers",
    "TV trailers",
    "movie ratings",
    "movie cast",
    "release dates",
    "upcoming movies",
    "trending movies",
    "top rated movies",
    "new TV shows",
    "anime recommendations",
    "game discovery",
    "gaming deals",
    "entertainment news",
    "gaming news",
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
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
      },
    ],
  },

  verification: {
    google: "V4XKtKx6YSlNj3fUJoY4uI9bwoPpQIlKka_B-yZhqhE",
  },

  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [OG_IMAGE],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        alt: OG_IMAGE.alt,
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
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  other: {
    "theme-color": "#05070d",
    "color-scheme": "dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": SITE_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: [
          "Cinryvan",
          "CINRYVAN Entertainment",
        ],
        url: SITE_URL,
        description:
          "CINRYVAN is an entertainment discovery platform created by Luvo Maphela for movies, television, anime, cartoons, video games and entertainment news.",

        founder: {
          "@type": "Person",
          name: CREATOR_NAME,
        },

        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/icon.png`,
          contentUrl: `${SITE_URL}/icon.png`,
          caption: SITE_NAME,
        },

        image: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
      },

      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
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
            urlTemplate:
              `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input":
            "required name=search_term_string",
        },
      },

      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
        inLanguage: "en",
      },

      {
        "@type": "SiteNavigationElement",
        "@id": `${SITE_URL}/#navigation`,
        name: [
          "Movies",
          "TV Shows",
          "Animation",
          "Anime",
          "Games",
          "News",
          "Browse",
        ],
        url: [
          `${SITE_URL}/movie`,
          `${SITE_URL}/tv`,
          `${SITE_URL}/animation`,
          `${SITE_URL}/anime`,
          `${SITE_URL}/games`,
          `${SITE_URL}/news`,
          `${SITE_URL}/browse`,
        ],
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