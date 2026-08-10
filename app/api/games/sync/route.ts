import { NextRequest, NextResponse } from "next/server";
import { syncGamesFromRawg } from "@/lib/gameSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (
    !expectedSecret ||
    authorization !== `Bearer ${expectedSecret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await syncGamesFromRawg(10);

    return NextResponse.json({
      ok: true,
      ...result,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Game catalogue sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Game catalogue sync failed.",
      },
      { status: 503 },
    );
  }
}