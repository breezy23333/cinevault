import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Movies, TV Series & Animation | CINRYVAN",
  description:
    "Discover upcoming movies, TV series, anime, cartoons, and animated releases before they arrive on CINRYVAN.",
  alternates: {
    canonical: "/upcoming",
  },
  openGraph: {
    title: "Upcoming Movies, TV Series & Animation | CINRYVAN",
    description:
      "Explore upcoming movies, new TV series, anime, cartoons, and animated releases.",
    url: "/upcoming",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Movies, TV Series & Animation | CINRYVAN",
    description:
      "Discover upcoming movies, TV series, anime, cartoons, and animated releases.",
    images: ["/og-image.png"],
  },
};