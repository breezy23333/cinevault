"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchForm({
  placeholder = "Search movies, shows...",
}: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();                 // usually "/search"
  const sp = useSearchParams();

  // hydrate initial value from ?q=
  const initial = sp.get("q") ?? "";
  const [value, setValue] = useState(initial);
  const [isPending, startTransition] = useTransition();

  // ---- DEBOUNCE: update the URL after user stops typing (no full reload) ----
  useEffect(() => {
    const t = setTimeout(() => {
      const q = value.trim();
      const params = new URLSearchParams(sp.toString());
      if (q) params.set("q", q); else params.delete("q");
      startTransition(() => {
        // replace avoids filling the back/forward history on every keystroke
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 450);                                      // debounce time
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // ---- NORMAL SUBMIT still works (Enter / button) ----
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q); else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
      <input
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-full bg-black/60 text-white placeholder-white/50 px-4 py-2 ring-1 ring-white/15 outline-none focus:ring-white/30"
        aria-label="Search"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70">
          searching…
        </div>
      )}
      {/* Optional: a submit button if you have one */}
      {/* <button type="submit" className="hidden">Search</button> */}
    </form>
  );
}
