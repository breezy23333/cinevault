"use client";

import { useEffect, useState } from "react";

const currencies = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "ZAR", label: "ZAR — South African Rand" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
] as const;

type Currency = (typeof currencies)[number]["code"];

export default function MembershipPrice() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rates, setRates] = useState<
    Partial<Record<Currency, number>>
  >({ USD: 1 });
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      10000
    );

    async function loadRates() {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ZAR,EUR,GBP",
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Rates unavailable");

        const data = await response.json();

        if (
          data.base !== "USD" ||
          typeof data.date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
        ) {
          throw new Error("Invalid rate response");
        }

        const nextRates: Partial<Record<Currency, number>> = {
          USD: 1,
        };

        for (const code of ["ZAR", "EUR", "GBP"] as const) {
          const rate = data.rates?.[code];

          if (
            typeof rate !== "number" ||
            !Number.isFinite(rate) ||
            rate <= 0
          ) {
            throw new Error("Invalid exchange rate");
          }

          nextRates[code] = rate;
        }

        if (active) {
          setRates(nextRates);
          setDate(data.date);
        }
      } catch {
        if (active) setUnavailable(true);
      } finally {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }

    void loadRates();

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const amount = rates[currency];
  const converted = currency !== "USD";

  const formatted =
    amount === undefined
      ? null
      : new Intl.NumberFormat("en-ZA", {
          style: "currency",
          currency,
          currencyDisplay: "narrowSymbol",
          minimumFractionDigits: converted ? 2 : 0,
          maximumFractionDigits: 2,
        }).format(amount);

  return (
    <div className="mt-7">
      <label
        htmlFor="membership-currency"
        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400"
      >
        Display currency
      </label>

      <select
        id="membership-currency"
        value={currency}
        onChange={(event) =>
          setCurrency(event.target.value as Currency)
        }
        className="w-full rounded-xl border border-amber-300/20 bg-[#18191c] px-4 py-3 text-sm text-white outline-none focus:border-amber-300"
      >
        {currencies.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <div aria-live="polite" className="mt-7">
        {formatted ? (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              {converted ? "Estimated equivalent" : "Membership price"}
              {" · "}
              {currency}
            </p>

            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="break-all text-5xl font-black tracking-tight sm:text-6xl">
                {converted ? "≈ " : ""}
                {formatted}
              </span>
              <span className="text-sm text-zinc-400">/ month</span>
            </div>
          </>
        ) : (
          <p className="text-sm leading-6 text-zinc-300">
            {loading
              ? "Loading exchange rate..."
              : "Conversion unavailable. Membership is US$1/month."}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-6 text-zinc-400">
        Billed at US$1/month. Currency selection changes the display
        estimate only. PayPal or your bank may apply a different
        exchange rate and fees.
      </p>

      {converted && formatted && date && (
        <p className="mt-2 text-[11px] text-zinc-500">
          Reference rate: {date} · Frankfurter
        </p>
      )}

      {unavailable && currency === "USD" && (
        <p className="mt-2 text-[11px] text-zinc-500">
          Other currency estimates are temporarily unavailable.
        </p>
      )}
    </div>
  );
}