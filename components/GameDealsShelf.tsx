"use client";

/* eslint-disable @next/next/no-img-element */

import { ChevronLeft, ChevronRight, ExternalLink, Flame } from "lucide-react";
import { useRef } from "react";
import type { GameDeal } from "@/lib/gameDeals";

const CHEAPSHARK_URL = "https://www.cheapshark.com";

const getDealUrl = (dealID: string) =>
  `${CHEAPSHARK_URL}/redirect?dealID=${encodeURIComponent(dealID)}`;

function money(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function GameDealsShelf({ deals }: { deals: GameDeal[] }) {
  const shelfRef = useRef<HTMLDivElement>(null);

  if (!deals.length) return null;

  function scrollDeals(direction: -1 | 1) {
    const shelf = shelfRef.current;
    if (!shelf) return;
    shelf.scrollBy({
      left: direction * Math.max(300, shelf.clientWidth * 0.82),
      behavior: "smooth",
    });
  }

  return (
    <section className="py-8" aria-labelledby="game-deals-title">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-yellow-400">
            <Flame className="h-4 w-4" fill="currentColor" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              Limited-time prices
            </p>
          </div>
          <h2
            id="game-deals-title"
            className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl"
          >
            Special Offers
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Current PC game discounts displayed in US dollars.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={CHEAPSHARK_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white/70 transition hover:border-yellow-400 hover:text-yellow-400 sm:inline-flex"
          >
            More deals
          </a>
          <button
            type="button"
            onClick={() => scrollDeals(-1)}
            aria-label="Scroll game deals left"
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollDeals(1)}
            aria-label="Scroll game deals right"
            className="grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-white/70 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 px-4 md:-mx-6 md:px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#080b12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#080b12] to-transparent" />

        <div
          ref={shelfRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((deal) => {
            const savings = Math.max(0, Math.round(Number(deal.savings) || 0));
            const metascore = Number(deal.metacriticScore);
            const positive = Number(deal.steamRatingPercent);

            return (
              <a
                key={deal.dealID}
                href={getDealUrl(deal.dealID)}
                target="_blank"
                rel="noreferrer"
                className="group w-[76vw] max-w-[300px] shrink-0 snap-start overflow-hidden border border-white/10 bg-[#121a27] shadow-[0_12px_35px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/70 sm:w-[270px]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0b1019]">
                  <img
                    src={deal.thumb}
                    alt={deal.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                  <span className="absolute right-2 top-2 grid h-8 w-8 translate-y-1 place-items-center bg-black/70 text-white/70 opacity-0 transition group-hover:translate-y-0 group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-3.5">
                  <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-black leading-[22px] text-white transition group-hover:text-yellow-400">
                    {deal.title}
                  </h3>

                  <div className="mt-3 flex items-stretch justify-end">
                    <span className="grid min-w-[62px] place-items-center bg-yellow-400 px-2 text-lg font-black text-black">
                      -{savings}%
                    </span>
                    <div className="flex min-w-[92px] flex-col items-end justify-center bg-[#0b1019] px-3 py-1.5">
                      <span className="text-[10px] font-bold leading-none text-white/30 line-through">
                        {money(deal.normalPrice)}
                      </span>
                      <span className="mt-1 text-sm font-black leading-none text-yellow-400">
                        {money(deal.salePrice)}
                      </span>
                    </div>
                  </div>

                  {(metascore > 0 || positive > 0) && (
                    <div className="mt-3 flex min-h-[24px] items-center gap-2 border-t border-white/10 pt-3 text-[10px] font-bold text-white/45">
                      {metascore > 0 && (
                        <span className="border border-emerald-400/40 px-1.5 py-1 text-emerald-300">
                          {deal.metacriticScore} Metascore
                        </span>
                      )}
                      {positive > 0 && <span>{deal.steamRatingPercent}% positive</span>}
                    </div>
                  )}
                </div>

                <div className="h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-[10px] leading-4 text-white/30">
        <p>Deal data supplied by CheapShark. Prices and availability may change.</p>
        <a
          href={CHEAPSHARK_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-white/45 hover:text-yellow-400 sm:hidden"
        >
          More deals <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </section>
  );
}
