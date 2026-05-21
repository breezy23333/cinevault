"use client";

export default function MovieTickets({ title }: { title: string }) {
  const search = encodeURIComponent(`${title} movie tickets near me`);
  const cinemas = [
    {
      name: "Google Cinemas",
      text: "Find nearby theaters",
      url: `https://www.google.com/search?q=${search}`,
    },
    {
      name: "Fandango",
      text: "Search tickets",
      url: `https://www.fandango.com/search?q=${encodeURIComponent(title)}`,
    },
    {
      name: "IMDb Showtimes",
      text: "Check showtimes",
      url: `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <section className="mt-14 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-white/[0.03] to-black p-6 shadow-[0_0_45px_rgba(250,204,21,0.08)]">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
        Cinema Release
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Tickets & Theaters
      </h2>

      <p className="mt-2 max-w-2xl text-white/55">
        Find theaters and ticket options for{" "}
        <span className="font-bold text-white">{title}</span>.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm text-white/45">Estimated ticket price</p>
          <h3 className="mt-2 text-3xl font-black text-yellow-300">
            $8 – $18
          </h3>
          <p className="mt-2 text-xs text-white/45">
            Prices vary by country, cinema, format, and release status.
          </p>
        </div>

        {cinemas.map((cinema) => (
          <a
            key={cinema.name}
            href={cinema.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <p className="text-sm text-white/45 group-hover:text-black/60">
              {cinema.text}
            </p>
            <h3 className="mt-2 text-xl font-black">{cinema.name}</h3>
            <p className="mt-4 text-sm font-bold text-yellow-300 group-hover:text-black">
              Open →
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}