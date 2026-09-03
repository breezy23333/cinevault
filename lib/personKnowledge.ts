import "server-only";

const CACHE_SECONDS = 86400;
const USER_AGENT =
  "CINRYVAN/1.0 (https://cinryvan.vercel.app; public celebrity knowledge pages)";

type WikidataValue = {
  id?: string;
  time?: string;
  amount?: string;
  unit?: string;
};

type WikidataClaim = {
  rank?: "preferred" | "normal" | "deprecated";
  mainsnak?: {
    snaktype?: string;
    datavalue?: {
      value?: WikidataValue | string | number;
    };
  };
};

type WikiSection = {
  index?: string;
  line?: string;
};

export type PersonKnowledge = {
  wikidataId: string;
  wikipediaTitle: string | null;
  wikipediaUrl: string | null;
  summary: string | null;
  shortDescription: string | null;
  nationality: string[];
  occupations: string[];
  spouses: string[];
  partners: string[];
  children: string[];
  parents: string[];
  siblings: string[];
  education: string[];
  awards: string[];
  notableWorks: string[];
  residences: string[];
  height: string | null;
  career: string | null;
  personalLife: string | null;
  controversies: string | null;
  sources: {
    label: string;
    url: string;
  }[];
};

const PROPERTY = {
  nationality: "P27",
  occupation: "P106",
  spouse: "P26",
  partner: "P451",
  child: "P40",
  father: "P22",
  mother: "P25",
  sibling: "P3373",
  education: "P69",
  award: "P166",
  notableWork: "P800",
  residence: "P551",
  height: "P2048",
} as const;

async function fetchJson(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": USER_AGENT,
      },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function validWikidataId(value?: string | null) {
  return Boolean(value && /^Q\d+$/.test(value));
}

function claimsFor(entity: any, property: string): WikidataClaim[] {
  const claims = entity?.claims?.[property];
  if (!Array.isArray(claims)) return [];

  return claims.filter(
    (claim: WikidataClaim) =>
      claim?.rank !== "deprecated" &&
      claim?.mainsnak?.snaktype === "value",
  );
}

function entityIds(entity: any, property: string) {
  return claimsFor(entity, property)
    .map((claim) => {
      const value = claim.mainsnak?.datavalue?.value;
      return typeof value === "object" ? value?.id : null;
    })
    .filter((value): value is string => Boolean(value && /^Q\d+$/.test(value)));
}

function unique(values: string[], maximum = 20) {
  return Array.from(new Set(values.filter(Boolean))).slice(0, maximum);
}

