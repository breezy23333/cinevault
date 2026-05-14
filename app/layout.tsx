import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "CineVault",
  description: "Discover movies and shows on CineVault.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#05070d] text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}