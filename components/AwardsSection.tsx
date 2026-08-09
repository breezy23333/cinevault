import type { AwardsData } from "@/lib/awards";

type AwardsSectionProps = {
  awards: AwardsData | null;
  mediaType: "movie" | "tv";
};

export default function AwardsSection({
  awards,
  mediaType,
}: AwardsSectionProps) {
  if (!awards) return null;

  const hasScores =
    awards.imdbRating ||
    awards.imdbVotes ||
    awards.rottenTomatoes ||
    awards.metascore ||
    awards.boxOffice;

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
        CINRYVAN Critics & Awards
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Critics, Ratings & Recognition
      </h2>

      <p className="mt-3 max-w-3xl text-white/60">
        Ratings, critic scores and award information connected to this{" "}
        {mediaType === "tv" ? "series" : "movie"}.
      </p>

      {awards.awards && (
        <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08] p-5">
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              🏆
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                Awards Summary
              </p>

              <p className="mt-2 text-lg font-bold leading-8 text-white">
                {awards.awards}
              </p>
            </div>
          </div>
        </div>
      )}

      {hasScores && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.imdbRating && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                IMDb Rating
              </p>

              <p className="mt-2 text-2xl font-black text-yellow-400">
                ★ {awards.imdbRating}/10
              </p>
            </div>
          )}

          {awards.imdbVotes && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                IMDb Votes
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {awards.imdbVotes}
              </p>
            </div>
          )}

          {awards.rottenTomatoes && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Rotten Tomatoes
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                🍅 {awards.rottenTomatoes}
              </p>
            </div>
          )}

          {awards.metascore && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Metascore
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {awards.metascore}/100
              </p>
            </div>
          )}

          {mediaType === "movie" && awards.boxOffice && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Box Office
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {awards.boxOffice}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-xs text-white/35">
        Ratings and awards information supplied by OMDb.
      </p>
    </section>
  );
}