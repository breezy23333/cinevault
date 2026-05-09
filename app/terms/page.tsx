export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] px-6 py-28 text-white">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          CineVault
        </p>

        <h1 className="mt-3 text-4xl font-black">Terms of Use</h1>

        <div className="mt-8 space-y-5 text-white/70">
          <p>
            CineVault is an entertainment discovery platform that helps users explore movies,
            TV shows, trailers, and related entertainment information.
          </p>

          <p>
            CineVault does not host or stream copyrighted movies or TV shows directly. Any
            trailers, images, ratings, or metadata belong to their respective owners.
          </p>

          <p>
            By using CineVault, you agree to use the platform for personal, lawful, and
            informational purposes only.
          </p>

          <p>
            We may update these terms as the platform grows.
          </p>
        </div>
      </section>
    </main>
  );
}