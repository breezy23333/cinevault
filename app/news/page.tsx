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

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
            <article
            key={item}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
            >
            <div className="h-56 bg-gradient-to-br from-yellow-500/20 to-white/5" />

            <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Breaking
                </p>

                <h2 className="mt-3 line-clamp-2 text-2xl font-black transition group-hover:text-yellow-300">
                Major entertainment story headline goes here
                </h2>

                <p className="mt-3 line-clamp-3 text-sm text-white/60">
                Movie releases, streaming updates, celebrity news, trailers,
                and entertainment industry reports.
                </p>

                <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-white/40">
                    2 hours ago
                </span>

                <button className="rounded-full border border-yellow-400/30 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
                    Read More
                </button>
                </div>
            </div>
            </article>
        ))}
        </div> 
      </section>
    </main>
  );
}