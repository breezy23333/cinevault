// components/support/ContactForm.tsx
"use client";
import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^(?=.{3,254}$)[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const honey = useRef<HTMLInputElement>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!EMAIL_RE.test(email)) return setError("Please enter a valid email.");
    if (!subject.trim()) return setError("Please add a subject.");
    if (!message.trim()) return setError("Please write your message.");
    if (honey.current && honey.current.value) return setError("Submission blocked.");

    setSaving(true);
    try {
      const spentMs = Date.now() - startedAt.current;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, phone, spentMs }),
      });
      const data = await res.json();
      setOk(Boolean(data?.ok));
      if (!data?.ok) setError(data?.error || "Something went wrong");
      if (data?.ok) { setName(""); setEmail(""); setSubject(""); setMessage(""); setPhone(""); }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border p-4">
      {ok && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
          Thanks! We'll get back to you at <b>{email}</b>.
        </div>
      )}
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>
      )}
      {/* fields ... (unchanged) */}
      {/* Name/Email, Subject, Message, Phone, honeypot, Submit */}
      {/* -- keep what you already pasted -- */}
    </form>
  );
}