async function resolveLabels(ids: string[]) {
  const labels = new Map<string, string>();
  const uniqueIds = unique(ids, 50);

  if (!uniqueIds.length) return labels;

  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbgetentities");
  url.searchParams.set("ids", uniqueIds.join("|"));
  url.searchParams.set("props", "labels");
  url.searchParams.set("languages", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const data = await fetchJson(url.toString());

  for (const id of uniqueIds) {
    const label = data?.entities?.[id]?.labels?.en?.value;
    if (typeof label === "string" && label.trim()) {
      labels.set(id, label.trim());
    }
  }

  return labels;
}

function labelsFor(ids: string[], labels: Map<string, string>, maximum = 12) {
  return unique(
    ids.map((id) => labels.get(id)).filter((value): value is string => Boolean(value)),
    maximum,
  );
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function htmlToText(html?: string | null) {
  if (!html) return null;

  const text = decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<\/(p|div|h2|h3|li)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\[[a-z ]+\]/gi, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text ? text.slice(0, 6000) : null;
}

async function getWikipediaSummary(title: string) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("exintro", "1");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", title);
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const data = await fetchJson(url.toString());
  const page = Object.values(data?.query?.pages || {})[0] as any;
  const extract = typeof page?.extract === "string" ? page.extract.trim() : "";
  return extract ? extract.slice(0, 3000) : null;
}

async function getWikipediaSections(title: string) {
  const listUrl = new URL("https://en.wikipedia.org/w/api.php");
  listUrl.searchParams.set("action", "parse");
  listUrl.searchParams.set("page", title);
  listUrl.searchParams.set("prop", "sections");
  listUrl.searchParams.set("redirects", "1");
  listUrl.searchParams.set("format", "json");
  listUrl.searchParams.set("origin", "*");

  const data = await fetchJson(listUrl.toString());
  const sections: WikiSection[] = Array.isArray(data?.parse?.sections)
    ? data.parse.sections
    : [];

  async function readSection(patterns: RegExp[]) {
    const match = sections.find((section) =>
      patterns.some((pattern) => pattern.test(section.line || "")),
    );

    if (!match?.index) return null;

    const sectionUrl = new URL("https://en.wikipedia.org/w/api.php");
    sectionUrl.searchParams.set("action", "parse");
    sectionUrl.searchParams.set("page", title);
    sectionUrl.searchParams.set("prop", "text");
    sectionUrl.searchParams.set("section", match.index);
    sectionUrl.searchParams.set("redirects", "1");
    sectionUrl.searchParams.set("format", "json");
    sectionUrl.searchParams.set("origin", "*");

    const sectionData = await fetchJson(sectionUrl.toString());
    return htmlToText(sectionData?.parse?.text?.["*"]);
  }

  const [career, personalLife, controversies] = await Promise.all([
    readSection([/^career$/i, /acting career/i, /professional career/i]),
    readSection([/personal life/i, /relationships?/i, /family/i]),
    readSection([
      /controvers/i,
      /legal issues?/i,
      /public disputes?/i,
      /feuds?/i,
      /allegations?/i,
    ]),
  ]);

  return { career, personalLife, controversies };
}

function formatHeight(entity: any) {
  const claim = claimsFor(entity, PROPERTY.height)[0];
  const value = claim?.mainsnak?.datavalue?.value;

  if (!value || typeof value !== "object" || !value.amount) return null;

  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const metres = value.unit?.endsWith("Q11573") ? amount / 100 : amount;
  if (metres < 0.5 || metres > 3) return null;

  const feet = metres * 3.28084;
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  return `${metres.toFixed(2)} m (${wholeFeet} ft ${inches} in)`;
}

export async function getPersonKnowledge(
  wikidataId?: string | null,
): Promise<PersonKnowledge | null> {
  if (!validWikidataId(wikidataId)) return null;

  const id = wikidataId!;
  const entityUrl = new URL("https://www.wikidata.org/w/api.php");
  entityUrl.searchParams.set("action", "wbgetentities");
  entityUrl.searchParams.set("ids", id);
  entityUrl.searchParams.set("props", "claims|sitelinks|labels|descriptions");
  entityUrl.searchParams.set("languages", "en");
  entityUrl.searchParams.set("sitefilter", "enwiki");
  entityUrl.searchParams.set("format", "json");
  entityUrl.searchParams.set("origin", "*");

  const data = await fetchJson(entityUrl.toString());
  const entity = data?.entities?.[id];
  if (!entity || entity.missing !== undefined) return null;

  const groupedIds = {
    nationality: entityIds(entity, PROPERTY.nationality),
    occupations: entityIds(entity, PROPERTY.occupation),
    spouses: entityIds(entity, PROPERTY.spouse),
    partners: entityIds(entity, PROPERTY.partner),
    children: entityIds(entity, PROPERTY.child),
    parents: [
      ...entityIds(entity, PROPERTY.father),
      ...entityIds(entity, PROPERTY.mother),
    ],
    siblings: entityIds(entity, PROPERTY.sibling),
    education: entityIds(entity, PROPERTY.education),
    awards: entityIds(entity, PROPERTY.award),
    notableWorks: entityIds(entity, PROPERTY.notableWork),
    residences: entityIds(entity, PROPERTY.residence),
  };

  const allIds = Object.values(groupedIds).flat();
  const labels = await resolveLabels(allIds);
  const wikipediaTitle = entity?.sitelinks?.enwiki?.title || null;

  const [summary, sections] = wikipediaTitle
    ? await Promise.all([
        getWikipediaSummary(wikipediaTitle),
        getWikipediaSections(wikipediaTitle),
      ])
    : [null, { career: null, personalLife: null, controversies: null }];

  const wikipediaUrl = wikipediaTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(
        wikipediaTitle.replace(/ /g, "_"),
      )}`
    : null;

  return {
    wikidataId: id,
    wikipediaTitle,
    wikipediaUrl,
    summary,
    shortDescription: entity?.descriptions?.en?.value || null,
    nationality: labelsFor(groupedIds.nationality, labels),
    occupations: labelsFor(groupedIds.occupations, labels),
    spouses: labelsFor(groupedIds.spouses, labels),
    partners: labelsFor(groupedIds.partners, labels),
    children: labelsFor(groupedIds.children, labels),
    parents: labelsFor(groupedIds.parents, labels),
    siblings: labelsFor(groupedIds.siblings, labels),
    education: labelsFor(groupedIds.education, labels),
    awards: labelsFor(groupedIds.awards, labels, 24),
    notableWorks: labelsFor(groupedIds.notableWorks, labels),
    residences: labelsFor(groupedIds.residences, labels),
    height: formatHeight(entity),
    career: sections.career,
    personalLife: sections.personalLife,
    controversies: sections.controversies,
    sources: [
      { label: "Wikidata", url: `https://www.wikidata.org/wiki/${id}` },
      ...(wikipediaUrl ? [{ label: "Wikipedia", url: wikipediaUrl }] : []),
    ],
  };
}
