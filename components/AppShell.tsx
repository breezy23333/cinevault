"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-w-0 overflow-x-clip bg-[#05070d] text-white">
      <Navbar />

      <div className="min-h-screen min-w-0 pt-16 sm:pt-20">
        {children}
      </div>

      <Footer />
    </div>
  );
}