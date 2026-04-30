import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cinevault-tau-drab.vercel.app";

  const staticPages = [
    "",
    "/top",
    "/trending",
    "/search",
    "/store",
    "/support",
    "/title",
    "/watchlist",
  ];

  const tvIds = [
    1399, // Game of Thrones
    66732, // Stranger Things
    76479, // The Boys
    82856, // The Mandalorian
    60574, // Peaky Blinders
    1402, // The Walking Dead
    63174, // Lucifer
    37854, // One Piece
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page === "" ? 1 : 0.8,
    })),

    ...tvIds.map((id) => ({
      url: `${baseUrl}/tv/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}