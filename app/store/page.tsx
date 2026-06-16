import type { Metadata } from "next";
import StoreClient from "./StoreClient";

export const metadata: Metadata = {
  title: "CineVault Store & Plans",
  description:
    "Explore CineVault plans including Free, No Ads, and Premium options for a cleaner movie and TV discovery experience.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "CineVault Store & Plans",
    description:
      "Choose a CineVault plan and upgrade your movie discovery experience.",
    url: "/store",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineVault Store & Plans",
    description:
      "Explore CineVault Free, No Ads, and Premium plans.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <StoreClient />;
}