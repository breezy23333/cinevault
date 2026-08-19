import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type GenreTheme = {
  accent: string;
  glow: string;
  eyebrow: string;
  statement: string;
  description: string;
};

const DEFAULT_THEME: GenreTheme = {
  accent: "#facc15",
  glow: "rgba(250,204,21,.24)",
  eyebrow: "A CINRYVAN Collection",
  statement: "Find stories that stay with you.",
  description:
    "Explore films, series and animated worlds connected by one unforgettable genre.",
};

const GENRE_THEMES: Record<string, GenreTheme> = {
  action: {
    accent: "#fb923c",
    glow: "rgba(249,115,22,.28)",
    eyebrow: "Adrenaline · Conflict · Spectacle",
    statement: "No hesitation. No looking back.",
    description: "Enter explosive stories driven by danger, courage and impossible odds.",
  },
  adventure: {
    accent: "#34d399",
    glow: "rgba(16,185,129,.25)",
    eyebrow: "Journeys · Discovery · Wonder",
    statement: "The unknown is calling.",
    description: "Cross new frontiers, uncover lost worlds and follow heroes beyond the map.",
  },
  animation: {
    accent: "#22d3ee",
    glow: "rgba(6,182,212,.26)",
    eyebrow: "Imagination · Art · Motion",
    statement: "Nothing is impossible here.",
    description: "Discover hand-drawn dreams, digital worlds and stories without visual limits.",
  },
  comedy: {
    accent: "#fde047",
    glow: "rgba(250,204,21,.26)",
    eyebrow: "Chaos · Timing · Laughter",
    statement: "Some stories are better with a laugh.",
    description: "Find sharp satire, wild situations and characters who make everything funnier.",
  },
  crime: {
    accent: "#94a3b8",
    glow: "rgba(100,116,139,.27)",
    eyebrow: "Mystery · Power · Consequence",
    statement: "Every choice leaves evidence.",
    description: "Follow investigations, criminal empires and the people caught between them.",
  },
  documentary: {
    accent: "#60a5fa",
    glow: "rgba(59,130,246,.24)",
    eyebrow: "Truth · People · Perspective",
    statement: "The real world has stories too.",
    description: "Explore remarkable people, urgent questions and events that shaped our world.",
  },
  drama: {
    accent: "#c084fc",
    glow: "rgba(168,85,247,.25)",
    eyebrow: "Emotion · Choice · Humanity",
    statement: "The quietest moments can change everything.",
    description: "Experience powerful characters, difficult choices and stories that feel deeply human.",
  },
  family: {
    accent: "#2dd4bf",
    glow: "rgba(20,184,166,.25)",
    eyebrow: "Together · Wonder · Heart",
    statement: "Stories made to be shared.",
    description: "Find adventures, laughter and meaningful moments for viewers of every generation.",
  },
  fantasy: {
    accent: "#a78bfa",
    glow: "rgba(139,92,246,.28)",
    eyebrow: "Magic · Myth · Destiny",
    statement: "Reality is only the beginning.",
    description: "Enter enchanted kingdoms, ancient legends and worlds shaped by imagination.",
  },
  history: {
    accent: "#d6a96c",
    glow: "rgba(180,120,60,.25)",
    eyebrow: "Legacy · Conflict · Change",
    statement: "The past is never truly gone.",
    description: "Return to defining eras, extraordinary lives and moments that changed everything.",
  },
  horror: {
    accent: "#ef4444",
    glow: "rgba(220,38,38,.29)",
    eyebrow: "Fear · Survival · The Unknown",
    statement: "Some doors should remain closed.",
    description: "Face supernatural forces, human nightmares and the things waiting in the dark.",
  },
  music: {
    accent: "#f472b6",
    glow: "rgba(236,72,153,.26)",
    eyebrow: "Rhythm · Voice · Culture",
    statement: "Every life has a soundtrack.",
    description: "Discover artists, performances and stories powered by music.",
  },
  mystery: {
    accent: "#818cf8",
    glow: "rgba(99,102,241,.27)",
    eyebrow: "Secrets · Clues · Revelation",
    statement: "Nothing is exactly what it seems.",
    description: "Follow hidden motives, unanswered questions and clues that refuse to stay buried.",
  },
  romance: {
    accent: "#fb7185",
    glow: "rgba(244,63,94,.26)",
    eyebrow: "Connection · Longing · Choice",
    statement: "Two lives. One impossible feeling.",
    description: "Explore love stories shaped by timing, distance, hope and second chances.",
  },
  "science-fiction": {
    accent: "#38bdf8",
    glow: "rgba(14,165,233,.28)",
    eyebrow: "Future · Technology · Possibility",
    statement: "Tomorrow is already watching.",
    description: "Travel beyond Earth, challenge reality and imagine the futures waiting ahead.",
  },
  thriller: {
    accent: "#f59e0b",
    glow: "rgba(245,158,11,.25)",
    eyebrow: "Tension · Danger · Deception",
    statement: "Trust no one. Miss nothing.",
    description: "Enter relentless stories where every secret raises the stakes.",
  },
  war: {
    accent: "#a3a3a3",
    glow: "rgba(115,115,115,.26)",
    eyebrow: "Conflict · Courage · Survival",
    statement: "History remembers the cost.",
    description: "Witness conflict through the people, choices and sacrifices at its centre.",
  },
  western: {
    accent: "#f59e0b",
    glow: "rgba(217,119,6,.27)",
    eyebrow: "Frontier · Justice · Freedom",
    statement: "Out here, legends write their own rules.",
    description: "Ride into untamed frontiers shaped by survival, justice and myth.",
  },
};

