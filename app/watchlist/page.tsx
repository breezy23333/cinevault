import type { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
  title: "Watchlist | CineVault",
  description: "View and manage your saved CineVault movies and TV shows.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <WatchlistClient />;
}