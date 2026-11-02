import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSessionUser } from "@/lib/userSession";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 2048;
const MESSAGE_COOLDOWN_MS = 1500;

const MESSAGE_FIELDS =
  "id, room, user_id, username, avatar_url, message, created_at";

const ALLOWED_ROOM_TYPES = new Set([
  "movie",
  "tv",
  "anime",
  "cartoons",
  "spoilers",
  "news",
  "gaming",
]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

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

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return json({ error: "You must be signed in." }, 401);
    }

    const room = (req.nextUrl.searchParams.get("room") || "")
      .trim()
      .toLowerCase();

    if (!isAllowedRoom(room)) {
      return json({ error: "Invalid chat room." }, 400);
    }

    const { data, error } = await supabaseAdmin
      .from("room_messages")
      .select(MESSAGE_FIELDS)
      .eq("room", room)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("SUPABASE CHAT LOAD ERROR:", error);
      return json({ error: "Messages could not be loaded." }, 503);
    }

    return json({
      messages: [...(data || [])].reverse(),
    });
  } catch (error: unknown) {
    console.error("CHAT LOAD API ERROR:", error);
    return json({ error: "Unable to load messages." }, 503);
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(
      req.headers.get("content-length") || 0
    );

    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: "Message request is too large." }, 413);
    }

    const user = await getSessionUser();

    if (!user) {
      return json({ error: "You must be signed in." }, 401);
    }

    // Read a bounded body even when Content-Length is missing.
    if (!req.body) {
      return json({ error: "Missing message request." }, 400);
    }

    const reader = req.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.byteLength;

        if (totalBytes > MAX_BODY_BYTES) {
          await reader.cancel();
          return json(
            { error: "Message request is too large." },
            413
          );
        }

        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    let body: unknown;

    try {
      const text = Buffer.concat(chunks).toString("utf8");
      body = JSON.parse(text);
    } catch {
      return json({ error: "Invalid JSON request." }, 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return json({ error: "Invalid message request." }, 400);
    }

    const input = body as Record<string, unknown>;

    if (
      typeof input.room !== "string" ||
      typeof input.message !== "string"
    ) {
      return json(
        { error: "Room and message must be text." },
        400
      );
    }

    const room = input.room.trim().toLowerCase();
    const message = input.message.trim();

    if (!isAllowedRoom(room)) {
      return json({ error: "Invalid chat room." }, 400);
    }

    if (message.length < 1 || message.length > 500) {
      return json(
        {
          error: "Messages must contain between 1 and 500 characters.",
        },
        400
      );
    }

    const { data: lastMessage, error: cooldownError } =
      await supabaseAdmin
        .from("room_messages")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (cooldownError) {
      console.error("CHAT COOLDOWN ERROR:", cooldownError);
      return json(
        { error: "Unable to send the message. Please try again." },
        503
      );
    }

    if (
      lastMessage?.created_at &&
      Date.now() - new Date(lastMessage.created_at).getTime() <
        MESSAGE_COOLDOWN_MS
    ) {
      const response = json(
        { error: "Please wait before sending another message." },
        429
      );

      response.headers.set("Retry-After", "2");
      return response;
    }

    const username = (
      user.name?.trim() ||
      user.email.split("@")[0] ||
      "CINRYVAN Member"
    ).slice(0, 40);

    const { data, error } = await supabaseAdmin
      .from("room_messages")
      .insert({
        room,
        user_id: user.id,
        username,
        avatar_url: null,
        message,
      })
      .select(MESSAGE_FIELDS)
      .single();

    if (error) {
      console.error("SUPABASE CHAT INSERT ERROR:", error);
      return json({ error: "The message could not be saved." }, 503);
    }

    return json({ message: data }, 201);
  } catch (error: unknown) {
    console.error("CHAT API ERROR:", error);
    return json({ error: "Unable to send the message." }, 503);
  }
}