import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(req: Request) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON request" }, 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return json({ error: "Invalid signup details" }, 400);
    }

    const input = body as Record<string, unknown>;

    if (
      typeof input.email !== "string" ||
      typeof input.password !== "string"
    ) {
      return json({ error: "Email and password are required" }, 400);
    }

    if (
      input.name !== undefined &&
      input.name !== null &&
      typeof input.name !== "string"
    ) {
      return json({ error: "Name must be text" }, 400);
    }

    const email = input.email.trim();
    const password = input.password;
    const name =
      typeof input.name === "string" ? input.name.trim() : "";

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return json({ error: "Enter a valid email address" }, 400);
    }

    if (name.length > 100) {
      return json({ error: "Name must be 100 characters or fewer" }, 400);
    }

    // Never trim passwords. bcrypt only uses the first 72 bytes.
    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return json(
        {
          error:
            "Password must contain at least 8 characters and fit within 72 UTF-8 bytes.",
        },
        400
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return json(
        { error: "An account with this email already exists" },
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return json({ success: true, user });
  } catch (error: unknown) {
    // Handles two requests registering the same email simultaneously.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return json(
        { error: "An account with this email already exists" },
        409
      );
    }

    console.error("SIGNUP ERROR:", error);

    return json(
      { error: "Unable to create your account. Please try again." },
      500
    );
  }
}