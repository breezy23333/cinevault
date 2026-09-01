"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { useRef, useState } from "react";

type Provider = {
  name: string;
  href: string;
  logo: string;
  region: string;
  label: string;
  description: string;
  color: string;
};

const digitalStores: Provider[] = [
  {
    name: "Apple TV Store",
    href: "https://tv.apple.com/za",
    logo: "https://cdn.simpleicons.org/appletv/ffffff",
    region: "South Africa",
    label: "Rent + Buy",
    description: "Eligible movies across supported Apple devices.",
    color: "#f5f5f5",
  },
  {
    name: "Prime Video Store",
    href: "https://www.primevideo.com/storefront/",
    logo: "https://cdn.simpleicons.org/primevideo/00A8E1",
    region: "Selected regions",
    label: "Rent + Buy",
    description: "Digital movie rentals and purchases where supported.",
    color: "#00A8E1",
  },
  {
    name: "YouTube Movies",
    href: "https://www.youtube.com/feed/storefront",
    logo: "https://cdn.simpleicons.org/youtube/FF0000",
    region: "Selected regions",
    label: "Rent + Buy",
    description: "Watch eligible purchases through your Google account.",
    color: "#FF0000",
  },
  {
    name: "Microsoft Store",
    href: "https://www.microsoft.com/store/movies-and-tv",
    logo: "https://cdn.simpleicons.org/microsoft/ffffff",
    region: "Selected regions",
    label: "Rent + Buy",
    description: "Movies and television for compatible Microsoft devices.",
    color: "#00A4EF",
  },
  {
    name: "Rakuten TV",
    href: "https://www.rakuten.tv/",
    logo: "https://cdn.simpleicons.org/rakuten/BF0000",
    region: "Europe",
    label: "Rent + Buy",
    description: "New releases, catalogue movies and free channels.",
    color: "#BF0000",
  },
  {
    name: "Fandango at Home",
    href: "https://athome.fandango.com/",
    logo: "https://logo.clearbit.com/fandango.com",
    region: "United States",
    label: "Rent + Buy",
    description: "Digital rentals and purchases with no subscription required.",
    color: "#FF7300",
  },
];

const cinemaPartners: Provider[] = [
  {
    name: "Ster-Kinekor",
    href: "https://www.sterkinekor.com/",
    logo: "https://logo.clearbit.com/sterkinekor.com",
    region: "South Africa",
    label: "Local priority",
    description: "Cinema locations, showtimes, formats and online seat booking.",
    color: "#E31B23",
  },
  {
    name: "Nu Metro",
    href: "https://numetro.co.za/",
    logo: "https://logo.clearbit.com/numetro.co.za",
    region: "South Africa",
    label: "Local priority",
    description: "Now showing movies, local cinemas and online tickets.",
    color: "#FFCB05",
  },
  {
    name: "CineCentre",
    href: "https://cinecentre.co.za/",
    logo: "https://logo.clearbit.com/cinecentre.co.za",
    region: "South Africa",
    label: "Local priority",
    description: "South African cinema schedules, promotions and bookings.",
    color: "#E2231A",
  },
  {
    name: "Fandango",
    href: "https://www.fandango.com/",
    logo: "https://logo.clearbit.com/fandango.com",
    region: "United States",
    label: "Cinema tickets",
    description: "Movie times and advance tickets at participating cinemas.",
    color: "#FF7300",
  },
  {
    name: "AMC Theatres",
    href: "https://www.amctheatres.com/",
    logo: "https://cdn.simpleicons.org/amctheatres/E51937",
    region: "United States",
    label: "Cinema tickets",
    description: "Showtimes, premium formats, memberships and seat booking.",
    color: "#E51937",
  },
  {
    name: "Regal",
    href: "https://www.regmovies.com/",
    logo: "https://logo.clearbit.com/regmovies.com",
    region: "United States",
    label: "Cinema tickets",
    description: "Local theatre schedules, premium screens and tickets.",
    color: "#F3C800",
  },
  {
    name: "Cineworld",
    href: "https://www.cineworld.co.uk/",
    logo: "https://logo.clearbit.com/cineworld.co.uk",
    region: "United Kingdom",
    label: "Cinema tickets",
    description: "UK cinema listings, IMAX experiences and online booking.",
    color: "#E31B23",
  },
  {
    name: "ODEON",
    href: "https://www.odeon.co.uk/",
    logo: "https://logo.clearbit.com/odeon.co.uk",
    region: "United Kingdom",
    label: "Cinema tickets",
    description: "Cinema locations, showtimes and ticket reservations.",
    color: "#00AEEF",
  },
  {
    name: "Vue",
    href: "https://www.myvue.com/",
    logo: "https://logo.clearbit.com/myvue.com",
    region: "Europe",
    label: "Cinema tickets",
    description: "European cinema listings and online seat selection.",
    color: "#26A9E0",
  },
  {
    name: "HOYTS",
    href: "https://www.hoyts.com.au/",
    logo: "https://logo.clearbit.com/hoyts.com.au",
    region: "Australia",
    label: "Cinema tickets",
    description: "Australian cinema times, experiences and online tickets.",
    color: "#E31837",
  },
];

