
type MovieGuide = {
  introduction: string;
  perspective: string;
  bestFor: string;
  question: string;
  sourceName: string;
  sourceUrl: string;
};

const GUIDES: Record<number, MovieGuide> = {
  687163: {
    introduction:
      "Project Hail Mary takes a familiar science-fiction premise and turns it into a mystery about knowledge, memory and cooperation. Its central character is not a trained space explorer but a science teacher confronted with an extraordinary responsibility.",

    perspective:
      "Watch how the story turns scientific problem-solving into drama. The questions are not only whether Ryland Grace can find answers, but how he learns to understand an unfamiliar situation and work with someone very different from himself.",

    bestFor:
      "Viewers who enjoy science-driven mysteries, space adventures, unconventional friendships and stories built around discovery rather than constant action.",

    question:
      "When facing an impossible problem, what matters more: technical knowledge, creativity or the ability to trust someone else?",

    sourceName: "Official film synopsis",
    sourceUrl:
      "https://projecthailmarymovie.co.nz/synopsis/",
  },

  407806: {
    introduction:
      "Ava DuVernay's documentary 13th examines a difficult question in American history: how can legal freedom coexist with systems that perpetuate unequal treatment? The film approaches that question through constitutional history, incarceration and political language.",

    perspective:
      "Pay attention to how archival material, interviews and historical chronology are assembled to support the documentary's argument. The film connects events across different periods, inviting viewers to consider both those connections and the evidence behind them.",

    bestFor:
      "Viewers interested in American history, constitutional law, civil rights, documentary filmmaking and how public policy is represented through images and language.",

    question:
      "Which historical connections presented in the documentary are most persuasive, and which would benefit from further independent research?",

    sourceName: "Netflix film information",
    sourceUrl:
      "https://media.netflix.com/en/only-on-netflix/80091741",
  },

  
  // THE WOMAN IN GREEN (1945)
  34327: {
    introduction:
      "The Woman in Green brings Sherlock Holmes and Dr. Watson into a troubling murder investigation in 1940s London. Starring Basil Rathbone and Nigel Bruce, the film combines classic detective work with psychological manipulation, suspicion and a growing sense of danger.",

    perspective:
      "Watch how the film uses conversation, misleading appearances and carefully revealed clues to build its mystery. Pay attention to the contrast between Holmes' analytical approach and the uncertainties faced by the people around him. Its black-and-white presentation also helps create an atmosphere of suspense.",

    bestFor:
      "Viewers who enjoy classic detective stories, Sherlock Holmes adaptations, vintage mysteries and suspenseful black-and-white cinema. It is particularly interesting for audiences curious about how older films created tension without modern visual effects.",

    question:
      "How does Sherlock Holmes distinguish between what people appear to believe and what the available evidence actually suggests?",

    sourceName: "Sherlock Holmes film information",
    sourceUrl:
      "https://sherlockholmes.com/blogs/sherlock-holmes-movies/the-woman-in-green-1945",
  },

  // REVENGER (2018)
  557968: {
    introduction:
      "Revenger follows a former investigator who enters a dangerous island prison while seeking justice for the murder of his family. The South Korean action film combines a revenge-driven story with martial arts combat and a harsh environment where survival is never guaranteed.",

    perspective:
      "Watch how physical movement, fighting distance and the surrounding environment shape the action sequences. Rather than relying entirely on complicated storytelling, the film makes combat choreography an important part of how characters establish power, confront danger and express determination.",

    bestFor:
      "Viewers who enjoy Korean action cinema, martial arts choreography, survival stories and intense revenge thrillers. The film contains strong violence and is better suited to audiences comfortable with brutal action.",

    question:
      "When a character is driven by revenge, how does that motivation influence the choices they make and the risks they are willing to accept?",

    sourceName: "Netflix official film information",
    sourceUrl:
      "https://www.netflix.com/title/81000511",
  },
};

