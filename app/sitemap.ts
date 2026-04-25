import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cinevault-tau-drab.vercel.app",
      lastModified: new Date(),
    },
  ];
}