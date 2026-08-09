import type { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
  title: "Watchlist | CINRYVAN",
  description: "View and manage your saved CINRYVAN movies and TV shows.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <WatchlistClient />;
}