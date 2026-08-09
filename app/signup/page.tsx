import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign Up | CINRYVAN",
  description: "Create your CINRYVAN account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignupClient />;
}