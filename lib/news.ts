export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

export async function getEntertainmentNews(): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (!key) return [];

  const url =
    `https://newsapi.org/v2/top-headlines?category=entertainment&language=en&pageSize=12&apiKey=${key}`;

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