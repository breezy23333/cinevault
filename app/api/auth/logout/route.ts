import { NextResponse } from "next/server";
import { destroyUserSession } from "@/lib/userSession";

export const runtime = "nodejs";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );

    // Revoke the database session and clear both
    // the new session cookie and the old user-ID cookies.
    await destroyUserSession(response);

    return response;
  } catch (error: unknown) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      { error: "Unable to sign out. Please try again." },
      {
        status: 503,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }
}