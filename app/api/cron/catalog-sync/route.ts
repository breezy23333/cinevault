import { NextRequest, NextResponse } from "next/server";

import {
  syncCatalogPages,
  type CatalogMediaType,
} from "@/lib/catalogSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_TMDB_PAGE = 500;
const PAGES_PER_RUN = 6;

function getRotatingPages() {
  const currentDay = Math.floor(
    Date.now() / 86_400_000,
  );

  /*
   * Page one is always refreshed because it contains
   * the most popular current titles.
   *
   * The remaining pages rotate through TMDB over time,
   * gradually expanding Cinryvan's permanent catalogue.
   */
  const startingPage =
    (currentDay * (PAGES_PER_RUN - 1)) %
      (MAX_TMDB_PAGE - 1) +
    2;

  const pages = [1];

  for (
    let index = 0;
    index < PAGES_PER_RUN - 1;
    index += 1
  ) {
    const page =
      ((startingPage - 2 + index) %
        (MAX_TMDB_PAGE - 1)) +
      2;

    pages.push(page);
  }

  return pages;
}

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  return (
    request.headers.get("authorization") ===
    `Bearer ${cronSecret}`
  );
}

async function syncMediaType(
  mediaType: CatalogMediaType,
  pages: number[],
) {
  try {
    const results = await syncCatalogPages(
      mediaType,
      pages,
    );

    return {
      mediaType,
      success: true,
      received: results.reduce(
        (total, result) =>
          total + result.received,
        0,
      ),
      stored: results.reduce(
        (total, result) =>
          total + result.stored,
        0,
      ),
      pages: results.map(
        (result) => result.page,
      ),
    };
  } catch (error) {
    return {
      mediaType,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown catalogue sync error",
      received: 0,
      stored: 0,
      pages,
    };
  }
}

export async function GET(
  request: NextRequest,
) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const pages = getRotatingPages();

  const [movies, television] =
    await Promise.all([
      syncMediaType("movie", pages),
      syncMediaType("tv", pages),
    ]);

  const success =
    movies.success && television.success;

  return NextResponse.json(
    {
      success,
      syncedAt: new Date().toISOString(),
      pages,
      results: {
        movies,
        television,
      },
    },
    {
      status: success ? 200 : 500,
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    },
  );
}