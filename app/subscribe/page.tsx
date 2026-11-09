import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/userSession";
import SubscribeClient from "./SubscribeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribe | CINRYVAN",
  robots: { index: false, follow: false },
};

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  return (
    <SubscribeClient
      sandboxEnabled={process.env.PAYPAL_ENV === "sandbox"}
      checkout={params.checkout ?? ""}
    />
  );
}