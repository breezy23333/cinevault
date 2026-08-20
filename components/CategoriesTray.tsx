// components/CategoriesTray.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Grid2X2,
} from "lucide-react";

type Genre = {
  id: number;
  name: string;
};

export default function CategoriesTray({
  genres,
}: {
  genres: Genre[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const categories = Array.isArray(genres)
    ? genres.filter(
        (genre) =>
          genre &&
          typeof genre.id === "number" &&
          Boolean(genre.name),
      )
    : [];

  const chipClass =
    "inline-flex h-8 shrink-0 items-center justify-center rounded-full " +
    "border border-yellow-400/35 px-3 text-[10px] font-bold " +
    "text-yellow-200 transition " +
    "hover:border-yellow-400 hover:bg-yellow-400 hover:text-black " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 " +
    "sm:h-9 sm:px-4 sm:text-xs md:text-sm";

  if (categories.length === 0) return null;

  return (
    <div className="min-w-0">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className={`${chipClass} gap-2`}
        >
          <Grid2X2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Categories
          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      ) : (
        <div className="relative min-w-0">
          <div
            className="
              hide-scrollbar
              flex min-w-0 gap-2 overflow-x-auto
              overscroll-x-contain pb-1
              md:flex-wrap md:overflow-visible md:pb-0
            "
          >
            {categories.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() =>
                  router.push(`/search?genre=${genre.id}`)
                }
                className={chipClass}
              >
                {genre.name}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${chipClass} gap-1.5 border-white/20 text-white/65 hover:border-white/40 hover:bg-white/10 hover:text-white`}
              aria-label="Collapse categories"
            >
              Less
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile fade showing that the row scrolls horizontally */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#05070d] to-transparent md:hidden" />
        </div>
      )}
    </div>
  );
}