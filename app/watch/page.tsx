import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Clapperboard,
  ExternalLink,
  MapPin,
  MonitorPlay,
  Search,
  ShoppingBag,
  Ticket,
  Tv,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Where to Watch Movies & Buy Cinema Tickets",
  description:
    "Find where to stream, rent or buy movies and TV shows, compare major streaming platforms, and book cinema tickets with trusted providers.",
  alternates: {
    canonical: "/watch",
  },
  openGraph: {
    title: "Where to Watch & Buy Tickets | CINRYVAN",
    description:
      "Search movies and shows, explore legal streaming services, and find trusted cinema ticket providers.",
    url: "/watch",
    siteName: "CINRYVAN",
    type: "website",
    images: ["/og-image.png"],
  },
};

const streamingPlatforms = [
  {
    name: "Netflix",
    description: "Movies, series, documentaries and global originals.",
    href: "https://www.netflix.com/za/",
    accent: "from-red-600/35",
  },
  {
    name: "Prime Video",
    description: "Subscription streaming plus selected rentals and purchases.",
    href: "https://www.primevideo.com/",
    accent: "from-sky-500/35",
  },
  {
    name: "Disney+",
    description: "Disney, Pixar, Marvel, Star Wars and National Geographic.",
    href: "https://www.disneyplus.com/",
    accent: "from-blue-600/35",
  },
  {
    name: "Apple TV+",
    description: "Apple Originals and access to movies available to rent or buy.",
    href: "https://tv.apple.com/za",
    accent: "from-white/20",
  },
  {
    name: "Showmax",
    description: "African entertainment, international series and live sport plans.",
    href: "https://www.showmax.com/za",
    accent: "from-fuchsia-600/30",
  },
  {
    name: "Crunchyroll",
    description: "Anime series, films, simulcasts and selected free episodes.",
    href: "https://www.crunchyroll.com/",
    accent: "from-orange-500/35",
  },
  {
    name: "YouTube Movies",
    description: "Selected movies and programmes available to rent or purchase.",
    href: "https://www.youtube.com/feed/storefront",
    accent: "from-red-500/30",
  },
  {
    name: "DStv Stream",
    description: "Live channels and on-demand entertainment for eligible plans.",
    href: "https://dstvstream.com/",
    accent: "from-cyan-500/30",
  },
] as const;

const rentOrBuyPlatforms = [
  {
    name: "Apple TV Store",
    href: "https://tv.apple.com/za",
    text: "Rent or purchase eligible movies and watch across supported Apple devices.",
  },
  {
    name: "Prime Video Store",
    href: "https://www.primevideo.com/storefront/",
    text: "Browse titles offered for rental or purchase in supported regions.",
  },
  {
    name: "Google TV & YouTube",
    href: "https://www.youtube.com/feed/storefront",
    text: "Find eligible digital rentals and purchases connected to your Google account.",
  },
] as const;

const cinemaPartners = [
  {
    name: "Ster-Kinekor",
    region: "South Africa",
    description: "Find local cinemas, showtimes, ticket prices and seat bookings.",
    href: "https://www.sterkinekor.com/",
  },
  {
    name: "Nu Metro",
    region: "South Africa",
    description: "Browse now showing titles, cinemas, formats and online bookings.",
    href: "https://numetro.co.za/",
  },
  {
    name: "Fandango",
    region: "United States",
    description: "Search participating cinemas, movie times and advance tickets.",
    href: "https://www.fandango.com/",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Search a title",
    text: "Type a movie, show, actor or description into CINRYVAN search.",
  },
  {
    number: "02",
    title: "Open its details",
    text: "Compare the story, cast, trailer, rating and available watch providers.",
  },
  {
    number: "03",
    title: "Choose a legal provider",
    text: "Continue to the streaming service, digital store or cinema to complete the action.",
  },
] as const;

