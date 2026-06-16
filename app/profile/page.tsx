import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile | CineVault",
  description: "Manage your CineVault profile, watchlist, and notifications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ProfileClient />;
}