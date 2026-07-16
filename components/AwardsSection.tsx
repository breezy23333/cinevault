import {
  awardsDatabase,
  type AwardsMediaType,
} from "@/lib/awards";

type AwardsSectionProps = {
  titleId: number;
  mediaType: AwardsMediaType;
};

export default function AwardsSection({
  titleId,
  mediaType,
}: AwardsSectionProps) {
  const awards = awardsDatabase[mediaType]?.[titleId] || [];

  if (awards.length === 0) return null;

  const wins = awards.filter((award) => award.result === "Won").length;
  const nominations = awards.filter(
    (award) => award.result === "Nominated"
  ).length;

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
        CineVault Awards
      </p>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">
            Awards & Recognition
          </h2>

          <p className="mt-2 text-white/60">
            Major awards, wins and nominations connected to this{" "}
            {mediaType === "tv" ? "series" : "movie"}.
          </p>
        </div>

        <div className="flex gap-3">
          {wins > 0 && (
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-center">
              <p className="text-2xl font-black text-yellow-400">{wins}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                Wins
              </p>
            </div>
          )}

          {nominations > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center">
              <p className="text-2xl font-black text-white">{nominations}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                Nominations
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {awards.map((award, index) => {
          const won = award.result === "Won";

          return (
            <article
              key={`${award.award}-${award.category}-${award.year}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                    {award.award}
                  </p>

                  <h3 className="mt-2 font-bold leading-snug text-white">
                    {award.category}
                  </h3>
                </div>

                <span
                  className={
                    won
                      ? "shrink-0 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black"
                      : "shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70"
                  }
                >
                  {won ? "🏆 Won" : "Nominated"}
                </span>
              </div>

              <p className="mt-3 text-sm text-white/45">{award.year}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}