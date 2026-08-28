import {
  ArrowUpRight,
  BookOpen,
  Mic,
  Search,
  SpellCheck,
} from "lucide-react";

const features = [
  {
    icon: Search,
    label: "Describe it",
    text: "Explain the meaning when you cannot remember the word.",
  },
  {
    icon: Mic,
    label: "Say it",
    text: "Use your voice to search for and discover the correct word.",
  },
  {
    icon: SpellCheck,
    label: "Spell it",
    text: "See the correct spelling, pronunciation, definition and usage.",
  },
];

export default function LexryspellSpotlight() {
  return (
    <section className="relative overflow-hidden border border-[#65c59b]/25 bg-[#0b1714]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#65c59b]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-yellow-400/[0.06] blur-3xl" />

      <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-9">
          <div>
            <div className="inline-flex items-center gap-2 text-[#76d3ac]">
              <BookOpen className="h-4 w-4" />

              <p className="text-[10px] font-black uppercase tracking-[0.32em]">
                More from Luvo Maphela
              </p>
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
              Can’t remember the word?
              <span className="mt-2 block text-[#76d3ac]">
                Lexryspell can find it.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Lexryspell is a word-discovery and spelling tool. Describe the
              word you are thinking of, choose its first letter or say it
              aloud—then learn its spelling, pronunciation, definition and
              usage.
            </p>
          </div>

          <a
            href="https://lexryspell.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex w-fit items-center gap-2 bg-[#76d3ac] px-5 py-3 text-sm font-black text-[#082019] transition hover:bg-white"
          >
            Try Lexryspell
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <a
                key={feature.label}
                href="https://lexryspell.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[145px] gap-4 bg-[#0d1d19] p-5 transition hover:bg-[#132a23] sm:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#76d3ac]/30 bg-[#76d3ac]/10 text-[#76d3ac] transition group-hover:bg-[#76d3ac] group-hover:text-[#082019]">
                  <Icon className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/30">
                    0{index + 1}
                  </p>

                  <h3 className="mt-1 text-lg font-black text-white group-hover:text-[#76d3ac]">
                    {feature.label}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/50">
                    {feature.text}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}