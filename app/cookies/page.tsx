export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] px-6 py-28 text-white">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          CineVault
        </p>

        <h1 className="mt-3 text-4xl font-black">Cookie Policy</h1>

        <div className="mt-8 space-y-5 text-white/70">
          <p>
            CineVault may use cookies or local browser storage to improve the user experience,
            remember preferences, and support basic site functionality.
          </p>

          <p>
            We may also use third-party services for movie data, images, trailers, analytics,
            or embedded content. These services may use their own cookies.
          </p>

          <p>
            You can disable cookies in your browser settings, but some features may not work
            correctly.
          </p>

          <p>
            This policy may be updated as CineVault grows.
          </p>
        </div>
      </section>
    </main>
  );
}