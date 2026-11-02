import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/userSession";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function validIdentity(body: Record<string, unknown>) {
  return (
    typeof body.tmdbId === "number" &&
    Number.isSafeInteger(body.tmdbId) &&
    body.tmdbId > 0 &&
    body.tmdbId <= 2147483647 &&
    (body.mediaType === "movie" || body.mediaType === "tv")
  );
}

function optionalText(value: unknown, maxLength: number) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return json({ items: [], error: "Not logged in" }, 401);
    }

    const items = await prisma.watchlistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return json({ items });
  } catch (error: unknown) {
    console.error("WATCHLIST GET ERROR:", error);
    return json({ error: "Unable to load your watchlist" }, 503);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return json({ error: "Not logged in" }, 401);
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON request" }, 400);
    }

    if (!isObject(body) || !validIdentity(body)) {
      return json({ error: "Invalid title ID or media type" }, 400);
    }

    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      body.title.length > 500 ||
      !optionalText(body.posterPath, 2048) ||
      !optionalText(body.releaseDate, 32) ||
      !(
        body.voteAverage === undefined ||
        body.voteAverage === null ||
        (typeof body.voteAverage === "number" &&
          Number.isFinite(body.voteAverage) &&
          body.voteAverage >= 0 &&
          body.voteAverage <= 10)
      )
    ) {
      return json({ error: "Invalid watchlist details" }, 400);
    }

    const tmdbId = body.tmdbId as number;
    const mediaType = body.mediaType as "movie" | "tv";

    const item = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId,
          mediaType,
        },
      },
      update: {},
      create: {
        userId: user.id,
        tmdbId,
        mediaType,
        title: body.title.trim(),
        posterPath:
          typeof body.posterPath === "string"
            ? body.posterPath
            : null,
        releaseDate:
          typeof body.releaseDate === "string"
            ? body.releaseDate
            : null,
        voteAverage:
          typeof body.voteAverage === "number"
            ? body.voteAverage
            : null,
      },
    });

    return json({ success: true, item });
  } catch (error: unknown) {
    console.error("WATCHLIST POST ERROR:", error);
    return json({ error: "Unable to save this title" }, 503);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return json({ error: "Not logged in" }, 401);
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON request" }, 400);
    }

    if (!isObject(body) || !validIdentity(body)) {
      return json({ error: "Invalid title ID or media type" }, 400);
    }

    await prisma.watchlistItem.deleteMany({
      where: {
        userId: user.id,
        tmdbId: body.tmdbId as number,
        mediaType: body.mediaType as "movie" | "tv",
      },
    });

    return json({ success: true });
  } catch (error: unknown) {
    console.error("WATCHLIST DELETE ERROR:", error);
    return json({ error: "Unable to remove this title" }, 503);
  }
}