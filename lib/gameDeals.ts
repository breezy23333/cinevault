export type GameDeal = {
  dealID: string;
  title: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  thumb: string;
  metacriticScore: string;
  steamRatingPercent: string;
};

const CHEAPSHARK_API = "https://www.cheapshark.com/api/1.0";

export async function getGamesOnSale(limit = 20): Promise<GameDeal[]> {
  const pageSize = Math.min(Math.max(Math.trunc(limit), 1), 60);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${CHEAPSHARK_API}/deals?storeID=1&sortBy=Savings&pageSize=${pageSize}&onSale=1`,
      {
        signal: controller.signal,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];

    return data.filter(isGameDeal).slice(0, pageSize);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function isGameDeal(value: unknown): value is GameDeal {
  if (!value || typeof value !== "object") return false;

  const deal = value as Partial<GameDeal>;
  return (
    typeof deal.dealID === "string" &&
    typeof deal.title === "string" &&
    typeof deal.salePrice === "string" &&
    typeof deal.normalPrice === "string" &&
    typeof deal.savings === "string" &&
    typeof deal.thumb === "string"
  );
}