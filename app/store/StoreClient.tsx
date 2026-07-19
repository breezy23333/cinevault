"use client";

import Link from "next/link";
import { useState } from "react";

const currencies = {
  USD: { symbol: "$", rate: 1, name: "US Dollar" },
  EUR: { symbol: "€", rate: 0.93, name: "Euro" },
  GBP: { symbol: "£", rate: 0.80, name: "British Pound" },
  ZAR: { symbol: "R", rate: 18.50, name: "South African Rand" },
  CAD: { symbol: "C$", rate: 1.37, name: "Canadian Dollar" },
  AUD: { symbol: "A$", rate: 1.53, name: "Australian Dollar" },
  NZD: { symbol: "NZ$", rate: 1.67, name: "New Zealand Dollar" },
  INR: { symbol: "₹", rate: 86.50, name: "Indian Rupee" },
  JPY: { symbol: "¥", rate: 148, name: "Japanese Yen" },
  CNY: { symbol: "CN¥", rate: 7.20, name: "Chinese Yuan" },
  KRW: { symbol: "₩", rate: 1390, name: "South Korean Won" },
  BRL: { symbol: "R$", rate: 5.60, name: "Brazilian Real" },
  MXN: { symbol: "MX$", rate: 18.70, name: "Mexican Peso" },
  SGD: { symbol: "S$", rate: 1.35, name: "Singapore Dollar" },
  AED: { symbol: "د.إ", rate: 3.67, name: "UAE Dirham" },
  CHF: { symbol: "CHF", rate: 0.88, name: "Swiss Franc" },
};

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Everything you need to discover movies and TV shows.",
    features: [
      "Unlimited title search",
      "Movie & TV pages",
      "Basic watchlist",
      "Community access",
    ],
    button: "Current Plan",
    href: "/browse",
  },
  {
    name: "Plus",
    price: 1.99,
    desc: "Support CineVault and enjoy a cleaner ad-free experience.",
    features: [
      "No ads",
      "Unlimited watchlist",
      "Continue Watching sync",
      "Early access to new features",
      "Support CineVault",
    ],
    button: "Upgrade to Plus",
    href: "/checkout/plus",
    highlight: true,
  },
  {
    name: "Premium",
    price: 4.99,
    desc: "Unlock the ultimate CineVault experience.",
    features: [
      "Everything in Plus",
      "AI recommendations",
      "Advanced filters",
      "Exclusive profile badge",
      "Priority support",
      "Beta features",
    ],
    button: "Go Premium",
    href: "/checkout/premium",
  },
];

export default function StorePage() {
  const [currency, setCurrency] = useState<keyof typeof currencies>("USD");
  const selected = currencies[currency];

  function formatPrice(price: number) {
  if (price === 0) return `${selected.symbol}0`;

  const value = price * selected.rate;

  if (currency === "JPY" || currency === "KRW") {
    return `${selected.symbol}${Math.round(value).toLocaleString()}`;
  }

  return `${selected.symbol}${value.toFixed(2)}`;
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

          <div>
            <label
              htmlFor="currency"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50"
            >
              Currency
            </label>

            <select
              id="currency"
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as keyof typeof currencies)
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400 md:w-auto"
            >
              {Object.entries(currencies).map(([code, value]) => (
                <option
                  key={code}
                  value={code}
                  className="bg-zinc-900 text-white"
                >
                  {code} — {value.name}
                </option>
              ))}
            </select>
          </div>
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

            {plan.highlight && (
              <div className="mt-2 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                ⭐ Most Popular
              </div>
            )}

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