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