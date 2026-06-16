"use client";

import Link from "next/link";
import { useState } from "react";

const currencies = {
  USD: { symbol: "$", rate: 1 },
  ZAR: { symbol: "R", rate: 18.5 },
  EUR: { symbol: "€", rate: 0.93 },
  GBP: { symbol: "£", rate: 0.8 },
};

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Browse movies and shows with basic features.",
    features: ["Search titles", "Movie & TV pages", "Basic watchlist"],
    button: "Current Plan",
    href: "/browse",
  },
  {
    name: "No Ads",
    price: 20,
    desc: "Remove ads and enjoy a cleaner CineVault experience.",
    features: ["No ads", "Cleaner browsing", "Faster experience", "Support CineVault"],
    button: "Upgrade to No Ads",
    href: "/checkout/no-ads",
    highlight: true,
  },
  {
    name: "Premium",
    price: 49,
    desc: "For users who want the full CineVault experience.",
    features: ["No ads", "Advanced filters", "Priority support", "Early features"],
    button: "Go Premium",
    href: "/checkout/premium",
  },
];

export default function StorePage() {
  const [currency, setCurrency] = useState<keyof typeof currencies>("USD");
  const selected = currencies[currency];

  function formatPrice(price: number) {
    const value = Math.round(price * selected.rate);
    return `${selected.symbol}${value}`;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20">
      <section className="py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-400">
          CineVault Store
        </p>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white md:text-6xl">
              Upgrade your movie experience.
            </h1>

            <p className="mt-4 max-w-2xl text-white/70">
              Choose a monthly plan. Start free, or unlock a cleaner ad-free
              CineVault experience.
            </p>
          </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as keyof typeof currencies)}
            className="w-fit rounded-xl border border-white/10 bg-zinc-900 text-white px-4 py-3 outline-none"
          >
            <option className="bg-zinc-900 text-white" value="USD">USD</option>
            <option className="bg-zinc-900 text-white" value="ZAR">ZAR</option>
            <option className="bg-zinc-900 text-white" value="EUR">EUR</option>
            <option className="bg-zinc-900 text-white" value="GBP">GBP</option>
          </select>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 ${
              plan.highlight
                ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_40px_rgba(250,204,21,0.18)]"
                : "border-white/10 bg-white/5"
            }`}
          >
            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>

            <div className="mt-4 flex items-end gap-1">
              <span className="text-5xl font-black text-yellow-400">
                {formatPrice(plan.price)}
              </span>

              <span className="pb-2 text-sm text-white/50">/ month</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {plan.desc}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-8 inline-flex w-full justify-center rounded-xl px-5 py-3 text-sm font-bold transition ${
                plan.highlight
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {plan.button}
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}