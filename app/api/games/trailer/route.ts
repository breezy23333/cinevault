import { NextRequest, NextResponse } from "next/server";
import { getGameTrailer } from "@/lib/youtube";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const gameName =
    request.nextUrl.searchParams.get("name")?.trim() || "";

  if (!gameName || gameName.length > 150) {
    return NextResponse.json(
      {
        trailer: null,
        error: "A valid game name is required.",
      },
      { status: 400 },
    );
  }

  try {
    const trailer = await getGameTrailer(gameName);

    return NextResponse.json(
      {
        trailer,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=604800, stale-while-revalidate=2592000",
        },
      },
    );
  } catch (error) {
    console.error(
      `Unable to load trailer for ${gameName}:`,
      error,
    );

    return NextResponse.json(
      {
        trailer: null,
      },
      { status: 500 },
    );
  }
}