export type AwardResult = "Won" | "Nominated";

export type Award = {
  award: string;
  category: string;
  result: AwardResult;
  year: number;
};

export type AwardsMediaType = "movie" | "tv";

export const awardsDatabase: Record<
  AwardsMediaType,
  Record<number, Award[]>
> = {
  movie: {
    // Oppenheimer
    872585: [
      {
        award: "Academy Awards",
        category: "Best Picture",
        result: "Won",
        year: 2024,
      },
      {
        award: "Academy Awards",
        category: "Best Director",
        result: "Won",
        year: 2024,
      },
      {
        award: "Academy Awards",
        category: "Best Actor",
        result: "Won",
        year: 2024,
      },
      {
        award: "Golden Globe Awards",
        category: "Best Motion Picture – Drama",
        result: "Won",
        year: 2024,
      },
    ],

    // Parasite
    496243: [
      {
        award: "Academy Awards",
        category: "Best Picture",
        result: "Won",
        year: 2020,
      },
      {
        award: "Academy Awards",
        category: "Best Director",
        result: "Won",
        year: 2020,
      },
      {
        award: "Academy Awards",
        category: "Best International Feature Film",
        result: "Won",
        year: 2020,
      },
    ],
  },

  tv: {
    // Game of Thrones
    1399: [
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Drama Series",
        result: "Won",
        year: 2019,
      },
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Supporting Actor in a Drama Series",
        result: "Won",
        year: 2019,
      },
      {
        award: "Golden Globe Awards",
        category: "Best Television Series – Drama",
        result: "Nominated",
        year: 2017,
      },
    ],

    // Breaking Bad
    1396: [
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Drama Series",
        result: "Won",
        year: 2014,
      },
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Lead Actor in a Drama Series",
        result: "Won",
        year: 2014,
      },
      {
        award: "Golden Globe Awards",
        category: "Best Television Series – Drama",
        result: "Won",
        year: 2014,
      },
    ],

    // Succession
    76331: [
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Drama Series",
        result: "Won",
        year: 2024,
      },
      {
        award: "Golden Globe Awards",
        category: "Best Television Series – Drama",
        result: "Won",
        year: 2024,
      },
      {
        award: "Screen Actors Guild Awards",
        category: "Outstanding Performance by an Ensemble",
        result: "Won",
        year: 2024,
      },
    ],

    // The Last of Us
    100088: [
      {
        award: "Primetime Emmy Awards",
        category: "Outstanding Drama Series",
        result: "Nominated",
        year: 2024,
      },
      {
        award: "Golden Globe Awards",
        category: "Best Television Series – Drama",
        result: "Nominated",
        year: 2024,
      },
      {
        award: "Screen Actors Guild Awards",
        category: "Outstanding Performance by a Male Actor",
        result: "Won",
        year: 2024,
      },
    ],
  },
};