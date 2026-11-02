// lib/userSession.ts
// Server-side only. Never import this file into a client component.

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "cinryvan_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function validTokenFormat(token: string | undefined): token is string {
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
}

// Call only after successfully verifying login credentials.
export async function createUserSession(
  userId: string,
  response: NextResponse
) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_SECONDS * 1000);

  await prisma.session.create({
    data: {
      sessionToken: tokenHash(token),
      userId,
      expires,
    },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    expires,
    maxAge: SESSION_SECONDS,
  });

  // Retire the old cookies that contained raw user IDs.
  for (const name of ["cinryvan_user", "cinryvan_user_id"]) {
    response.cookies.set(name, "", {
      ...cookieOptions,
      maxAge: 0,
    });
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!validTokenFormat(token)) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: tokenHash(token) },
    select: {
      expires: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!session || session.expires.getTime() <= Date.now()) {
    return null;
  }

  return session.user;
}

export async function destroyUserSession(response: NextResponse) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (validTokenFormat(token)) {
    await prisma.session.deleteMany({
      where: { sessionToken: tokenHash(token) },
    });
  }

  for (const name of [
    SESSION_COOKIE,
    "cinryvan_user",
    "cinryvan_user_id",
  ]) {
    response.cookies.set(name, "", {
      ...cookieOptions,
      maxAge: 0,
    });
  }
}