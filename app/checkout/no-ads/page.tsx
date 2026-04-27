import Link from "next/link";

export default function NoAdsCheckoutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-black text-white">No Ads Plan</h1>

      <p className="mt-4 text-white/70">
        You selected the No Ads plan for $20 / month.
      </p>

      <div className="mt-8 rounded-3xl border border-yellow-400/40 bg-yellow-400/10 p-6">
        <h2 className="text-2xl font-bold text-yellow-400">$20 / month</h2>

        <p className="mt-2 text-white/70">
          Remove ads and enjoy a cleaner CineVault experience.
        </p>

        <button className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black">
          Payment coming soon
        </button>
      </div>

      <Link href="/store" className="mt-6 inline-block text-yellow-400">
        ← Back to Store
      </Link>
    </main>
  );
}
