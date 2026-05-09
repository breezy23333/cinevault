import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WatchSidebar from "@/components/WatchSidebar";
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
      <body className="bg-[#0b0f1a] text-white antialiased overflow-x-hidden">
        <Navbar />
        
      <main className="pt-24">
        {children}
      </main>

      <Footer />
      </body>
    </html>
  );
}