import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign Up | CineVault",
  description: "Create your CineVault account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignupClient />;
}