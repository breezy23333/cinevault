/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGameDetails,
  RAWG_ATTRIBUTION_URL,
} from "@/lib/games";

export const revalidate = 86400;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function cleanRequirement(value?: string) {
  if (!value) return "";

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatReleaseDate(date?: string | null) {
  if (!date) return "Release date unavailable";

  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameDetails(id);

  if (!game) {
    return {
      title: "Game Not Found | CineVault",
      description: "The requested game could not be found.",
    };
  }

  const description =
    game.description_raw?.slice(0, 155) ||
    `Discover ${game.name}, available platforms, ratings and game information on CineVault.`;

  return {
    title: `${game.name} | Game Details | CineVault`,
    description,
    openGraph: {
      title: `${game.name} | CineVault Gaming`,
      description,
      type: "website",
      images: game.background_image
        ? [
            {
              url: game.background_image,
              alt: game.name,
            },
          ]
        : [],
    },
  };
}

export default async function GameDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const game = await getGameDetails(id);

  if (!game) {
    notFound();
  }

  const platforms = game.platforms || [];
  const stores = game.stores || [];

  const pcPlatform = platforms.find(
    (item) => item.platform.slug === "pc"
  );

  const minimumRequirements = cleanRequirement(
    pcPlatform?.requirements?.minimum
  );

  const recommendedRequirements = cleanRequirement(
    pcPlatform?.requirements?.recommended
  );

  const secondaryBackground =
    game.background_image_additional || game.background_image;

  return (
    <main className="min-h-screen bg-[#05070d] pb-24 text-white">
      <section className="relative min-h-[680px] overflow-hidden pt-24">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} background`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#101722]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/75 to-[#05070d]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-[#05070d]/40" />

        <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl items-end px-4 pb-16 md:px-6">
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
            >
              ← Back to CineVault
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/75 backdrop-blur"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
              {game.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span>{formatReleaseDate(game.released)}</span>

              <span className="font-bold text-yellow-400">
                ★ {game.rating ? game.rating.toFixed(1) : "Not rated"}
              </span>

              {game.metacritic !== null &&
                game.metacritic !== undefined && (
                  <span className="rounded-md bg-green-500 px-2.5 py-1 font-black text-black">
                    Metacritic {game.metacritic}
                  </span>
                )}

              {game.esrb_rating?.name && (
                <span className="rounded-md border border-white/15 bg-black/30 px-2.5 py-1">
                  {game.esrb_rating.name}
                </span>
              )}

              {game.playtime > 0 && (
                <span>{game.playtime} hours average playtime</span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Official website ↗
                </a>
              )}

              <a
                href={`https://rawg.io/games/${game.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/15 bg-black/40 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-yellow-400 hover:text-yellow-400"
              >
                View buying options ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.7fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                About the game
              </p>

              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                What is {game.name} about?
              </h2>

              <p className="mt-5 whitespace-pre-line leading-8 text-white/70">
                {game.description_raw ||
                  "A complete description is not currently available."}
              </p>
            </section>

            {secondaryBackground && (
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                <img
                  src={secondaryBackground}
                  alt={`${game.name} gameplay artwork`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video h-full w-full object-cover"
                />
              </section>
            )}

            {(minimumRequirements || recommendedRequirements) && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  PC specifications
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  System requirements
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {minimumRequirements && (
                    <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                      <h3 className="font-black text-white">
                        Minimum
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/60">
                        {minimumRequirements}
                      </p>
                    </div>
                  )}

                  {recommendedRequirements && (
                    <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                      <h3 className="font-black text-white">
                        Recommended
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/60">
                        {recommendedRequirements}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Where to play
              </p>

              <h2 className="mt-2 text-xl font-black">
                Available platforms
              </h2>

              <div className="mt-5 space-y-2">
                {platforms.length > 0 ? (
                  platforms.map((item) => (
                    <div
                      key={item.platform.id}
                      className="rounded-xl bg-black/30 px-4 py-3 text-sm font-semibold text-white/75 ring-1 ring-white/10"
                    >
                      {item.platform.name}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/50">
                    Platform information is unavailable.
                  </p>
                )}
              </div>
            </section>

            {stores.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  Store availability
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Where to buy
                </h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  {stores.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70"
                    >
                      {item.store.name}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://rawg.io/games/${game.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
                >
                  Check current buying options →
                </a>
              </section>
            )}

            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Game information
              </p>

              <InfoRow
                label="Developer"
                value={
                  game.developers?.map((item) => item.name).join(", ") ||
                  "Unknown"
                }
              />

              <InfoRow
                label="Publisher"
                value={
                  game.publishers?.map((item) => item.name).join(", ") ||
                  "Unknown"
                }
              />

              <InfoRow
                label="Released"
                value={formatReleaseDate(game.released)}
              />

              <InfoRow
                label="Genres"
                value={
                  game.genres?.map((genre) => genre.name).join(", ") ||
                  "Unknown"
                }
              />
            </section>

            {game.tags?.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
                <h2 className="text-xl font-black">Tags</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {game.tags.slice(0, 14).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/60"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          Game information and images provided by{" "}
          <a
            href={RAWG_ATTRIBUTION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-yellow-400 hover:text-yellow-300"
          >
            RAWG
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-5 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-bold uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-white/75">
        {value}
      </p>
    </div>
  );
}