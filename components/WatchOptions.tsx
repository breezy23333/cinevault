"use client";

import Image from "next/image";

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
};

type WatchData = {
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

function ProviderRow({
  title,
  providers,
}: {
  title: string;
  providers?: Provider[];
}) {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-black text-white">{title}</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/[0.08]"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white">
              {provider.logo_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={56}
                  height={56}
                />
              ) : (
                <span className="text-black">▶</span>
              )}
            </div>

            <h4 className="font-black text-white">{provider.provider_name}</h4>

            <p className="mt-2 text-sm text-white/50">
              Available provider
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WatchOptions({
  title,
  watchData,
  country = "ZA",
}: {
  title: string;
  watchData?: WatchData | null;
  country?: string;
}) {
  const hasProviders =
    watchData?.flatrate?.length ||
    watchData?.rent?.length ||
    watchData?.buy?.length;

  return (
    <section id="watch-section" className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Streaming Access
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Where to watch
        </h2>

        <p className="mt-2 max-w-2xl text-white/55">
          Availability for <span className="text-white">{title}</span> in{" "}
          <span className="text-yellow-400">{country}</span>.
        </p>
      </div>

      {hasProviders ? (
        <>
          <ProviderRow title="Stream" providers={watchData?.flatrate} />
          <ProviderRow title="Rent" providers={watchData?.rent} />
          <ProviderRow title="Buy" providers={watchData?.buy} />
        </>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-black text-white">
            Not currently listed for streaming in {country}.
          </h3>

          <p className="mt-2 text-white/55">
            You can still search manually on YouTube or Google.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-yellow-400 px-5 py-2 font-black text-black"
            >
              Search YouTube →
            </a>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(title + " where to watch")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-5 py-2 font-black text-white hover:bg-white/10"
            >
              Search Google →
            </a>
          </div>
        </div>
      )}
    </section>
  );
}