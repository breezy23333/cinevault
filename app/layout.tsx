import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://cinevault-tau-drab.vercel.app"),
  title: {
    default: "CineVault",
    template: "%s | CineVault",
  },
  description:
    "Discover trending movies, TV shows, anime, cartoons, trailers, and watchlist picks on CineVault.",
  openGraph: {
      images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "CineVault - Discover movies and shows",
    },
  ],
    title: "CineVault",
    description:
      "Discover trending movies, TV shows, anime, cartoons, trailers, and watchlist picks on CineVault.",
    url: "https://cinevault-tau-drab.vercel.app",
    siteName: "CineVault",
    type: "website",
  },
  twitter: {
    images: ["/og-image.jpg"],
    card: "summary_large_image",
    title: "CineVault",
    description:
      "Discover trending movies, TV shows, anime, cartoons, trailers, and watchlist picks on CineVault.",
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

  return (
    <html lang="en">
      <body className="bg-[#05070d] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}