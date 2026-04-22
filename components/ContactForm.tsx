// components/contact/ContactForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "idle" | "sending" | "ok" | "fail";
const EMAIL_RE = /^(?=.{3,254}$)[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    company: "", // honeypot
    ts: 0,       // page load timestamp
    rct: "",     // reCAPTCHA token (optional)
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(f => ({ ...f, ts: Date.now() }));
  }, []);

  const remaining = useMemo(
    () => Math.max(0, 1000 - (form.message?.length || 0)),
    [form.message]
  );

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message can’t be empty";
    if (form.message.length > 1000) e.message = "Max 1000 characters";
    return e;
  }

  async function getRecaptchaToken() {
    if (!SITE_KEY || !(window as any).grecaptcha) return "";
    try {
      await (window as any).grecaptcha.ready();
      return await (window as any).grecaptcha.execute(SITE_KEY, { action: "contact" });
    } catch {
      return "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const eMap = validate();
    if (Object.keys(eMap).length) { setErrors(eMap); return; }

    setStatus("sending");
    try {
      const rct = await getRecaptchaToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rct }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        if (data?.field && data?.error) setErrors({ [data.field]: data.error });
        else if (res.status === 429) setErrors({ form: "You're sending messages too fast. Please wait a moment." });
        else if (data?.error) setErrors({ form: data.error });
        else setErrors({ form: "Something went wrong. Please try again." });
        setStatus("fail");
        return;
      }

      setStatus("ok");
      setForm({
        name: "", email: "", subject: "", message: "", phone: "",
        company: "", ts: Date.now(), rct: ""
      });
    } catch {
      setErrors({ form: "Network error. Check your connection and try again." });
      setStatus("fail");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-300">Your Name</label>
          <input
            className={`mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none transition focus:ring-2 ${
              errors.name ? "border-red-500/70 focus:ring-red-400" : "border-white/10 focus:ring-emerald-500/60"
            }`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Luvo Maphela"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">Your Email</label>
          <input
            className={`mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none transition focus:ring-2 ${
              errors.email ? "border-red-500/70 focus:ring-red-400" : "border-white/10 focus:ring-emerald-500/60"
            }`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Your Subject</label>
          <input
            className={`mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none transition focus:ring-2 ${
              errors.subject ? "border-red-500/70 focus:ring-red-400" : "border-white/10 focus:ring-emerald-500/60"
            }`}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Partnership / Support / Feedback"
          />
          {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Your Message</label>
          <textarea
            rows={6}
            className={`mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none transition focus:ring-2 ${
              errors.message ? "border-red-500/70 focus:ring-red-400" : "border-white/10 focus:ring-emerald-500/60"
            }`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 1000) })}
            placeholder="Tell us what’s up…"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
            <span>Max 1000 characters</span>
            <span>{remaining}</span>
          </div>
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">Phone (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 outline-none transition focus:ring-2 focus:ring-emerald-500/60"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
            placeholder="+27 83 607 8398"
            inputMode="tel"
          />
        </div>

        {/* Honeypot & timestamp (hidden) */}
        <input className="hidden" aria-hidden readOnly value={form.company} />
        <input className="hidden" aria-hidden readOnly value={form.ts} />
      </div>

      <button
        disabled={status === "sending"}
        className="btn-cta rounded-xl bg-yellow-400 px-4 py-2 font-medium text-zinc-900 transition disabled:opacity-50 hover:bg-yellow-300"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p className="pt-2 text-xs text-zinc-400">
        We respect your time and privacy. Your info is used only to respond—never shared or sold.
      </p>

      {status === "ok" && (
        <div className="mt-3 rounded-lg bg-emerald-600/15 text-emerald-200 px-3 py-2 text-sm">
          Thanks! Your message has been sent.
        </div>
      )}
      {status === "fail" && (
        <div className="mt-3 rounded-lg bg-red-600/15 text-red-200 px-3 py-2 text-sm">
          Sorry, something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
