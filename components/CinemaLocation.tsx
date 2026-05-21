"use client";

export default function CinemaLocation({ title }: { title: string }) {
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "Cinemas Near Me",
      desc: "Find nearby theaters using your location",
      url: `https://www.google.com/search?q=${encodedTitle}+cinemas+near+me`,
    },
    {
      name: "Google Maps",
      desc: "Open cinema search on maps",
      url: `https://www.google.com/maps/search/${encodedTitle}+cinema+near+me`,
    },
    {
      name: "Showtimes",
      desc: "Search available movie times",
      url: `https://www.google.com/search?q=${encodedTitle}+showtimes+near+me`,
    },
  ];

  return (
    <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
        Local Cinema Finder
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Cinema & Location
      </h2>

      <p className="mt-2 max-w-2xl text-white/55">
        Find nearby cinemas, locations, and showtimes for{" "}
        <span className="font-bold text-white">{title}</span>.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-yellow-400 hover:text-black"
          >
            <p className="text-sm text-white/45 group-hover:text-black/60">
              {item.desc}
            </p>

            <h3 className="mt-2 text-xl font-black">
              {item.name}
            </h3>

            <p className="mt-4 text-sm font-bold text-yellow-300 group-hover:text-black">
              Open →
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}