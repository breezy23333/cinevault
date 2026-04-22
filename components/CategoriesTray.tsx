"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Grid2X2, ChevronDown, ChevronUp } from "lucide-react";

type Genre = { id: number; name: string };

export default function CategoriesTray({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // show a nice count on first row; rest in additional rows
  const all = useMemo(() => (Array.isArray(genres) ? genres : []), [genres]);

  const chip =
    "rounded-full px-4 py-1.5 text-sm ring-1 ring-amber-400/70 text-amber-200 " +
    "hover:bg-amber-400 hover:text-black transition-colors duration-150 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

  const go = (g: Genre) => router.push(`/search?genre=${g.id}`);

  return (
    <div className="rounded-xl bg-[#0c111b] ring-1 ring-white/10 px-4 py-5">
      {/* Centered toggle that collapses away when open */}
      <div
        className={[
          "flex justify-center transition-all duration-300 ease-out",
          open
            ? "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
            : "max-h-10 opacity-100 translate-y-0",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className={`inline-flex items-center gap-2 ${chip}`}
        >
          <Grid2X2 className="h-4 w-4" />
          Categories
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded chips */}
      <div
        data-open={open ? "true" : undefined}
        className="overflow-hidden transition-[max-height,opacity,margin-top] duration-300 ease-out
                   max-h-0 opacity-0 data-[open=true]:max-h-64 data-[open=true]:opacity-100 data-[open=true]:mt-1"
      >
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {all.map((g) => (
            <button key={g.id} onClick={() => go(g)} className={chip}>
              {g.name}
            </button>
          ))}

          {/* Collapse control at the end */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`${chip} inline-flex items-center gap-2`}
            aria-label="Collapse categories"
          >
            Less
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
