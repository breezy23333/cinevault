import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const cookieStore = await cookies();

  return (
    cookieStore.get("cinryvan_user")?.value ||
    cookieStore.get("cinryvan_user_id")?.value ||
    null
  );
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("WATCHLIST GET ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Watchlist failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const item = await prisma.watchlistItem.upsert({
    where: {
      userId_tmdbId_mediaType: {
        userId,
        tmdbId: body.tmdbId,
        mediaType: body.mediaType,
      },
    },
    update: {},
    create: {
      userId,
      tmdbId: body.tmdbId,
      mediaType: body.mediaType,
      title: body.title,
      posterPath: body.posterPath,
      releaseDate: body.releaseDate,
      voteAverage: body.voteAverage,
    },
  });

  return NextResponse.json({ success: true, item });
}

export async function DELETE(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();

  await prisma.watchlistItem.deleteMany({
    where: {
      userId,
      tmdbId: body.tmdbId,
      mediaType: body.mediaType,
    },
  });

  return NextResponse.json({ success: true });
}