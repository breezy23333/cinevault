export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Industry Radar
        </p>

        <h1 className="text-5xl font-black">Top News</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Latest movie, TV, streaming, celebrity, and entertainment updates.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold">News hub coming alive</h2>
          <p className="mt-3 text-white/60">
            Soon this page will show real entertainment news, trending stories,
            trailers, release updates, and watchlist alerts.
          </p>
        </div>
      </section>
    </main>
  );
}