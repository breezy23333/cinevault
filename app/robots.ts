import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/movie/",
          "/tv/",
          "/anime",
          "/cartoons",
          "/top",
          "/trending",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/checkout/",
          "/profile/",
          "/rooms/",
        ],
      },
    ],
    sitemap: "https://cinevault-tau-drab.vercel.app/sitemap.xml",
    host: "https://cinevault-tau-drab.vercel.app",
  };
}