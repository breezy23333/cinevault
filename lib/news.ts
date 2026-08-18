import Parser from "rss-parser";

export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
  publishedAt?: string;
};

type FeedConfig = { name: string; url: string };

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const ENTERTAINMENT_FEEDS: FeedConfig[] = [
  { name: "Variety", url: "https://variety.com/feed/" },
  { name: "Deadline", url: "https://deadline.com/feed/" },
];

const GAMING_FEEDS: FeedConfig[] = [
  { name: "Polygon", url: "https://www.polygon.com/rss/index.xml" },
  { name: "Eurogamer", url: "https://www.eurogamer.net/feed" },
];

const SPORTS_FEEDS: FeedConfig[] = [
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml?edition=uk" },
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news" },
];

const BLOCKED_TERMS = [
  "livestream", "live stream", "watch free", "free stream",
  "stream online free", "reddit stream", "betting odds", "casino",
];

function cleanTitle(title: string) {
  return title.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/\s+/g, " ").trim();
}

function isAllowedTitle(title: string) {
  const normalized = title.toLowerCase();
  return !BLOCKED_TERMS.some((term) => normalized.includes(term));
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function validImage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const decoded = decodeHtml(value.trim());
  return /^https?:\/\//i.test(decoded) ? decoded : null;
}

function imageFromHtml(html?: string | null) {
  if (!html) return null;
  return validImage(html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]);
}

function mediaUrl(value: any): string | null {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  for (const entry of values) {
    const url = validImage(entry?.$?.url) || validImage(entry?.url) || validImage(entry);
    if (url) return url;
  }
  return null;
}

function getItemImage(item: any): string | null {
  return (
    validImage(item.enclosure?.url) ||
    mediaUrl(item.mediaContent) ||
    mediaUrl(item.mediaThumbnail) ||
    imageFromHtml(item.contentEncoded) ||
    imageFromHtml(item.content) ||
    imageFromHtml(item.summary) ||
    null
  );
}

async function getArticleImage(articleUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; CINRYVAN/1.0)",
      },
      next: { revalidate: 60 * 60 },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
      /"image"\s*:\s*"(https?:\\?\/\\?\/[^"\\]+(?:\\.[^"\\]*)*)"/i,
    ];

    for (const pattern of patterns) {
      const raw = pattern.exec(html)?.[1]?.replace(/\\\//g, "/");
      if (!raw) continue;
      try {
        return validImage(new URL(decodeHtml(raw), articleUrl).toString());
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function removeDuplicates(items: RealNewsItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadFeed(feed: FeedConfig): Promise<RealNewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || [])
      .map((item: any) => ({
        title: cleanTitle(item.title || ""),
        url: item.link || item.guid || "",
        source: feed.name,
        image: getItemImage(item),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      }))
      .filter((item) => item.title && item.url && isAllowedTitle(item.title));
  } catch (error) {
    console.error(`RSS feed failed: ${feed.name}`, error);
    return [];
  }
}

async function loadFeeds(feeds: FeedConfig[], pageSize = 12) {
  const results = await Promise.allSettled(feeds.map(loadFeed));
  const selected = removeDuplicates(
    results.flatMap((result) => result.status === "fulfilled" ? result.value : []),
  )
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, pageSize);

  return Promise.all(
    selected.map(async (item) =>
      item.image ? item : { ...item, image: await getArticleImage(item.url) },
    ),
  );
}

export const getEntertainmentNews = () => loadFeeds(ENTERTAINMENT_FEEDS, 12);
export const getSportsNews = () => loadFeeds(SPORTS_FEEDS, 12);
export const getGamingNews = () => loadFeeds(GAMING_FEEDS, 12);

async function topicNews(feeds: FeedConfig[], topic: string, aliases: Record<string, string[]>, size: number) {
  const items = await loadFeeds(feeds, size);
  const term = topic.toLowerCase();
  const terms = aliases[term] || [term];
  return items.filter((item) => terms.some((word) => item.title.toLowerCase().includes(word))).slice(0, 12);
}

export function getSportsTopicNews(topic: string) {
  return topicNews(SPORTS_FEEDS, topic, {
    soccer: ["soccer", "football", "premier league", "champions league"],
    football: ["nfl", "american football"], racing: ["formula 1", "f1", "motorsport", "racing"],
    cricket: ["cricket"], rugby: ["rugby"], tennis: ["tennis", "atp", "wta"], basketball: ["basketball", "nba"],
  }, 40);
}

export function getGamingTopicNews(topic: string) {
  return topicNews(GAMING_FEEDS, topic, {
    console: ["console", "playstation", "xbox", "nintendo"], pc: ["pc", "steam", "epic games"],
    mobile: ["mobile", "android", "ios"], esports: ["esports", "tournament", "competitive"],
    playstation: ["playstation", "ps5"], xbox: ["xbox", "game pass"], nintendo: ["nintendo", "switch"],
  }, 40);
}

export function getEntertainmentTopicNews(topic: string) {
  return topicNews(ENTERTAINMENT_FEEDS, topic, {
    movies: ["movie", "film", "cinema", "box office"], tv: ["tv", "television", "series", "show"],
    streaming: ["netflix", "disney+", "prime video", "hbo", "max", "streaming"],
    celebrities: ["actor", "actress", "celebrity", "hollywood"], awards: ["oscar", "emmy", "golden globe", "award"],
    "box-office": ["box office", "opening weekend", "grossed"], anime: ["anime", "manga", "crunchyroll"],
  }, 50);
}