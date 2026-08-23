import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "No Ads Plan Checkout | CINRYVAN",
  description: "Review the CINRYVAN No Ads plan.",
  robots: {
    index: false,
    follow: false,
  },
};

const benefits = [
  "Remove advertising across CINRYVAN",
  "Cleaner movie, TV, anime and gaming pages",
  "Faster and less distracting discovery",
  "Cancel whenever payments become available",
];

export default function NoAdsCheckoutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_82%_35%,rgba(59,130,246,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(90deg,white_0px,white_1px,transparent_1px,transparent_90px)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm font-black text-white/55 transition hover:text-yellow-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>

        <div className="mt-7 grid overflow-hidden border border-white/10 bg-[#080b12] shadow-[0_35px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="relative min-h-[500px] overflow-hidden p-6 sm:p-10 lg:min-h-[650px] lg:p-14">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full border border-yellow-400/10 shadow-[0_0_120px_rgba(250,204,21,0.12)]" />

            <div className="relative z-10 flex h-full flex-col">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                    CINRYVAN Membership
                  </p>
                </div>

                <h1 className="mt-6 text-4xl font-black leading-[0.95] sm:text-6xl">
                  Keep the worlds.
                  <span className="block text-yellow-400">Lose the ads.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                  Enjoy a quieter CINRYVAN experience while keeping access to movies, TV, anime, cartoons, games and entertainment discovery.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-auto">
                {[
                  {
                    icon: EyeOff,
                    title: "No advertising",
                    text: "Browse without promotional interruptions.",
                  },
                  {
                    icon: Zap,
                    title: "Cleaner experience",
                    text: "More space for the content you came to discover.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Simple membership",
                    text: "One plan with no confusing upgrade ladder.",
                  },
                  {
                    icon: LockKeyhole,
                    title: "Payments protected",
                    text: "Secure checkout will be enabled before launch.",
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="border border-white/10 bg-white/[0.025] p-4"
                    >
                      <Icon className="h-5 w-5 text-yellow-400" />
                      <h2 className="mt-4 font-black">{feature.title}</h2>
                      <p className="mt-2 text-xs leading-5 text-white/45">
                        {feature.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="border-t border-white/10 bg-[#0b0f18] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-yellow-400">
              Order summary
            </p>

            <div className="mt-6 border-b border-white/10 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">No Ads</h2>
                  <p className="mt-1 text-sm text-white/45">Monthly membership</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-yellow-400">$1.99</p>
                  <p className="text-xs text-white/40">USD / month</p>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm text-white/65">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-yellow-400 text-black">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8 border border-yellow-400/25 bg-yellow-400/[0.07] p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                Payments coming soon
              </p>
              <p className="mt-2 text-xs leading-5 text-white/55">
                You will not be charged today. Secure membership payments have not been enabled yet.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-xl bg-white/10 px-5 py-4 text-sm font-black text-white/40"
            >
              Checkout unavailable
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-white/35">
              Billing begins only after checkout launches and you actively confirm payment.
            </p>

            <div className="mt-7 flex items-center justify-center gap-4 border-t border-white/10 pt-5 text-xs font-bold text-white/35">
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/support" className="transition hover:text-white">
                Support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}