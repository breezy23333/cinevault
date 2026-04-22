import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get("movieId");
    const movieId = Number(idStr);
    if (!Number.isFinite(movieId) || movieId <= 0) {
      return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    }
    const items = await prisma.comment.findMany({
      where: { movieId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    console.error("[comments][GET]", e);
    return NextResponse.json({ ok: false, items: [], error: "server-error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const movieId = Number(data?.movieId);
    const name = (data?.name || "Guest").slice(0, 40);
    const body = String(data?.body || "").slice(0, 600);
    if (!Number.isFinite(movieId) || !body) {
      return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
    }
    const item = await prisma.comment.create({ data: { movieId, name, body } });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (e) {
    console.error("[comments][POST]", e);
    return NextResponse.json({ ok: false, error: "server-error" }, { status: 500 });
  }
}