export default function MovieEditorialGuide({
  id,
  title,
  runtimeMinutes,
  genres = [],
  releaseDate,
  country = "US",
  availableOptions = [],
}: {
  id: number;
  title: string;
  runtimeMinutes?: number | null;
  genres?: string[];
  releaseDate?: string | null;
  country?: string;
  availableOptions?: string[];
}) {
  const guide = GUIDES[id];

  if (!guide) {
    const runtime =
      typeof runtimeMinutes === "number" && runtimeMinutes > 0
        ? Math.round(runtimeMinutes)
        : null;

    const genreNames = [...new Set(genres.filter(Boolean))];
    const options = [...new Set(availableOptions.filter(Boolean))];
    const year = releaseDate?.slice(0, 4);

    return (
      <section
        aria-labelledby={`movie-guide-${id}`}
        className="mx-auto max-w-7xl px-4 py-12 md:px-6"
      >
        <div className="border border-yellow-400/20 bg-[#101722] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            CINRYVAN WATCHING GUIDE
          </p>

          <h2
            id={`movie-guide-${id}`}
            className="mt-3 text-2xl font-black text-white sm:text-4xl"
          >
            Before You Watch {title}
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="border border-white/10 bg-[#0b1019] p-5">
              <h3 className="text-lg font-black text-yellow-400">
                Plan your viewing time
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/70">
                {runtime
                  ? `${title} has a listed runtime of ${runtime} minutes. Allow extra time for breaks, advertisements or previews.`
                  : `A confirmed runtime for ${title} is not available in our current data. Check the provider's listing before planning your viewing time.`}
              </p>
            </article>

            <article className="border border-white/10 bg-[#0b1019] p-5">
              <h3 className="text-lg font-black text-yellow-400">
                Check your watch options
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/70">
                {options.length > 0
                  ? `Our current provider data lists ${options.join(", ")} options for ${title} in ${country}. Follow the provider links below to confirm availability, price and language options.`
                  : `Our current data does not list a watch option for ${title} in ${country}. This does not prove the film is unavailable; check your local providers directly.`}
              </p>

              <a
                href="#watch"
                className="mt-4 inline-block text-sm font-bold text-yellow-400 hover:underline"
              >
                View watch options ↓
              </a>
            </article>
          </div>

          {(genreNames.length > 0 || year) && (
            <p className="mt-5 text-sm leading-7 text-white/70">
              {[
                year ? `Listed release year: ${year}.` : "",
                genreNames.length
                  ? `Genres: ${genreNames.join(", ")}.`
                  : "",
                "For age suitability, check the classification and content advice in your country.",
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          )}

          <p className="mt-6 text-xs leading-6 text-white/45">
            Based on catalogue and provider information, not an editorial
            review. Availability can change.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="movie-editorial-title"
      className="mx-auto max-w-7xl px-4 py-12 md:px-6"
    >
      <div className="border border-yellow-400/20 bg-[#101722] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          CINRYVAN VIEWING GUIDE
        </p>

        <h2
          id="movie-editorial-title"
          className="mt-3 text-2xl font-black text-white sm:text-4xl"
        >
          Before You Watch {title}
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-8 text-white/75">
          {guide.introduction}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="border border-white/10 bg-[#0b1019] p-5">
            <h3 className="text-lg font-black text-yellow-400">
              What to Watch For
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {guide.perspective}
            </p>
          </article>

          <article className="border border-white/10 bg-[#0b1019] p-5">
            <h3 className="text-lg font-black text-yellow-400">
              Who Might Enjoy This?
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {guide.bestFor}
            </p>
          </article>
        </div>

        <div className="mt-5 border-l-4 border-yellow-400 bg-yellow-400/[0.06] p-5">
          <h3 className="text-lg font-black text-white">
            A Question Worth Thinking About
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            {guide.question}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/45">
            CINRYVAN editorial viewing notes
          </p>

          <a
            href={guide.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-yellow-400 hover:underline"
          >
            Reference: {guide.sourceName} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
