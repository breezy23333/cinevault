import "server-only";
import { prisma } from "@/lib/prisma";

export async function hasPaidMembership(userId: string) {
  const environment = process.env.PAYPAL_ENV?.trim();

  if (environment !== "sandbox" && environment !== "live") {
    throw new Error("Invalid PayPal environment");
  }

  const membership = await prisma.paidSubscription.findFirst({
    where: {
      userId,
      provider: `paypal:${environment}`,
      paidThrough: { gt: new Date() },
      payments: {
        some: {
          status: "completed",
        },
      },
    },
    select: { id: true },
  });

  return membership !== null;
}