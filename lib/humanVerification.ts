import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const HUMAN_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-cinryvan_human"
    : "cinryvan_human";

export const HUMAN_MAX_AGE = 60 * 60; // One hour

function getSigningSecret(): string {
  const secret = process.env.HUMAN_VERIFICATION_SECRET;

  if (!secret || secret.length < 64) {
    throw new Error("Human verification is not configured.");
  }

  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(`cinryvan:human:v1:${payload}`)
    .digest("hex");
}

export function createHumanToken(): string {
  const expiresAt =
    Math.floor(Date.now() / 1000) + HUMAN_MAX_AGE;

  const nonce = randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;

  return `${payload}.${sign(payload)}`;
}

export function isHumanTokenValid(
  token: string | undefined
): boolean {
  if (!token || token.length > 200) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiry, nonce, signature] = parts;

  if (
    !/^\d{10}$/.test(expiry) ||
    !/^[a-f0-9]{32}$/.test(nonce) ||
    !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return false;
  }

  const expiresAt = Number(expiry);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= now ||
    expiresAt > now + HUMAN_MAX_AGE
  ) {
    return false;
  }

  const expected = Buffer.from(
    sign(`${expiry}.${nonce}`),
    "hex"
  );

  const supplied = Buffer.from(signature, "hex");

  return timingSafeEqual(expected, supplied);
}