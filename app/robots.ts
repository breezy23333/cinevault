import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "meta-externalagent",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/checkout/",
          "/profile/",
          "/rooms/",
          "/watchlist/",
          "/notifications/",
          "/settings/",
          "/login/",
          "/signup/",
          "/person/",
        ],
      },
    ],
    sitemap: "https://cinevault-tau-drab.vercel.app/sitemap.xml",
    host: "https://cinevault-tau-drab.vercel.app",
  };
}