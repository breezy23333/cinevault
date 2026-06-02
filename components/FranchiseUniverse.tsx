"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const franchises = [
  {
    name: "Marvel",
    image: "https://image.tmdb.org/t/p/w780/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
  },
  {
    name: "DC",
    image: "https://image.tmdb.org/t/p/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
  },
  {
    name: "Star Wars",
    image: "https://image.tmdb.org/t/p/w780/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
  },
  {
    name: "Fast and Furious",
    image: "https://image.tmdb.org/t/p/w780/pjUH57qjV9jM5dW7jz2VbhM0A.jpg",
  },
  {
    name: "Harry Potter",
    image: "https://image.tmdb.org/t/p/w780/hziiv14OpD73u9gAak4XDDfBKa2.jpg",
  },
  {
    name: "Lord of the Rings",
    image: "https://image.tmdb.org/t/p/w780/56zTpe2xvaA4alU51sRWPoKPYZy.jpg",
  },
  {
    name: "The Hobbit",
    image: "https://image.tmdb.org/t/p/w780/xrPBV0otKf1L2xXWY4Q9h0R6m.jpg",
  },
  {
    name: "Jurassic Park",
    image: "https://image.tmdb.org/t/p/w780/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
  },
  {
    name: "Jurassic World",
    image: "https://image.tmdb.org/t/p/w780/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    name: "Transformers",
    image: "https://image.tmdb.org/t/p/w780/cSKa3Zg1kTDTfD2aXWzH7C9q4.jpg",
  },
  {
    name: "Mission Impossible",
    image: "https://image.tmdb.org/t/p/w780/ih4lZkUpmSE7AP3maymiO72xJ1z.jpg",
  },
  {
    name: "Pirates of the Caribbean",
    image: "https://image.tmdb.org/t/p/w780/8AUQ7Yl2z5t6eE4Q5R8B7b4X.jpg",
  },
  {
    name: "John Wick",
    image: "https://image.tmdb.org/t/p/w780/umC04Cozevu8nn3JTDJ1pc7PVTn.jpg",
  },
  {
    name: "The Matrix",
    image: "https://image.tmdb.org/t/p/w780/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
  },
  {
    name: "Avatar",
    image: "https://image.tmdb.org/t/p/w780/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg",
  },
  {
    name: "Batman",
    image: "https://image.tmdb.org/t/p/w780/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  },
  {
    name: "Spider-Man",
    image: "https://image.tmdb.org/t/p/w780/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
  },
  {
    name: "Avengers",
    image: "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
  },
  {
    name: "Deadpool",
    image: "https://image.tmdb.org/t/p/w780/en971MEXui9diirXlogOrPKmsEn.jpg",
  },
  {
    name: "Pokemon",
    image: "https://image.tmdb.org/t/p/w780/l2jVyjM0CgP4x7Wy0NX7SQoGFmF.jpg",
  },
  {
    name: "Dune",
    image: "https://image.tmdb.org/t/p/w780/iqyPvdsOWM0QwEJ0r6qXxK6X.jpg",
  },
  {
  name: "X-Men",
  image: "https://image.tmdb.org/t/p/w780/2k9tBql5GYH328Krj66tDT9LtFZ.jpg",
  },
  {
    name: "Black Panther",
    image: "https://image.tmdb.org/t/p/w780/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg",
  },
  {
    name: "Godzilla",
    image: "https://image.tmdb.org/t/p/w780/inJjDhCjfhh3RtrJWBmmDqeuSYC.jpg",
  },
  {
    name: "King Kong",
    image: "https://image.tmdb.org/t/p/w780/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
  },
  {
    name: "Sonic",
    image: "https://image.tmdb.org/t/p/w780/8wwXPG22aNMpPGuXnfm3galoxbI.jpg",
  },
  {
    name: "Super Mario Bros",
    image: "https://image.tmdb.org/t/p/w780/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
  },

];

export default function FranchiseUniverse() {

    const rowRef = useRef<HTMLDivElement>(null);

    function scroll(dir: "left" | "right") {
    rowRef.current?.scrollBy({
        left: dir === "left" ? -500 : 500,
        behavior: "smooth",
    });
    }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.15),transparent_35%)]" />

      <div className="relative mb-6 flex items-end justify-between gap-4">
        <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            Cinematic Universes
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
            Legendary Franchises
            </h2>

            <p className="mt-3 max-w-3xl text-white/60">
            Explore the biggest movie worlds, sagas, superheroes, fantasy realms,
            animation universes, and horror collections.
            </p>
        </div>

        <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll("left")} className="rounded-full border border-white/10 bg-black/40 p-3 hover:bg-yellow-400 hover:text-black">
            <ChevronLeft />
            </button>
            <button onClick={() => scroll("right")} className="rounded-full border border-white/10 bg-black/40 p-3 hover:bg-yellow-400 hover:text-black">
            <ChevronRight />
            </button>
        </div>
        </div>

      <div
        ref={rowRef}
        className="relative flex gap-4 overflow-x-auto pb-3 hide-scrollbar"
        >
        {franchises.map((f) => (
          <Link
            key={f.name}
            href={`/search?q=${encodeURIComponent(f.name)}`}
            className="group min-w-[190px] rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/10"
          >
            <div className="relative mb-4 h-24 overflow-hidden rounded-2xl">
                <img
                    src={f.image}
                    alt={f.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "/og-image.png";
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

            <h3 className="line-clamp-2 min-h-[44px] text-lg font-black leading-tight">
              {f.name}
            </h3>

            <p className="mt-2 text-xs text-white/45 group-hover:text-yellow-300">
              Explore universe
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}