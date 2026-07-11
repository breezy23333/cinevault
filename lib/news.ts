import Parser from "rss-parser";

export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

const parser = new Parser();

async function getGoogleNews(
  query: string,
  pageSize = 12
): Promise<RealNewsItem[]> {
  try {
    const rssUrl =
      `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
      `&hl=en-ZA&gl=ZA&ceid=ZA:en`;

    const feed = await parser.parseURL(rssUrl);

    return (feed.items || [])
      .filter((item) => item.title && item.link)
      .slice(0, pageSize)
      .map((item) => ({
        title: item.title || "Untitled",
        url: item.link || "#",
        source: item.creator || "Google News",
        image: null,
      }));
  } catch (error) {
    console.error("Google News RSS error:", error);
    return [];
  }
}

async function getNewsByCategory(
  category: "entertainment" | "sports" | "technology",
  pageSize = 12
): Promise<RealNewsItem[]> {
  const key = process.env.NEWS_API_KEY;

  if (key) {
    try {
      const url =
        `https://newsapi.org/v2/top-headlines?category=${category}` +
        `&language=en&pageSize=${pageSize}&apiKey=${key}`;

      const res = await fetch(url, {
        next: { revalidate: 600 },
      });

      if (res.ok) {
        const data = await res.json();

        const articles = (data.articles || [])
          .filter((a: any) => a.title && a.url)
          .map((a: any) => ({
            title: a.title,
            url: a.url,
            source: a.source?.name || "News",
            image: a.urlToImage || null,
          }));

        if (articles.length > 0) {
          return articles;
        }
      } else {
        const body = await res.text();
        console.error("NewsAPI error:", res.status, body);
      }
    } catch (error) {
      console.error("NewsAPI request failed:", error);
    }
  }

  const fallbackQueries = {
    entertainment: "movies OR television OR streaming OR celebrities",
    sports: "sports OR soccer OR football OR Formula 1",
    technology: "gaming OR PlayStation OR Xbox OR Nintendo OR PC gaming",
  };

  return getGoogleNews(fallbackQueries[category], pageSize);
}

export async function getEntertainmentNews() {
  return getNewsByCategory("entertainment", 12);
}

export async function getSportsNews() {
  return getNewsByCategory("sports", 12);
}

export async function getGamingNews() {
  return getNewsByCategory("technology", 12);
}

export async function getSportsTopicNews(topic: string) {
  const queryMap: Record<string, string> = {
    soccer: "soccer OR Premier League OR Champions League",
    football: "NFL OR American football",
    racing: "Formula 1 OR motorsport OR racing",
    cricket: "cricket",
    rugby: "rugby",
    basketball: "NBA OR basketball",
    tennis: "tennis OR ATP OR WTA",
  };

  return getGoogleNews(queryMap[topic] || topic, 12);
}

export async function getGamingTopicNews(topic: string) {
  const queryMap: Record<string, string> = {
    console: "PlayStation OR Xbox OR Nintendo",
    pc: "PC gaming OR Steam OR Epic Games",
    mobile: "mobile gaming OR Android games OR iOS games",
    esports: "esports",
    playstation: "PlayStation",
    xbox: "Xbox",
    nintendo: "Nintendo",
  };

  return getGoogleNews(queryMap[topic] || topic, 12);
}

export async function getEntertainmentTopicNews(topic: string) {
  const queryMap: Record<string, string> = {
    movies: "movies OR cinema OR film",
    tv: "TV shows OR television series",
    streaming: "Netflix OR Disney Plus OR Prime Video OR Max",
    celebrities: "Hollywood celebrities",
    awards: "Oscars OR Emmy Awards OR Golden Globes",
    "box-office": "movie box office",
    anime: "anime OR manga OR Crunchyroll",
  };

  return getGoogleNews(queryMap[topic] || topic, 12);
}