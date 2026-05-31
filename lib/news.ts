export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

async function getNewsByCategory(
  category: "entertainment" | "sports" | "technology",
  pageSize = 12
): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${pageSize}&apiKey=${key}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.articles || [])
    .filter((a: any) => a.title && a.url)
    .map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name || "News",
      image: a.urlToImage || null,
    }));
}

export async function getEntertainmentNews(): Promise<RealNewsItem[]> {
  return getNewsByCategory("entertainment", 12);
}

export async function getSportsNews(): Promise<RealNewsItem[]> {
  return getNewsByCategory("sports", 12);
}

export async function getGamingNews(): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const url = `https://newsapi.org/v2/everything?q=("video games" OR gaming OR PlayStation OR Xbox OR Nintendo OR Steam OR esports) NOT sports&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.articles || [])
    .filter((a: any) => a.title && a.url)
    .map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name || "Gaming News",
      image: a.urlToImage || null,
    }));
}

export async function getSportsTopicNews(topic: string): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const queryMap: Record<string, string> = {
    soccer: "soccer OR football OR premier league OR champions league",
    football: "NFL OR American football",
    racing: "Formula 1 OR F1 OR racing OR motorsport",
    basketball: "NBA OR basketball",
    tennis: "tennis OR ATP OR WTA",
  };

  const q = queryMap[topic] || topic;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    q
  )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.articles || [])
    .filter((a: any) => a.title && a.url)
    .map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name || "Sports News",
      image: a.urlToImage || null,
    }));
}

export async function getGamingTopicNews(topic: string): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const queryMap: Record<string, string> = {
    console: "PlayStation OR Xbox OR Nintendo",
    pc: "PC Gaming OR Steam OR Epic Games",
    mobile: "Mobile Gaming OR Android Games OR iOS Games",
  };

  const q = queryMap[topic] || topic;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    q
  )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.articles || [])
    .filter((a: any) => a.title && a.url)
    .map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name || "Gaming News",
      image: a.urlToImage || null,
    }));
}

export async function getEntertainmentTopicNews(
  topic: string
): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const queryMap: Record<string, string> = {
    movies: "movies OR cinema OR film",
    tv: "TV shows OR television series OR streaming series",
    streaming: "Netflix OR Disney Plus OR Prime Video OR Max OR Hulu",
    celebrities: "celebrities OR celebrity OR Hollywood",
    anime: "anime OR manga OR Crunchyroll",
  };

  const q = queryMap[topic] || topic;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    q
  )}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.articles || [])
    .filter((a: any) => a.title && a.url)
    .map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name || "Entertainment News",
      image: a.urlToImage || null,
    }));
}