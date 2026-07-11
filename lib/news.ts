import Parser from "rss-parser";

export type RealNewsItem = {
  title: string;
  url: string;
  source?: string;
  image?: string | null;
  publishedAt?: string;
};

type FeedConfig = {
  name: string;
  url: string;
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

const ENTERTAINMENT_FEEDS: FeedConfig[] = [
  {
    name: "Variety",
    url: "https://variety.com/feed/",
  },
  {
    name: "Deadline",
    url: "https://deadline.com/feed/",
  },
];

const GAMING_FEEDS: FeedConfig[] = [
  {
    name: "Polygon",
    url: "https://www.polygon.com/rss/index.xml",
  },
  {
    name: "Eurogamer",
    url: "https://www.eurogamer.net/feed",
  },
];

const SPORTS_FEEDS: FeedConfig[] = [
  {
    name: "BBC Sport",
    url: "https://feeds.bbci.co.uk/sport/rss.xml?edition=uk",
  },
  {
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
  },
];

const BLOCKED_TERMS = [
  "livestream",
  "live stream",
  "watch free",
  "free stream",
  "stream online free",
  "reddit stream",
  "betting odds",
  "casino",
];

function cleanTitle(title: string) {
  return title
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isAllowedTitle(title: string) {
  const normalized = title.toLowerCase();

  return !BLOCKED_TERMS.some((term) => normalized.includes(term));
}

function imageFromHtml(html?: string | null) {
  if (!html) return null;

  const match = html.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  return match?.[1] || null;
}

function getItemImage(item: any): string | null {
  return (
    item.enclosure?.url ||
    item.mediaContent?.$?.url ||
    item.mediaContent?.url ||
    item.mediaThumbnail?.$?.url ||
    item.mediaThumbnail?.url ||
    imageFromHtml(item.contentEncoded) ||
    imageFromHtml(item.content) ||
    imageFromHtml(item.summary) ||
    null
  );
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

async function loadFeed(
  feed: FeedConfig
): Promise<RealNewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);

    return (result.items || [])
      .map((item: any) => ({
        title: cleanTitle(item.title || ""),
        url: item.link || item.guid || "",
        source: feed.name,
        image: getItemImage(item),
        publishedAt:
          item.isoDate ||
          item.pubDate ||
          new Date().toISOString(),
      }))
      .filter(
        (item) =>
          Boolean(item.title) &&
          Boolean(item.url) &&
          isAllowedTitle(item.title)
      );
  } catch (error) {
    console.error(`RSS feed failed: ${feed.name}`, error);
    return [];
  }
}

async function loadFeeds(
  feeds: FeedConfig[],
  pageSize = 12
): Promise<RealNewsItem[]> {
  const results = await Promise.allSettled(
    feeds.map((feed) => loadFeed(feed))
  );

  const articles = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  return removeDuplicates(articles)
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, pageSize);
}

export async function getEntertainmentNews(): Promise<RealNewsItem[]> {
  return loadFeeds(ENTERTAINMENT_FEEDS, 12);
}

export async function getSportsNews(): Promise<RealNewsItem[]> {
  return loadFeeds(SPORTS_FEEDS, 12);
}

export async function getGamingNews(): Promise<RealNewsItem[]> {
  return loadFeeds(GAMING_FEEDS, 12);
}

export async function getSportsTopicNews(
  topic: string
): Promise<RealNewsItem[]> {
  const items = await loadFeeds(SPORTS_FEEDS, 40);
  const term = topic.toLowerCase();

  const aliases: Record<string, string[]> = {
    soccer: ["soccer", "football", "premier league", "champions league"],
    football: ["nfl", "american football"],
    racing: ["formula 1", "f1", "motorsport", "racing"],
    cricket: ["cricket"],
    rugby: ["rugby"],
    tennis: ["tennis", "atp", "wta"],
    basketball: ["basketball", "nba"],
  };

  const terms = aliases[term] || [term];

  return items
    .filter((item) =>
      terms.some((word) =>
        item.title.toLowerCase().includes(word)
      )
    )
    .slice(0, 12);
}

export async function getGamingTopicNews(
  topic: string
): Promise<RealNewsItem[]> {
  const items = await loadFeeds(GAMING_FEEDS, 40);
  const term = topic.toLowerCase();

  const aliases: Record<string, string[]> = {
    console: ["console", "playstation", "xbox", "nintendo"],
    pc: ["pc", "steam", "epic games"],
    mobile: ["mobile", "android", "ios"],
    esports: ["esports", "tournament", "competitive"],
    playstation: ["playstation", "ps5"],
    xbox: ["xbox", "game pass"],
    nintendo: ["nintendo", "switch"],
  };

  const terms = aliases[term] || [term];

  return items
    .filter((item) =>
      terms.some((word) =>
        item.title.toLowerCase().includes(word)
      )
    )
    .slice(0, 12);
}

export async function getEntertainmentTopicNews(
  topic: string
): Promise<RealNewsItem[]> {
  const items = await loadFeeds(ENTERTAINMENT_FEEDS, 50);
  const term = topic.toLowerCase();

  const aliases: Record<string, string[]> = {
    movies: ["movie", "film", "cinema", "box office"],
    tv: ["tv", "television", "series", "show"],
    streaming: [
      "netflix",
      "disney+",
      "prime video",
      "hbo",
      "max",
      "streaming",
    ],
    celebrities: [
      "actor",
      "actress",
      "celebrity",
      "hollywood",
    ],
    awards: [
      "oscar",
      "emmy",
      "golden globe",
      "award",
    ],
    "box-office": [
      "box office",
      "opening weekend",
      "grossed",
    ],
    anime: ["anime", "manga", "crunchyroll"],
  };

  const terms = aliases[term] || [term];

  return items
    .filter((item) =>
      terms.some((word) =>
        item.title.toLowerCase().includes(word)
      )
    )
    .slice(0, 12);
}