import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/userSession";
import { hasPaidMembership } from "@/lib/membership";
import SubscribeClient from "./SubscribeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribe",
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

  const environment = process.env.PAYPAL_ENV?.trim();
  const checkoutEnabled =
    environment === "sandbox" || environment === "live";

  if (checkoutEnabled && (await hasPaidMembership(user.id))) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <SubscribeClient
      sandboxEnabled={environment === "sandbox"}
      checkoutEnabled={checkoutEnabled}
      checkout={params.checkout ?? ""}
    />
  );
}