"use client";

export default function CinemaLocation({ title }: { title: string }) {
  const encodedTitle = encodeURIComponent(title);
  const mapQuery = encodeURIComponent(`${title} cinemas showing near me`);

  const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const links = [
    {
      name: "Open Full Map",
      desc: "See cinemas near your location",
      url: `https://www.google.com/maps/search/${encodedTitle}+cinemas+showing+near+me`,
    },
    {
      name: "Showtimes",
      desc: "Find available movie times",
      url: `https://www.google.com/search?q=${encodedTitle}+showtimes+near+me`,
    },
    {
      name: "Buy Tickets",
      desc: "Search ticket options",
      url: `https://www.google.com/search?q=${encodedTitle}+movie+tickets+near+me`,
    },
  ];

  return (
    <section className="mt-14 overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-white/[0.04] shadow-[0_0_50px_rgba(250,204,21,0.08)]">
      <div className="p-6">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Local Cinema Map
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Cinemas Showing This Movie
        </h2>

        <p className="mt-2 max-w-2xl text-white/55">
          Search cinemas, showtimes, and ticket options near you for{" "}
          <span className="font-bold text-white">{title}</span>.
        </p>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden border-y border-white/10 bg-black">
        <iframe
          title={`${title} cinema map`}
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <p className="text-sm text-white/45 group-hover:text-black/60">
              {item.desc}
            </p>

            <h3 className="mt-2 text-xl font-black">{item.name}</h3>

            <p className="mt-4 text-sm font-bold text-yellow-300 group-hover:text-black">
              Open →
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}