export default function WatchPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] pt-16 text-white">
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-yellow-400/10 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:90px_90px]" />
        </div>

        <div className="relative mx-auto grid min-h-[660px] max-w-[1600px] items-center gap-12 px-5 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.38em] text-yellow-400">
              CINRYVAN Watch Guide
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl xl:text-8xl">
              Find it. Watch it. See it on the
              <span className="block text-yellow-400">big screen.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Search for a movie or show, discover legal streaming options,
              compare rent-or-buy services and continue to trusted cinema
              partners for tickets.
            </p>

            <form action="/search" className="mt-9 max-w-3xl">
              <div className="relative rounded-2xl border border-yellow-400/45 bg-black/60 p-2 shadow-[0_0_60px_rgba(250,204,21,0.1)] backdrop-blur-xl">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-400" />
                <input
                  name="q"
                  required
                  aria-label="Search movies and TV shows"
                  placeholder="Search a title or describe what you remember..."
                  className="h-14 w-full rounded-xl bg-white/[0.06] pl-12 pr-36 text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/[0.09] sm:text-base"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Find it
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/55">
              <a href="#streaming" className="rounded-full border border-white/10 px-4 py-2 hover:border-yellow-400/50 hover:text-yellow-300">Streaming</a>
              <a href="#rent-buy" className="rounded-full border border-white/10 px-4 py-2 hover:border-yellow-400/50 hover:text-yellow-300">Rent or buy</a>
              <a href="#tickets" className="rounded-full border border-white/10 px-4 py-2 hover:border-yellow-400/50 hover:text-yellow-300">Cinema tickets</a>
              <Link href="/store" className="rounded-full border border-white/10 px-4 py-2 hover:border-yellow-400/50 hover:text-yellow-300">Store & deals</Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-8 rounded-full bg-yellow-400/15 blur-[100px]" />
            <div className="relative grid rotate-2 grid-cols-2 gap-4 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
              {[
                { icon: MonitorPlay, title: "Stream", text: "Subscription platforms" },
                { icon: BadgeDollarSign, title: "Rent", text: "One-time access" },
                { icon: ShoppingBag, title: "Buy", text: "Digital ownership" },
                { icon: Ticket, title: "Tickets", text: "Cinema showtimes" },
              ].map(({ icon: Icon, title, text }, index) => (
                <div
                  key={title}
                  className={`min-h-52 rounded-[2rem] border p-6 ${
                    index === 0
                      ? "border-yellow-400/50 bg-yellow-400 text-black"
                      : "border-white/10 bg-[#0b101a]"
                  }`}
                >
                  <Icon className="h-9 w-9" />
                  <p className="mt-16 text-2xl font-black">{title}</p>
                  <p className={`mt-1 text-sm ${index === 0 ? "text-black/60" : "text-white/45"}`}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="streaming" className="scroll-mt-24 border-b border-white/10 px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <SectionHeading
            eyebrow="Streaming directory"
            title="Major platforms in one place"
            description="Open the official service to check its current catalogue, plans and availability in your country."
          />

          <div id="platforms" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {streamingPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative min-h-64 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${platform.accent} via-[#10151f] to-[#080b12] p-6 transition hover:-translate-y-1 hover:border-yellow-400/45`}
              >
                <div className="flex items-start justify-between">
                  <Tv className="h-8 w-8 text-yellow-400" />
                  <ExternalLink className="h-4 w-4 text-white/35 transition group-hover:text-yellow-300" />
                </div>
                <div className="absolute inset-x-6 bottom-6">
                  <h2 className="text-2xl font-black">{platform.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">{platform.description}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-5 rounded-3xl border border-yellow-400/25 bg-yellow-400/[0.06] p-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">South Africa availability guide</p>
              <h3 className="mt-2 text-2xl font-black">Compare legal offers with JustWatch South Africa</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">Provider catalogues differ by country and change over time. Use a regional availability guide before subscribing or paying.</p>
            </div>
            <ExternalButton href="https://www.justwatch.com/za">Open JustWatch ZA</ExternalButton>
          </div>
        </div>
      </section>

      <section id="rent-buy" className="scroll-mt-24 border-b border-white/10 px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <SectionHeading
            eyebrow="Digital store"
            title="Rent tonight or buy for later"
            description="Check the provider for regional availability, video quality, pricing and rental expiry rules before paying."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {rentOrBuyPlatforms.map((platform, index) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-white/10 bg-[#0b1018] p-7 transition hover:border-yellow-400/45"
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-white/[0.08]">0{index + 1}</span>
                  <ShoppingBag className="h-7 w-7 text-yellow-400" />
                </div>
                <h3 className="mt-8 text-2xl font-black">{platform.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{platform.text}</p>
                <span className="mt-7 flex items-center gap-2 text-sm font-black text-yellow-300">Visit provider <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-24 border-b border-white/10 px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <SectionHeading
            eyebrow="Cinema tickets"
            title="From discovery to the big screen"
            description="Choose a trusted cinema partner, select your location and complete the booking on the provider's official website."
          />

          <div id="cinemas" className="mt-10 grid gap-5 lg:grid-cols-3">
            {cinemaPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#151b27] to-[#080b11] p-7 transition hover:border-yellow-400/50"
              >
                <div className="flex items-center justify-between">
                  <Ticket className="h-8 w-8 text-yellow-400" />
                  <ExternalLink className="h-4 w-4 text-white/35 group-hover:text-yellow-300" />
                </div>
                <h3 className="mt-16 text-3xl font-black">{partner.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-400"><MapPin className="h-4 w-4" /> {partner.region}</p>
                <p className="mt-4 text-sm leading-7 text-white/55">{partner.description}</p>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-6 text-white/45">
            CINRYVAN helps you discover options. Ticket purchases, subscriptions, rentals and refunds are handled by the external provider under its own terms.
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <SectionHeading
            eyebrow="How it works"
            title="One journey, three simple steps"
            description="CINRYVAN connects discovery with the next legal place to watch."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="bg-[#080b12] p-8">
                <span className="text-5xl font-black text-yellow-400/25">{step.number}</span>
                <h3 className="mt-8 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/50">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1600px] overflow-hidden rounded-[2.25rem] border border-yellow-400/30 bg-gradient-to-r from-yellow-400/[0.14] via-[#111722] to-blue-600/[0.12] lg:grid-cols-[1fr_auto]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-400">CINRYVAN Store</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Deals, movie products and gaming offers live in the Store.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">Keep purchases and special offers separate from streaming availability and cinema tickets.</p>
            <Link href="/store" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-black hover:bg-yellow-300">Open Store <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="hidden min-w-72 items-center justify-center border-l border-white/10 lg:flex">
            <Clapperboard className="h-28 w-28 text-yellow-400/60" />
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-5 border-l-2 border-yellow-400 pl-5 lg:grid-cols-[1fr_0.6fr] lg:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.34em] text-yellow-400">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-white/50 lg:justify-self-end">{description}</p>
    </div>
  );
}

function ExternalButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black hover:bg-yellow-300"
    >
      {children} <ExternalLink className="h-4 w-4" />
    </a>
  );
}
