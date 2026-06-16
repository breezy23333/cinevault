import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
    sitemap: "https://cinevault-tau-drab.vercel.app/sitemap.xml",
    host: "https://cinevault-tau-drab.vercel.app",
  };
}