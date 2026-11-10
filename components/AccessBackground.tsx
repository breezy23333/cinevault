import artwork from "@/lib/accessArtwork.json";

export default function AccessBackground({
  variant,
}: {
  variant: "backdrop" | "posters";
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#08090b]"
    >
      {variant === "backdrop" ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${artwork.backdrop}")`,
            }}
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/90 via-[#08090b]/55 to-[#08090b]/40" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-[#08090b]/30" />
        </>
      ) : (
        <>
          <div className="absolute -inset-x-16 -top-24 grid -rotate-12 grid-cols-4 gap-4 opacity-60 sm:grid-cols-6 lg:grid-cols-8">
            {[...artwork.posters, ...artwork.posters].map(
              (poster, index) => (
                <div
                  key={`${index}-${poster}`}
                  className={`aspect-[2/3] rounded-xl bg-cover bg-center shadow-2xl ${
                    index % 2 ? "translate-y-16" : ""
                  }`}
                  style={{
                    backgroundImage: `url("${poster}")`,
                  }}
                />
              )
            )}
          </div>

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/85 via-[#08090b]/60 to-[#08090b]/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/30 to-transparent" />
        </>
      )}
    </div>
  );
}