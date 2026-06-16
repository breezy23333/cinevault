import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login | CineVault",
  description: "Log in to your CineVault account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginClient />;
}