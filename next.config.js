/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "media.themoviedb.org",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/movies",
        destination: "/movie",
        permanent: true,
      },
      {
        source: "/support/search",
        destination: "/support",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;