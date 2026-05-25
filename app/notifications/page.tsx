import NotificationsClient from "@/components/NotificationsClient";

export const revalidate = 3600;

const TMDB_BASE = "https://api.themoviedb.org/3";

function authHeaders() {
  const bearer =
    process.env.TMDB_BEARER ||
    process.env.TMDB_READ ||
    process.env.TMDB_TOKEN;

  return bearer ? { Authorization: `Bearer ${bearer}` } : undefined;
}

function withKey(url: string) {
  const key = process.env.TMDB_API_KEY;
  return key ? `${url}${url.includes("?") ? "&" : "?"}api_key=${key}` : url;
}

async function getTrendingNotifications() {
  try {
    const res = await fetch(
      withKey(`${TMDB_BASE}/trending/all/day?language=en-US`),
      {
        headers: authHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return (data.results || []).slice(0, 8).map((item: any) => {
      const isTv = item.media_type === "tv";
      const title = item.title || item.name || "Untitled";

      return {
        id: `tmdb-${item.media_type}-${item.id}`,
        title: isTv ? `New trending show: ${title}` : `New trending movie: ${title}`,
        message: isTv
          ? `${title} is trending now. Open it to view episodes, trailers, and details.`
          : `${title} is trending now. Open it to view trailers, watch options, and movie details.`,
        time: "New today",
        href: isTv ? `/tv/${item.id}` : `/movie/${item.id}`,
        type: isTv ? "episode" : "trending",
      };
    });
  } catch {
    return [];
  }
}

export default async function NotificationsPage() {
  const tmdbNotifications = await getTrendingNotifications();

  return (
    <main className="min-h-screen bg-[#080d16] px-4 pb-20 pt-28 text-white">
      <NotificationsClient tmdbNotifications={tmdbNotifications} />
    </main>
  );
}