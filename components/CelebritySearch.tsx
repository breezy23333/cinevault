"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type CelebrityResult = {
  id: number;
  name: string;
  profile: string | null;
  department: string;
  knownFor: string[];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function CelebritySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    CelebrityResult[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/people/search?q=${encodeURIComponent(value)}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        setResults(
          Array.isArray(data?.results)
            ? data.results
            : [],
        );

        setOpen(true);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full"
    >
      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-400" />

        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setOpen(true);
            }
          }}
          placeholder="Search any actor, actress, director or celebrity..."
          aria-label="Search celebrities"
          className="h-16 w-full border border-white/15 bg-black/45 pl-14 pr-14 text-base text-white outline-none backdrop-blur-xl transition placeholder:text-white/35 focus:border-yellow-400/70 focus:bg-black/65 sm:h-20 sm:text-lg"
        />

        {loading ? (
          <Loader2 className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-yellow-400" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            aria-label="Clear celebrity search"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/45 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <Sparkles className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/25" />
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full max-h-[520px] overflow-y-auto border-x border-b border-white/15 bg-[#090d15]/98 shadow-2xl backdrop-blur-2xl">
          {results.length > 0 ? (
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {results.map((person) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  onClick={() => setOpen(false)}
                  className="group flex min-w-0 items-center gap-4 bg-[#090d15] p-4 transition hover:bg-yellow-400/10"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {person.profile ? (
                      <Image
                        src={person.profile}
                        alt={person.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center font-black text-yellow-300">
                        {getInitials(person.name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-white transition group-hover:text-yellow-300">
                      {person.name}
                    </h3>

                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400/70">
                      {person.department}
                    </p>

                    {person.knownFor.length > 0 && (
                      <p className="mt-1 truncate text-xs text-white/40">
                        {person.knownFor.join(" • ")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading ? (
            <div className="p-8 text-center">
              <p className="font-bold text-white/65">
                No celebrities found
              </p>

              <p className="mt-2 text-sm text-white/35">
                Check the spelling or try another name.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}