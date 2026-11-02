import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createUserSession } from "@/lib/userSession";

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
      return json({ error: "Invalid login details" }, 400);
    }

    const input = body as Record<string, unknown>;

    if (
      typeof input.email !== "string" ||
      typeof input.password !== "string"
    ) {
      return json({ error: "Email and password are required" }, 400);
    }

    const email = input.email.trim();
    const password = input.password;

    if (!email || !password || email.length > 254) {
      return json({ error: "Invalid login credentials" }, 401);
    }

    // Bound input without imposing the new signup password rules
    // on accounts created before those rules were introduced.
    if (password.length > 1024) {
      return json({ error: "Invalid login credentials" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user?.password) {
      return json({ error: "Invalid login credentials" }, 401);
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return json({ error: "Invalid login credentials" }, 401);
    }

    const response = json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    // Stores the token hash in the database and puts the random
    // token in an HttpOnly cookie. Removes the old user-ID cookies.
    await createUserSession(user.id, response);

    return response;
  } catch (error: unknown) {
    console.error("LOGIN ERROR:", error);

    return json(
      { error: "Unable to sign in. Please try again." },
      503
    );
  }
}