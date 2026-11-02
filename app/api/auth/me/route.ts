import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/userSession";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    const user = sessionUser
      ? {
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
        }
      : null;

    return NextResponse.json(
      { user },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: unknown) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      { error: "Unable to check your session" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }
}