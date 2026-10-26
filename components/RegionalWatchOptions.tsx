
"use client";

import { useEffect, useId, useState } from "react";
import WatchOptions from "@/components/WatchOptions";

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
};

type WatchData = {
  link?: string;
  flatrate?: Provider[];
  free?: Provider[];
  ads?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

type Props = {
  title: string;
  regions?: Record<string, WatchData> | null;
};

export default function RegionalWatchOptions({
  title,
  regions,
}: Props) {
  const [country, setCountry] = useState("US");
  const selectId = useId();

  useEffect(() => {
    const controller = new AbortController();

    async function detectRegion() {
      try {
        const response = await fetch("/api/visitor-region", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data: { country?: string } =
          await response.json();

        const detected = data.country?.toUpperCase();

        if (detected && /^[A-Z]{2}$/.test(detected)) {
          setCountry(detected);
        }
      } catch {
        // Keep the default country if detection fails.
      }
    }

    void detectRegion();

    return () => controller.abort();
  }, []);

  const availableRegions = regions ?? {};

  const countryOptions = Array.from(
    new Set([
      "US",
      "ZA",
      "GB",
      "CA",
      "AU",
      country,
      ...Object.keys(availableRegions),
    ])
  ).sort();

  const watchData = availableRegions[country] ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
            Regional streaming
          </p>
          <p className="mt-2 text-sm text-white/50">
            Choose your country to view available providers.
          </p>
        </div>

        <div>
          <label
            htmlFor={selectId}
            className="mb-2 block text-xs font-bold text-white/60"
          >
            Country
          </label>

          <select
            id={selectId}
            value={country}
            onChange={(event) =>
              setCountry(event.target.value)
            }
            className="rounded-lg border border-white/20 bg-[#111a28] px-4 py-3 text-sm font-bold text-white"
          >
            {countryOptions.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <WatchOptions
        title={title}
        country={country}
        watchData={watchData}
      />
    </div>
  );
}
