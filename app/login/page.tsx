import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login | CINRYVAN",
  description: "Log in to your CINRYVAN account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginClient />;
}