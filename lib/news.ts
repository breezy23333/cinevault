import Parser from "rss-parser";

export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
};

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const BLOCKED_HEADLINE_WORDS = [
  "livestream",
  "live stream",
  "watch free",
  "free stream",
  "streaming free",
  "reddit streams",
  "how to watch free",
  "live online free",
  "tv channel free",
  "official stream",
];

const BLOCKED_SOURCES = [
  "facebook",
  "instagram",
  "pinterest",
];

function cleanHeadline(title: string) {
  return title
    // Remove strange symbols at the beginning
    .replace(/^[^a-zA-Z0-9"'([{]+/, "")
    // Remove spam-style prefixes
    .replace(
      /^\s*[\[(]?(livestreams?|live streams?|watch live|streaming)[\])!:\-\s]*/i,
      ""
    )
    // Remove repeated spaces
    .replace(/\s+/g, " ")
    .trim();
}

function isGoodHeadline(title: string, source?: string) {
  const text = `${title} ${source || ""}`.toLowerCase();

  if (title.length < 25) return false;

  if (BLOCKED_HEADLINE_WORDS.some((word) => text.includes(word))) {
    return false;
  }

  if (
    source &&
    BLOCKED_SOURCES.some((blocked) =>
      source.toLowerCase().includes(blocked)
    )
  ) {
    return false;
  }

  return true;
}

function imageFromHtml(html?: string | null) {
  if (!html) return null;

  const match =
    html.match(/<img[^>]+src=["']([^"']+)["']/i) ||
    html.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/i);

  return match?.[1] || match?.[0] || null;
}

function imageFromRssItem(item: any) {
  return (
    item.enclosure?.url ||
    item.mediaContent?.$?.url ||
    item.mediaContent?.url ||
    item.mediaThumbnail?.$?.url ||
    item.mediaThumbnail?.url ||
    imageFromHtml(item.contentEncoded) ||
    imageFromHtml(item.content) ||
    null
  );
}

async function getArticleImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CineVaultNewsBot/1.0)",
      },
      redirect: "follow",
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const html = await res.text();

    const ogImage =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      ) ||
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
      );

    return ogImage?.[1] || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getGoogleNews(
  query: string,
  pageSize = 12
): Promise<RealNewsItem[]> {
  try {
    const rssUrl =
      `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
      `&hl=en-ZA&gl=ZA&ceid=ZA:en`;

    const feed = await parser.parseURL(rssUrl);

    const cleaned = (feed.items || [])
      .map((item: any) => {
        const title = cleanHeadline(item.title || "");
        const source =
          item.creator ||
          item.source ||
          item["dc:creator"] ||
          "Google News";

        return {
          title,
          url: item.link || "",
          source,
          image: imageFromRssItem(item),
        };
      })
      .filter(
        (item) =>
          item.title &&
          item.url &&
          isGoodHeadline(item.title, item.source)
      )
      .slice(0, pageSize);

    // Try to find images only for stories that do not already have one.
    const withImages = await Promise.all(
      cleaned.map(async (item, index) => {
        // Limit extra requests to the first eight stories.
        if (item.image || index >= 8) return item;

        const image = await getArticleImage(item.url);

        return {
          ...item,
          image,
        };
      })
    );

    return withImages;
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
  entertainment:
    '(movies OR cinema OR television OR streaming OR Hollywood) -livestream -"live stream" -"watch free"',
  sports:
    '(sports OR soccer OR rugby OR Formula 1 OR cricket) -livestream -"live stream" -"watch free"',
  technology:
    '(gaming OR PlayStation OR Xbox OR Nintendo OR Steam) -livestream -"live stream" -"watch free"',
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