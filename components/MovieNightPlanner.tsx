
"use client";

import { useState } from "react";

type Props = {
  title: string;
  runtimeMinutes: number;
};

export default function MovieNightPlanner({
  title,
  runtimeMinutes,
}: Props) {
  const [startTime, setStartTime] = useState("19:00");
  const [breakMinutes, setBreakMinutes] = useState(0);

  if (
    !Number.isFinite(runtimeMinutes) ||
    runtimeMinutes <= 0
  ) {
    return null;
  }

  const runtime = Math.round(runtimeMinutes);
  const [hours, minutes] = startTime.split(":").map(Number);

  const start = hours * 60 + minutes;
  const finish = start + runtime + breakMinutes;
  const finishHour = Math.floor(finish / 60) % 24;
  const finishMinute = finish % 60;
  const nextDay = finish >= 1440;

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const runtimeHours = Math.floor(runtime / 60);
  const runtimeRemainder = runtime % 60;

  return (
    <section
      aria-labelledby="movie-planner-heading"
      className="mx-auto max-w-7xl px-4 py-12 md:px-6"
    >
      <div className="border border-yellow-400/20 bg-[#101722] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          CINRYVAN MOVIE NIGHT
        </p>

        <h2
          id="movie-planner-heading"
          className="mt-3 text-2xl font-black text-white sm:text-4xl"
        >
          Plan Your Movie Night
        </h2>

        <p className="mt-3 text-sm leading-7 text-white/60">
          Watching <strong className="text-white">{title}</strong>?
          Choose your starting time and see when the movie
          will finish.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-[#0b1019] p-5">
            <p className="text-xs text-white/50">
              Movie runtime
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {runtimeHours > 0 ? `${runtimeHours}h ` : ""}
              {runtimeRemainder}m
            </p>
          </div>

          <div className="border border-white/10 bg-[#0b1019] p-5">
            <p className="text-xs text-white/50">
              Total viewing time
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {Math.floor((runtime + breakMinutes) / 60)}h{" "}
              {(runtime + breakMinutes) % 60}m
            </p>
          </div>

          <div className="border border-yellow-400/30 bg-[#0b1019] p-5">
            <p className="text-xs text-white/50">
              Estimated finish time
            </p>
            <p className="mt-3 text-2xl font-black text-yellow-400">
              {formatTime(finishHour, finishMinute)}
            </p>
            {nextDay && (
              <p className="mt-1 text-xs text-yellow-300">
                Next day
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <label
              htmlFor="movie-start-time"
              className="block text-sm font-bold text-white"
            >
              What time will you start?
            </label>

            <input
              id="movie-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-4 w-full border border-white/15 bg-[#0b1019] p-4 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="movie-break-duration"
                className="text-sm font-bold text-white"
              >
                Add a break
              </label>

              <span className="font-black text-yellow-400">
                {breakMinutes} min
              </span>
            </div>

            <input
              id="movie-break-duration"
              type="range"
              min="0"
              max="30"
              step="5"
              value={breakMinutes}
              onChange={(e) =>
                setBreakMinutes(Number(e.target.value))
              }
              className="mt-6 w-full accent-yellow-400"
            />

            <div className="mt-2 flex justify-between text-xs text-white/40">
              <span>No break</span>
              <span>30 minutes</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-base font-semibold text-white">
            Your Movie Night Schedule
          </p>

          <p className="mt-3 text-sm leading-7 text-white/65">
            Start watching at{" "}
            <strong className="text-white">
              {startTime}
            </strong>.
            {breakMinutes > 0 &&
              ` Take ${breakMinutes} minutes for a break.`}{" "}
            You should finish at{" "}
            <strong className="text-yellow-400">
              {formatTime(finishHour, finishMinute)}
              {nextDay ? " the next day" : ""}
            </strong>.
          </p>

          <p className="mt-3 text-xs text-white/40">
            Times are estimates based on the movie runtime.
            Previews, advertisements and unexpected pauses
            are not included.
          </p>
        </div>
      </div>
    </section>
  );
}
