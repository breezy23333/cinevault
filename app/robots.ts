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
        ],
      },
    ],
    sitemap: "https://cinryvan.vercel.app/sitemap.xml",
    host: "https://cinryvan.vercel.app",
  };
}