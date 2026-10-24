
export const OSCAR_BEST_PICTURE = [
  1054867, // One Battle After Another
  1064213, // Anora
  872585,  // Oppenheimer
  545611,  // Everything Everywhere All at Once
  776503,  // CODA
  496243,  // Parasite
  376867,  // Moonlight
  314365,  // Spotlight
  120467,  // Birdman
  76203,   // 12 Years a Slave
  77338,   // The Artist
  49026,   // The King's Speech
];

export type OscarGroup =
  | "Headliners"
  | "Animation & International"
  | "Writing & Music"
  | "Cinematic Craft"
  | "Documentaries & Shorts";

export type OscarAward = {
  category: string;
  group: OscarGroup;
  winner: string;
  film: string;
  movieId?: number;
  nominees: string[];
};

export const OSCAR_GROUPS: OscarGroup[] = [
  "Headliners",
  "Animation & International",
  "Writing & Music",
  "Cinematic Craft",
  "Documentaries & Shorts",
];

export const OSCAR_2026: OscarAward[] = [
  {
    category: "Best Picture",
    group: "Headliners",
    winner: "One Battle After Another",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "Bugonia", "F1", "Frankenstein", "Hamnet",
      "Marty Supreme", "The Secret Agent",
      "Sentimental Value", "Sinners", "Train Dreams",
    ],
  },
  {
    category: "Best Director",
    group: "Headliners",
    winner: "Paul Thomas Anderson",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "Chloé Zhao — Hamnet",
      "Josh Safdie — Marty Supreme",
      "Joachim Trier — Sentimental Value",
      "Ryan Coogler — Sinners",
    ],
  },
  {
    category: "Best Actor",
    group: "Headliners",
    winner: "Michael B. Jordan",
    film: "Sinners",
    movieId: 1233413,
    nominees: [
      "Timothée Chalamet — Marty Supreme",
      "Leonardo DiCaprio — One Battle After Another",
      "Ethan Hawke — Blue Moon",
      "Wagner Moura — The Secret Agent",
    ],
  },
  {
    category: "Best Actress",
    group: "Headliners",
    winner: "Jessie Buckley",
    film: "Hamnet",
    movieId: 858024,
    nominees: [
      "Rose Byrne — If I Had Legs I'd Kick You",
      "Kate Hudson — Song Sung Blue",
      "Renate Reinsve — Sentimental Value",
      "Emma Stone — Bugonia",
    ],
  },
  {
    category: "Best Supporting Actor",
    group: "Headliners",
    winner: "Sean Penn",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "Benicio Del Toro — One Battle After Another",
      "Jacob Elordi — Frankenstein",
      "Delroy Lindo — Sinners",
      "Stellan Skarsgård — Sentimental Value",
    ],
  },
  {
    category: "Best Supporting Actress",
    group: "Headliners",
    winner: "Amy Madigan",
    film: "Weapons",
    movieId: 1078605,
    nominees: [
      "Elle Fanning — Sentimental Value",
      "Inga Ibsdotter Lilleaas — Sentimental Value",
      "Wunmi Mosaku — Sinners",
      "Teyana Taylor — One Battle After Another",
    ],
  },
  {
    category: "Best Animated Feature",
    group: "Animation & International",
    winner: "KPop Demon Hunters",
    film: "KPop Demon Hunters",
    movieId: 803796,
    nominees: [
      "Arco", "Elio",
      "Little Amélie or the Character of Rain",
      "Zootopia 2",
    ],
  },
  {
    category: "Best International Feature",
    group: "Animation & International",
    winner: "Sentimental Value",
    film: "Sentimental Value (Norway)",
    movieId: 1124566,
    nominees: [
      "The Secret Agent — Brazil",
      "It Was Just an Accident — France",
      "Sirāt — Spain",
      "The Voice of Hind Rajab — Tunisia",
    ],
  },
  {
    category: "Best Original Screenplay",
    group: "Writing & Music",
    winner: "Ryan Coogler",
    film: "Sinners",
    movieId: 1233413,
    nominees: [
      "Blue Moon",
      "It Was Just an Accident",
      "Marty Supreme",
      "Sentimental Value",
    ],
  },
  {
    category: "Best Adapted Screenplay",
    group: "Writing & Music",
    winner: "Paul Thomas Anderson",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "Bugonia", "Frankenstein", "Hamnet", "Train Dreams",
    ],
  },
  {
    category: "Best Original Score",
    group: "Writing & Music",
    winner: "Ludwig Göransson",
    film: "Sinners",
    movieId: 1233413,
    nominees: [
      "Bugonia", "Frankenstein", "Hamnet",
      "One Battle After Another",
    ],
  },
  {
    category: "Best Original Song",
    group: "Writing & Music",
    winner: "Golden",
    film: "KPop Demon Hunters",
    movieId: 803796,
    nominees: [
      "Dear Me — Diane Warren: Relentless",
      "I Lied to You — Sinners",
      "Sweet Dreams of Joy — Viva Verdi!",
      "Train Dreams — Train Dreams",
    ],
  },
  {
    category: "Best Cinematography",
    group: "Cinematic Craft",
    winner: "Autumn Durald Arkapaw",
    film: "Sinners",
    movieId: 1233413,
    nominees: [
      "Frankenstein", "Marty Supreme",
      "One Battle After Another", "Train Dreams",
    ],
  },
  {
    category: "Best Visual Effects",
    group: "Cinematic Craft",
    winner: "Avatar: Fire and Ash",
    film: "Avatar: Fire and Ash",
    movieId: 83533,
    nominees: [
      "F1", "Jurassic World Rebirth",
      "The Lost Bus", "Sinners",
    ],
  },
  {
    category: "Best Sound",
    group: "Cinematic Craft",
    winner: "F1",
    film: "F1",
    movieId: 911430,
    nominees: [
      "Frankenstein", "One Battle After Another",
      "Sinners", "Sirāt",
    ],
  },
  {
    category: "Best Film Editing",
    group: "Cinematic Craft",
    winner: "Andy Jurgensen",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "F1", "Marty Supreme",
      "Sentimental Value", "Sinners",
    ],
  },
  {
    category: "Best Production Design",
    group: "Cinematic Craft",
    winner: "Tamara Deverell & Shane Vieau",
    film: "Frankenstein",
    movieId: 1062722,
    nominees: [
      "Hamnet", "Marty Supreme",
      "One Battle After Another", "Sinners",
    ],
  },
  {
    category: "Best Costume Design",
    group: "Cinematic Craft",
    winner: "Kate Hawley",
    film: "Frankenstein",
    movieId: 1062722,
    nominees: [
      "Avatar: Fire and Ash", "Hamnet",
      "Marty Supreme", "Sinners",
    ],
  },
  {
    category: "Best Makeup and Hairstyling",
    group: "Cinematic Craft",
    winner: "Mike Hill, Jordan Samuel & Cliona Furey",
    film: "Frankenstein",
    movieId: 1062722,
    nominees: [
      "Kokuho", "Sinners",
      "The Smashing Machine", "The Ugly Stepsister",
    ],
  },
  {
    category: "Best Casting",
    group: "Cinematic Craft",
    winner: "Cassandra Kulukundis",
    film: "One Battle After Another",
    movieId: 1054867,
    nominees: [
      "Hamnet", "Marty Supreme",
      "The Secret Agent", "Sinners",
    ],
  },
  {
    category: "Best Documentary Feature",
    group: "Documentaries & Shorts",
    winner: "Mr. Nobody Against Putin",
    film: "Mr. Nobody Against Putin",
    nominees: [
      "The Alabama Solution",
      "Come See Me in the Good Light",
      "Cutting Through Rocks",
      "The Perfect Neighbor",
    ],
  },
  {
    category: "Best Animated Short",
    group: "Documentaries & Shorts",
    winner: "The Girl Who Cried Pearls",
    film: "The Girl Who Cried Pearls",
    nominees: [
      "Butterfly", "Forevergreen",
      "Retirement Plan", "The Three Sisters",
    ],
  },
  {
    category: "Best Documentary Short",
    group: "Documentaries & Shorts",
    winner: "All the Empty Rooms",
    film: "All the Empty Rooms",
    nominees: [
      "Armed Only with a Camera: The Life and Death of Brent Renaud",
      'Children No More: "Were and Are Gone"',
      "The Devil Is Busy",
      "Perfectly a Strangeness",
    ],
  },
  {
    category: "Best Live Action Short",
    group: "Documentaries & Shorts",
    winner: "The Singers & Two People Exchanging Saliva (tie)",
    film: "Two winning short films",
    nominees: [
      "Butcher's Stain",
      "A Friend of Dorothy",
      "Jane Austen's Period Drama",
    ],
  },
];
