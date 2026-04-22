// components/FAQ.tsx  (mini accordion)
"use client";

import { useState } from "react";

const QA = [
  { q: "How fast do you reply?", a: "We usually respond within 24 hours on weekdays." },
  { q: "Can I request a feature?", a: "Yes! Use the form with subject 'Feature Request' and include details." },
  { q: "Where do you get your data?", a: "We aggregate from public APIs and licensed providers." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-lg font-semibold">Support / FAQ</h3>
      <ul className="mt-4 divide-y divide-white/10">
        {QA.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left py-3 flex items-center justify-between"
            >
              <span className="font-medium text-zinc-200">{item.q}</span>
              <span className="text-zinc-400">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="pb-3 text-sm text-zinc-400">{item.a}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
