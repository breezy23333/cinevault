import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cinevault-tau-drab.vercel.app";

  const pages = [
    "",
    "/top",
    "/trending",
    "/search",
    "/store",
    "/support",
    "/title",
    "/watchlist",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: page === "" ? 1 : 0.8,
  }));
}