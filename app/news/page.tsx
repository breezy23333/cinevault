import type { Metadata } from "next";
import {
  getEntertainmentNews,
  getSportsNews,
  getGamingNews,
} from "@/lib/news";
import type { NewsItem } from "@/components/NewsStrip";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Entertainment News Room – CineVault",
  description:
    "Read live entertainment headlines, celebrity updates, streaming stories, movie news, TV updates, and industry signals on CineVault.",

  openGraph: {
    title: "Entertainment News Room – CineVault",
    description:
      "Live entertainment headlines, celebrity updates, streaming stories, movie news, TV updates, and industry signals.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Entertainment News Room – CineVault",
    description:
      "Live entertainment headlines, celebrity updates, streaming stories, movie news, TV updates, and industry signals.",
  },
};

export default async function NewsPage() {
  const entertainment: NewsItem[] = await getEntertainmentNews();
  const sports: NewsItem[] = await getSportsNews();
  const gaming: NewsItem[] = await getGamingNews();

  const hero = entertainment[0];

  const main = entertainment.slice(1, 7);
  const side = entertainment.slice(7, 12);

  const sportsMain = sports.slice(0, 4);
  const gamingMain = gaming.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-28 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Industry Radar
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black md:text-7xl">News Room</h1>
            <p className="mt-4 max-w-2xl text-white/60">
              Entertainment headlines, celebrity updates, streaming stories,
              and industry signals.
            </p>
          </div>

          <div className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-bold text-yellow-300">
            {entertainment.length + sports.length + gaming.length} Live Stories
          </div>
        </div>

        {hero && (
          <a
            href={hero.url}
            target="_blank"
            className="group mt-10 grid overflow-hidden rounded-[36px] border border-yellow-400/20 bg-white/[0.04] shadow-[0_0_80px_rgba(255,184,0,0.08)] md:grid-cols-[1.4fr_1fr]"
          >
            <div className="relative hidden h-[360px] overflow-hidden bg-white/5 md:block md:h-[460px]">
              {hero.image ? (
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,184,0,0.25),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(90,120,255,0.18),transparent_40%)]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">
                  CineVault Signal
                </p>

                <h3 className="mt-3 max-w-xl text-4xl font-black">
                  Breaking entertainment feed
                </h3>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                Lead Story
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {hero.title}
              </h2>
              {hero.source && (
                <p className="mt-5 text-sm text-white/50">{hero.source}</p>
              )}
              <span className="mt-8 w-fit rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-black">
                Read Story
              </span>
            </div>
          </a>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6 md:grid-cols-2">
            {main.map((item, i) => (
              <a
                key={item.url + i}
                href={item.url}
                target="_blank"
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition hover:border-yellow-400/40 hover:bg-white/[0.06]"
              >
                <div className="relative h-56 bg-white/5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                    Entertainment
                  </p>
                  <h3 className="mt-3 line-clamp-2 text-2xl font-black group-hover:text-yellow-300">
                    {item.title}
                  </h3>
                  {item.source && (
                    <p className="mt-3 text-sm text-white/40">{item.source}</p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Flash Feed
            </p>

            <div className="mt-5 space-y-4">
              {side.map((item, i) => (
                <a
                  key={item.url + i}
                  href={item.url}
                  target="_blank"
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-yellow-400/40"
                >
                  <h4 className="line-clamp-2 font-bold">{item.title}</h4>
                  {item.source && (
                    <p className="mt-2 text-xs text-white/40">{item.source}</p>
                  )}
                </a>
              ))}
            </div>
          </aside>
        </div>

         {/* Sports News */}
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-green-400">
                  Live Sports
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  Sports Headlines
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sportsMain.map((item, i) => (
                <a
                  key={item.url + i}
                  href={item.url}
                  target="_blank"
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition hover:border-green-400/40 hover:bg-white/[0.06]"
                >
                  <div className="relative h-56 bg-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                      Sports
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-black group-hover:text-green-300">
                      {item.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Gaming News */}
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-400">
                  Gaming Signal
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  Gaming Headlines
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {gamingMain.map((item, i) => (
                <a
                  key={item.url + i}
                  href={item.url}
                  target="_blank"
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
                >
                  <div className="relative h-56 bg-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                      Gaming
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-black group-hover:text-cyan-300">
                      {item.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>     

      </section>
    </main>
  );
}