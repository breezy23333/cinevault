import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineVault",
  description: "Discover movies and shows on CineVault.",
  verification: {
    google: "V4XKtKx6YSlNj3fUJoY4uI9bwoPpQIlKka_B-yZhqhE",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0f1a] text-white antialiased flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}