const EXPLORE_LINKS = [
  { number: "01", label: "Search Titles", text: "Search the full CINRYVAN catalogue.", href: "/search" },
  { number: "02", label: "Trending", text: "See what audiences are exploring now.", href: "/trending" },
  { number: "03", label: "Top Rated", text: "Discover acclaimed films and series.", href: "/top" },
  { number: "04", label: "Upcoming", text: "Look ahead to the next major releases.", href: "/upcoming" },
  { number: "05", label: "Anime", text: "Enter Japanese animated worlds.", href: "/anime" },
  { number: "06", label: "Cartoons", text: "Explore animation across generations.", href: "/cartoons" },
  { number: "07", label: "News", text: "Follow stories across entertainment.", href: "/news" },
  { number: "08", label: "Community", text: "Continue the conversation with fans.", href: "/community" },
];

const POPULAR_GENRES = [
  "action",
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
];

function formatGenre(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getTheme(slug: string) {
  return GENRE_THEMES[slug] ?? DEFAULT_THEME;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = formatGenre(slug);

  return {
    title: `${name} Movies & Shows | CINRYVAN`,
    description: `Explore ${name} movies, television, animation and entertainment picks on CINRYVAN.`,
    alternates: { canonical: `/genre/${slug}` },
    openGraph: {
      title: `${name} Movies & Shows | CINRYVAN`,
      description: `Discover ${name} movies, shows, animation and entertainment content.`,
      url: `/genre/${slug}`,
      siteName: "CINRYVAN",
      images: ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Movies & Shows | CINRYVAN`,
      description: `Explore ${name} movies, television and animation.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;
  const genreName = formatGenre(slug);
  const theme = getTheme(slug);
  const themeStyle = {
    "--genre-accent": theme.accent,
    "--genre-glow": theme.glow,
  } as CSSProperties;

  const genreJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genreName} Movies & Shows`,
    description: `Explore ${genreName} movies, television, animation and entertainment content on CINRYVAN.`,
    url: `https://cinryvan.vercel.app/genre/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "CINRYVAN",
      url: "https://cinryvan.vercel.app",
    },
  };

  return (
    <main
      style={themeStyle}
      className="min-h-screen overflow-hidden bg-[#080b12] pb-24 pt-28 text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(genreJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative min-h-[600px] overflow-hidden border border-white/10 bg-[#0d131d]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,var(--genre-glow),transparent_26%),radial-gradient(circle_at_92%_90%,var(--genre-glow),transparent_30%),linear-gradient(120deg,#101722_10%,#0c111a_62%,#080b12_100%)]" />
          <div className="absolute -right-28 top-8 h-[500px] w-[500px] rounded-full border border-white/10" />
          <div className="absolute right-2 top-28 h-[330px] w-[330px] rounded-full border border-white/[0.07]" />
          <div className="absolute right-40 top-64 h-3 w-3 rounded-full bg-[var(--genre-accent)] shadow-[0_0_36px_10px_var(--genre-glow)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080b12] to-transparent" />

          <div className="relative z-10 flex min-h-[600px] flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--genre-accent)]">
                CINRYVAN Genres
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                {theme.eyebrow}
              </p>
            </div>

            <div className="max-w-5xl py-14">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.26em] text-white/40">
                {theme.statement}
              </p>
              <h1 className="break-words text-6xl font-black leading-[.87] tracking-[-0.06em] sm:text-8xl lg:text-[112px]">
                {genreName}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                {theme.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/search?genre=${slug}`}
                className="inline-flex items-center bg-[var(--genre-accent)] px-6 py-3.5 text-sm font-black text-[#080b12] transition hover:brightness-110"
              >
                Browse {genreName} <span className="ml-2">→</span>
              </Link>
              <Link
                href="/trending"
                className="inline-flex items-center border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black transition hover:border-[var(--genre-accent)] hover:text-[var(--genre-accent)]"
              >
                Trending now
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mb-7 border-b border-white/10 pb-5">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--genre-accent)]">
              Continue exploring
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Find your path through {genreName}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative min-h-48 overflow-hidden border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--genre-accent)] hover:bg-white/[0.055]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[10px] font-black tracking-[0.24em] text-[var(--genre-accent)]">
                    {item.number}
                  </span>
                  <span className="grid h-8 w-8 place-items-center border border-white/10 text-white/50 transition group-hover:border-[var(--genre-accent)] group-hover:bg-[var(--genre-accent)] group-hover:text-[#080b12]">
                    ↗
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-black transition group-hover:text-[var(--genre-accent)]">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{item.text}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--genre-accent)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--genre-accent)]">
                Switch genre
              </p>
              <h2 className="mt-1 text-xl font-black">Explore another world</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.filter((genre) => genre !== slug).map((genre) => (
                <Link
                  key={genre}
                  href={`/genre/${genre}`}
                  className="border border-white/10 bg-black/20 px-3.5 py-2 text-xs font-bold text-white/55 transition hover:border-[var(--genre-accent)] hover:text-[var(--genre-accent)]"
                >
                  {formatGenre(genre)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}