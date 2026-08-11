import "server-only";

const IGDB_API_URL = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const CACHE_TIME = 60 * 60 * 24;

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

let cachedToken: {
  value: string;
  expiresAt: number;
} | null = null;

async function getIgdbAccessToken(): Promise<string> {
  if (
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.value;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "IGDB_CLIENT_ID or IGDB_CLIENT_SECRET is missing.",
    );
  }

  const tokenUrl = new URL(TWITCH_TOKEN_URL);
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set(
    "grant_type",
    "client_credentials",
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(
      `Twitch token request failed with status ${response.status}.`,
    );
  }

  const token = (await response.json()) as TwitchTokenResponse;

  cachedToken = {
    value: token.access_token,
    expiresAt:
      Date.now() + Math.max(token.expires_in - 60, 60) * 1000,
  };

  return token.access_token;
}

export async function igdbRequest<T>(
  endpoint: string,
  body: string,
  options: {
    revalidate?: number;
    noStore?: boolean;
  } = {},
): Promise<T> {
  if (!/^[a-z_]+(?:\/count)?$/.test(endpoint)) {
    throw new Error(`Invalid IGDB endpoint: ${endpoint}`);
  }

  const clientId = process.env.IGDB_CLIENT_ID;

  if (!clientId) {
    throw new Error("IGDB_CLIENT_ID is missing.");
  }

  const accessToken = await getIgdbAccessToken();

  const response = await fetch(
    `${IGDB_API_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
      body,
      ...(options.noStore
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate:
                options.revalidate ?? CACHE_TIME,
            },
          }),
      signal: AbortSignal.timeout(20_000),
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `IGDB ${endpoint} request failed (${response.status}): ${message}`,
    );
  }

  return (await response.json()) as T;
}