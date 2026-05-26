"use client";

import Link from "next/link";

const franchises = [
  { name: "Marvel", icon: "/franchises/marvel.png" },
  { name: "DC", icon: "/franchises/dc.png" },
  { name: "Star Wars", icon: "/franchises/star-wars.png" },
  { name: "Fast and Furious", icon: "/franchises/fast-and-furious.png" },
  { name: "Harry Potter", icon: "/franchises/harry-potter.png" },
  { name: "Lord of the Rings", icon: "/franchises/lord-of-the-rings.png" },
  { name: "The Hobbit", icon: "/franchises/the-hobbit.png" },
  { name: "Jurassic Park", icon: "/franchises/jurassic-park.png" },
  { name: "Jurassic World", icon: "/franchises/jurassic-world.png" },
  { name: "Transformers", icon: "/franchises/transformers.png" },
  { name: "Mission Impossible", icon: "/franchises/mission-impossible.png" },
  { name: "Pirates of the Caribbean", icon: "/franchises/pirates-of-the-caribbean.png" },
  { name: "James Bond", icon: "/franchises/james-bond.png" },
  { name: "John Wick", icon: "/franchises/john-wick.png" },
  { name: "The Matrix", icon: "/franchises/the-matrix.png" },
  { name: "Avatar", icon: "/franchises/avatar.png" },
  { name: "Alien", icon: "/franchises/alien.png" },
  { name: "Predator", icon: "/franchises/predator.png" },
  { name: "Terminator", icon: "/franchises/terminator.png" },
  { name: "Indiana Jones", icon: "/franchises/indiana-jones.png" },
  { name: "Rocky", icon: "/franchises/rocky.png" },
  { name: "Creed", icon: "/franchises/creed.png" },
  { name: "Godzilla", icon: "/franchises/godzilla.png" },
  { name: "King Kong", icon: "/franchises/king-kong.png" },
  { name: "MonsterVerse", icon: "/franchises/monsterverse.png" },
  { name: "Planet of the Apes", icon: "/franchises/planet-of-the-apes.png" },
  { name: "Hunger Games", icon: "/franchises/hunger-games.png" },
  { name: "Twilight", icon: "/franchises/twilight.png" },
  { name: "Divergent", icon: "/franchises/divergent.png" },
  { name: "Maze Runner", icon: "/franchises/maze-runner.png" },
  { name: "Narnia", icon: "/franchises/narnia.png" },
  { name: "Shrek", icon: "/franchises/shrek.png" },
  { name: "Toy Story", icon: "/franchises/toy-story.png" },
  { name: "Frozen", icon: "/franchises/frozen.png" },
  { name: "Cars", icon: "/franchises/cars.png" },
  { name: "Despicable Me", icon: "/franchises/despicable-me.png" },
  { name: "Minions", icon: "/franchises/minions.png" },
  { name: "Kung Fu Panda", icon: "/franchises/kung-fu-panda.png" },
  { name: "How to Train Your Dragon", icon: "/franchises/how-to-train-your-dragon.png" },
  { name: "Spider-Man", icon: "/franchises/spider-man.png" },
  { name: "Batman", icon: "/franchises/batman.png" },
  { name: "Superman", icon: "/franchises/superman.png" },
  { name: "X-Men", icon: "/franchises/x-men.png" },
  { name: "Avengers", icon: "/franchises/avengers.png" },
  { name: "Justice League", icon: "/franchises/justice-league.png" },
  { name: "The Conjuring", icon: "/franchises/the-conjuring.png" },
  { name: "Saw", icon: "/franchises/saw.png" },
  { name: "Scream", icon: "/franchises/scream.png" },
  { name: "Halloween", icon: "/franchises/halloween.png" },
  { name: "Friday the 13th", icon: "/franchises/friday-the-13th.png" },
  { name: "A Nightmare on Elm Street", icon: "/franchises/a-nightmare-on-elm-street.png" },
  { name: "The Purge", icon: "/franchises/the-purge.png" },
  { name: "Insidious", icon: "/franchises/insidious.png" },
  { name: "Final Destination", icon: "/franchises/final-destination.png" },
  { name: "Paranormal Activity", icon: "/franchises/paranormal-activity.png" },
  { name: "Annabelle", icon: "/franchises/annabelle.png" },
  { name: "The Nun", icon: "/franchises/the-nun.png" },
  { name: "It", icon: "/franchises/it.png" },
  { name: "Ghostbusters", icon: "/franchises/ghostbusters.png" },
  { name: "Men in Black", icon: "/franchises/men-in-black.png" },
  { name: "Rambo", icon: "/franchises/rambo.png" },
  { name: "Die Hard", icon: "/franchises/die-hard.png" },
  { name: "Bourne", icon: "/franchises/bourne.png" },
  { name: "The Mummy", icon: "/franchises/the-mummy.png" },
  { name: "Resident Evil", icon: "/franchises/resident-evil.png" },
  { name: "Mortal Kombat", icon: "/franchises/mortal-kombat.png" },
  { name: "Sonic the Hedgehog", icon: "/franchises/sonic-the-hedgehog.png" },
  { name: "The Super Mario Bros", icon: "/franchises/the-super-mario-bros.png" },
  { name: "Pokemon", icon: "/franchises/pokemon.png" },
  { name: "Mad Max", icon: "/franchises/mad-max.png" },
  { name: "Dune", icon: "/franchises/dune.png" },
  { name: "Bad Boys", icon: "/franchises/bad-boys.png" },
  { name: "Deadpool", icon: "/franchises/deadpool.png" },
  { name: "Iron Man", icon: "/franchises/iron-man.png" },
  { name: "Black Panther", icon: "/franchises/black-panther.png" },
  { name: "Doctor Strange", icon: "/franchises/doctor-strange.png" },
  { name: "Guardians of the Galaxy", icon: "/franchises/guardians-of-the-galaxy.png" },
];

export default function FranchiseUniverse() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.15),transparent_35%)]" />

      <div className="relative mb-6">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Cinematic Universes
        </p>

        <h2 className="mt-2 text-3xl font-black md:text-5xl">
          Legendary Franchises
        </h2>

        <p className="mt-3 max-w-3xl text-white/60">
          Explore the biggest movie worlds, sagas, superheroes, fantasy realms,
          animation universes, and horror collections.
        </p>
      </div>

      <div className="relative flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
        {franchises.map((f) => (
          <Link
            key={f.name}
            href={`/search?q=${encodeURIComponent(f.name)}`}
            className="group min-w-[190px] rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/10"
          >
            <div className="mb-4 flex h-20 items-center justify-center rounded-2xl bg-black/50 p-3 ring-1 ring-white/10">
              <img
                src={f.icon}
                alt={f.name}
                className="max-h-12 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <h3 className="line-clamp-2 min-h-[44px] text-lg font-black leading-tight">
              {f.name}
            </h3>

            <p className="mt-2 text-xs text-white/45 group-hover:text-yellow-300">
              Explore universe
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}