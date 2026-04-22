// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";          // relative import
import { rateLimit } from "../../../lib/rateLimit"; // relative import

export const runtime = "nodejs";

const EMAIL_RE = /^(?=.{3,254}$)[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_FILL_MS = 1200;
const MAX_MSG = 1000;

export async function POST(req: Request) {
  try {
    // 0) debug: show DB url in server logs
    console.log("[CONTACT] DB_URL:", process.env.DATABASE_URL);

    if (!((req.headers.get("content-type") || "").includes("application/json"))) {
      return NextResponse.json({ ok: false, error: "Invalid content type" }, { status: 400 });
    }

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || undefined;
    const ua = req.headers.get("user-agent") || undefined;

    // 1) rate limit
    const { allowed, remaining } = rateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Too many requests, please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim(); // honeypot
    const ts = Number(body.ts || 0);
    const rct = (body.rct || "").trim();

    if (company) return NextResponse.json({ ok: true, saved: false, note: "honeypot" });

    // 2) validate
    if (!name)    return NextResponse.json({ ok: false, field: "name",    error: "Your name is required." }, { status: 400 });
    if (!email || !EMAIL_RE.test(email))
                  return NextResponse.json({ ok: false, field: "email",   error: "Enter a valid email." },   { status: 400 });
    if (!subject) return NextResponse.json({ ok: false, field: "subject", error: "Subject is required." },   { status: 400 });
    if (!message) return NextResponse.json({ ok: false, field: "message", error: "Message can’t be empty." },{ status: 400 });
    if (message.length > MAX_MSG)
                  return NextResponse.json({ ok: false, field: "message", error: "Message is too long." },   { status: 400 });

    // 3) timestamp trap
    if (!ts || Date.now() - ts < MIN_FILL_MS) {
      return NextResponse.json({ ok: false, error: "Submitted too quickly. Please try again." }, { status: 400 });
    }

    // 4) quick DB connectivity ping (SQLite: SELECT 1)
    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      console.log("[CONTACT] DB ping OK");
    } catch (e) {
      console.warn("[CONTACT] DB ping failed", e);
    }

    // 5) save — log success/failure and expose in JSON
    let saved = false;
    let dbError: string | undefined;

    try {
      await prisma.contactMessage.create({
        data: { name, email, subject, message, phone: phone || null, ip, ua },
      });
      saved = true;
      console.log("[CONTACT] saved row");
    } catch (err: any) {
      dbError = String(err?.message || err);
      console.warn("[CONTACT] DB save failed", err);
    }

    // 6) (optional) email via Resend – you can keep or skip for now
    // ... (omit for diagnostics to reduce variables)

    // 7) return details (in dev we include dbError for visibility)
    return NextResponse.json({
      ok: true,
      saved,
      remaining,
      ...(process.env.NODE_ENV !== "production" && dbError ? { dbError } : {}),
    });
  } catch (err) {
    console.error("[CONTACT] Unhandled", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
