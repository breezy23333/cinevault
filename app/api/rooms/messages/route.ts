import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const ALLOWED_ROOM_TYPES = new Set([
  "movie",
  "tv",
  "anime",
  "cartoons",
  "spoilers",
  "news",
  "gaming",
]);

function isAllowedRoom(room: string) {
  const parts = room.split(":");

  if (parts.length !== 3) return false;

  const [namespace, roomType, channel] = parts;

  return (
    namespace === "cinryvan" &&
    ALLOWED_ROOM_TYPES.has(roomType) &&
    /^[a-z0-9-]{1,50}$/.test(channel)
  );
}

function getUserId(req: NextRequest) {
  return (
    req.cookies.get("cinryvan_user_id")?.value ||
    req.cookies.get("cinryvan_user")?.value ||
    null
  );
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const room = String(
      req.nextUrl.searchParams.get("room") || "",
    )
      .trim()
      .toLowerCase();

    if (!isAllowedRoom(room)) {
      return NextResponse.json(
        { error: "Invalid chat room." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("room_messages")
      .select(
        "id, room, user_id, username, avatar_url, message, created_at",
      )
      .eq("room", room)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("SUPABASE CHAT LOAD ERROR:", error);

      return NextResponse.json(
        { error: "Messages could not be loaded." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      messages: [...(data || [])].reverse(),
    });
  } catch (error) {
    console.error("CHAT LOAD API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(
      req.headers.get("content-length") || 0,
    );

    if (contentLength > 2048) {
      return NextResponse.json(
        { error: "Message request is too large." },
        { status: 413 },
      );
    }

    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const body = await req.json();

    const room = String(body?.room || "")
      .trim()
      .toLowerCase();

    const message = String(body?.message || "").trim();

    if (!isAllowedRoom(room)) {
      return NextResponse.json(
        { error: "Invalid chat room." },
        { status: 400 },
      );
    }

    if (message.length < 1 || message.length > 500) {
      return NextResponse.json(
        {
          error:
            "Messages must contain between 1 and 500 characters.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Your login session is invalid." },
        { status: 401 },
      );
    }

    const { data: lastMessage } = await supabaseAdmin
      .from("room_messages")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      lastMessage?.created_at &&
      Date.now() -
        new Date(lastMessage.created_at).getTime() <
        1500
    ) {
      return NextResponse.json(
        {
          error:
            "Please wait before sending another message.",
        },
        { status: 429 },
      );
    }

    const username = (
      user.name ||
      user.email?.split("@")[0] ||
      "CINRYVAN Member"
    )
      .trim()
      .slice(0, 40);

    const { data, error } = await supabaseAdmin
      .from("room_messages")
      .insert({
        room,
        user_id: user.id,
        username,
        avatar_url: null,
        message,
      })
      .select(
        "id, room, user_id, username, avatar_url, message, created_at",
      )
      .single();

    if (error) {
      console.error("SUPABASE CHAT INSERT ERROR:", error);

      return NextResponse.json(
        { error: "The message could not be saved." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: data },
      { status: 201 },
    );
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to send the message." },
      { status: 500 },
    );
  }
}