function Logo({ provider }: { provider: Provider }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-16 items-center">
      {!failed ? (
        <img
          src={provider.logo}
          alt={`${provider.name} logo`}
          className="max-h-11 max-w-[170px] object-contain object-left"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-2xl font-black tracking-[-0.04em] text-white">
          {provider.name}
        </span>
      )}
    </div>
  );
}

function ProviderRail({
  providers,
  railId,
}: {
  providers: Provider[];
  railId: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.78, 720),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-8">
      <div className="absolute right-0 -top-16 hidden gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll providers left"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0b1018] text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll providers right"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0b1018] text-white transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        id={railId}
        ref={railRef}
        className="scrollbar-thin flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5"
      >
        {providers.map((provider, index) => (
          <a
            key={provider.name}
            href={provider.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative min-h-[285px] w-[82vw] max-w-[390px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1018] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/55"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-20 blur-[65px] transition group-hover:opacity-40"
              style={{ backgroundColor: provider.color }}
            />

            <div className="relative flex items-start justify-between gap-4">
              <span className="text-5xl font-black text-white/[0.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ExternalLink className="h-4 w-4 text-white/30 transition group-hover:text-yellow-300" />
            </div>

            <div className="relative mt-3">
              <Logo provider={provider} />
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-black">
                  {provider.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                  <MapPin className="h-3 w-3" /> {provider.region}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/50">
                {provider.description}
              </p>
            </div>

            <span className="absolute bottom-5 left-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-yellow-300">
              Open provider
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function WatchProviderRails() {
  return (
    <>
      <section
        id="rent-buy"
        className="scroll-mt-24 border-b border-white/10 px-5 py-16 lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-end justify-between gap-8 border-l-2 border-yellow-400 pl-5">
            <div>
              <div className="flex items-center gap-3 text-yellow-400">
                <ShoppingBag className="h-5 w-5" />
                <p className="text-xs font-black uppercase tracking-[0.32em]">
                  Digital stores
                </p>
              </div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Rent tonight. Keep it forever.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                Compare trusted digital stores, then confirm regional pricing,
                quality and rental terms directly with the provider.
              </p>
            </div>
          </div>
          <ProviderRail providers={digitalStores} railId="digital-store-rail" />
        </div>
      </section>

      <section
        id="tickets"
        className="scroll-mt-24 border-b border-white/10 bg-white/[0.015] px-5 py-16 lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-end justify-between gap-8 border-l-2 border-yellow-400 pl-5">
            <div>
              <div className="flex items-center gap-3 text-yellow-400">
                <Ticket className="h-5 w-5" />
                <p className="text-xs font-black uppercase tracking-[0.32em]">
                  Cinema partners
                </p>
              </div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Your seat is waiting.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                South African cinemas appear first, followed by trusted
                international ticket providers.
              </p>
            </div>
          </div>
          <ProviderRail providers={cinemaPartners} railId="cinema-partner-rail" />

          <div className="mt-2 rounded-2xl border border-white/10 bg-[#0b1018] px-5 py-4 text-sm leading-6 text-white/45">
            CINRYVAN helps you discover legal options. Ticket purchases,
            subscriptions, rentals and refunds are completed by the external
            provider under its own terms.
          </div>
        </div>
      </section>
    </>
  );
}
