"use client";

export default function CinemaLocation({ title }: { title: string }) {
  const mapQuery = encodeURIComponent("cinemas near me");
  const showtimesQuery = encodeURIComponent(`${title} showtimes near me`);
  const ticketsQuery = encodeURIComponent(`${title} movie tickets near me`);
  const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const links = [
    {
      name: "Find Cinemas",
      desc: "Search nearby cinema locations",
      url: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
    {
      name: "Search Showtimes",
      desc: "Check external listings for this title",
      url: `https://www.google.com/search?q=${showtimesQuery}`,
    },
    {
      name: "Search Tickets",
      desc: "Check whether tickets are available",
      url: `https://www.google.com/search?q=${ticketsQuery}`,
    },
  ];

  return (
    <section className="mt-14 overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-white/[0.04] shadow-[0_0_50px_rgba(250,204,21,0.08)]">
      <div className="p-6">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Local Cinema Search
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">Find nearby cinemas</h2>
        <p className="mt-2 max-w-2xl text-white/55">
          This map searches for cinema locations. It does not confirm that they are showing{" "}
          <span className="font-bold text-white">{title}</span>.
          {" "}Check the cinema&apos;s own listings before travelling.
        </p>
      </div>
      <div className="relative h-[420px] w-full overflow-hidden border-y border-white/10 bg-black">
        <iframe
          title="Search for nearby cinema locations"
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-3">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-black/40 p-5 text-white transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <p className="text-sm text-white/45 group-hover:text-black/60">{item.desc}</p>
            <h3 className="mt-2 text-xl font-black">{item.name}</h3>
            <p className="mt-4 text-sm font-bold text-yellow-300 group-hover:text-black">Search ↗</p>
          </a>
        ))}
      </div>
    </section>
  );
}
