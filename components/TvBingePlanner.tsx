
"use client";

import { useState } from "react";

type Props = {
  episodeCount: number;
  episodeMinutes: number;
};

export default function TvBingePlanner({
  episodeCount,
  episodeMinutes,
}: Props) {
  const [perDay, setPerDay] = useState(2);

  if (
    !Number.isFinite(episodeCount) ||
    !Number.isFinite(episodeMinutes) ||
    episodeCount <= 0 ||
    episodeMinutes <= 0
  ) {
    return null;
  }

  const totalMinutes = Math.round(
    episodeCount * episodeMinutes
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.ceil(episodeCount / perDay);

  return (
    <section
      aria-labelledby="binge-planner-title"
      className="mx-auto max-w-7xl px-4 py-12 md:px-6"
    >
      <div className="border border-red-500/20 bg-[#101722] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
          CINRYVAN WATCH GUIDE
        </p>

        <h2
          id="binge-planner-title"
          className="mt-3 text-2xl font-black text-white sm:text-4xl"
        >
          How Long to Finish This Series?
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          Plan your next binge. Adjust how many episodes
          you watch daily to estimate when you could
          finish the series.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Episodes",
              value: episodeCount.toLocaleString(),
            },
            {
              label: "Estimated total watch time",
              value: `${hours}h ${minutes}m`,
            },
            {
              label: "Days to finish",
              value: `${days} days`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-white/10 bg-[#0b1019] p-5"
            >
              <p className="text-xs text-white/50">
                {item.label}
              </p>

              <p className="mt-3 text-2xl font-black text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <label
              htmlFor="binge-episodes-per-day"
              className="text-sm font-bold text-white"
            >
              Episodes per day
            </label>

            <span className="text-lg font-black text-red-400">
              {perDay}
            </span>
          </div>

          <input
            id="binge-episodes-per-day"
            type="range"
            min="1"
            max="8"
            step="1"
            value={perDay}
            onChange={(event) =>
              setPerDay(Number(event.target.value))
            }
            className="mt-5 w-full accent-red-500"
          />

          <p className="mt-4 text-sm text-white/60">
            At {perDay} episode{perDay === 1 ? "" : "s"} per
            day, finishing the available episodes would
            take approximately {days} days.
          </p>

          <p className="mt-3 text-xs leading-6 text-white/40">
            Estimates use the available episode count
            and a typical episode runtime. Actual
            runtimes may vary. Special episodes may
            not be included.
          </p>
        </div>
      </div>
    </section>
  );
}
