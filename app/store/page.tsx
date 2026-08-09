import type { Metadata } from "next";
import StoreClient from "./StoreClient";

export const metadata: Metadata = {
  title: "CINRYVAN Store & Plans",
  description:
    "Explore CINRYVAN plans including Free, No Ads, and Premium options for a cleaner movie and TV discovery experience.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "CINRYVAN Store & Plans",
    description:
      "Choose a CINRYVAN plan and upgrade your movie discovery experience.",
    url: "/store",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CINRYVAN Store & Plans",
    description:
      "Explore CINRYVAN Free, No Ads, and Premium plans.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <StoreClient />;
}