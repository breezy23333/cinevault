"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <main className={!isAuthPage ? "min-h-screen bg-[#05070d] pt-20 text-white" : ""}>
        {children}
        </main>

      {!isAuthPage && <Footer />}
    </>
  );
}