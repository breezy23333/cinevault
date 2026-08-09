import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("cinryvan_user", "", {
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("cinryvan_user_id", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
