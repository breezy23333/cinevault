import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CINRYVAN",
    short_name: "Cinryvan",
    description:
      "Discover movies, TV shows, anime and games. Explore trailers, ratings, streaming guides and entertainment news.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#05070d",
    theme_color: "#05070d",
    lang: "en",
    categories: ["entertainment"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}