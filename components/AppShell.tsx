"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  );
}