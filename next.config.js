// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // either use domains:
    domains: [
      "images.unsplash.com",
      "image.tmdb.org",        // (CineVault posters/backdrops)
      "media.themoviedb.org",  // (sometimes used for profiles)
      "i.ytimg.com"            // (thumbnails if you ever embed trailers)
    ],
    // or use remotePatterns if you prefer:
    // remotePatterns: [
    //   { protocol: "https", hostname: "images.unsplash.com" },
    //   { protocol: "https", hostname: "image.tmdb.org" },
    //   { protocol: "https", hostname: "media.themoviedb.org" },
    //   { protocol: "https", hostname: "i.ytimg.com" },
    // ],
    formats: ["image/avif", "image/webp"],
  },
};
module.exports = nextConfig;

// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
    // unoptimized: true, // uncomment if you want this globally
  },
};