"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PersonPhotoHeroProps = {
  name: string;
  images: string[];
  wikidataId?: string | null;
};

type Photo = {
  id: string;
  src: string;
  thumbnail: string;
  caption: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  attribution?: string;
  license?: string;
  licenseUrl?: string;
};

type CommonsImage = {
  url?: string;
  thumburl?: string;
  descriptionurl?: string;
  sha1?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, { value?: string }>;
};

type CommonsResponse = {
  continue?: {
    continue?: string;
    gcmcontinue?: string;
  };
  query?: {
    pages?: Array<{
      pageid: number;
      title: string;
      imageinfo?: CommonsImage[];
    }>;
    categorymembers?: Array<{ title: string }>;
  };
};

type WikidataResponse = {
  entities?: Record<
    string,
    {
      claims?: {
        P373?: Array<{
          rank?: string;
          mainsnak?: {
            datavalue?: { value?: unknown };
          };
        }>;
      };
      sitelinks?: {
        commonswiki?: { title?: string };
      };
    }
  >;
};

const MAX_PHOTOS = 200;
const THUMBNAILS_PER_PAGE = 20;
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

function plainText(value?: string) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function secureUrl(value?: string) {
  if (!value) return undefined;

  try {
    const url = new URL(
      value.startsWith("//") ? `https:${value}` : value,
    );

    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function commonsImageUrl(value?: string) {
  const safe = secureUrl(value);
  if (!safe) return undefined;

  const hostname = new URL(safe).hostname;

  return hostname === "upload.wikimedia.org" ||
    hostname === "thumb.wikimedia.org"
    ? safe
    : undefined;
}

async function requestJson<T>(
  endpoint: string,
  params: Record<string, string>,
  parentSignal: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();

  parentSignal.addEventListener("abort", abort, { once: true });

  if (parentSignal.aborted) controller.abort();

  const timeout = window.setTimeout(abort, 12000);

  try {
    const query = new URLSearchParams({
      format: "json",
      formatversion: "2",
      origin: "*",
      ...params,
    });

    const response = await fetch(`${endpoint}?${query}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Photo request failed: ${response.status}`);
    }

    const data = (await response.json()) as T & {
      error?: { info?: string };
    };

    if (data.error) {
      throw new Error(data.error.info || "Photo source unavailable");
    }

    return data;
  } finally {
    window.clearTimeout(timeout);
    parentSignal.removeEventListener("abort", abort);
  }
}

async function loadCommonsPhotos(
  wikidataId: string,
  limit: number,
  signal: AbortSignal,
  onBatch: (photos: Photo[]) => void,
) {
  const data = await requestJson<WikidataResponse>(
    "https://www.wikidata.org/w/api.php",
    {
      action: "wbgetentities",
      ids: wikidataId,
      props: "claims|sitelinks",
    },
    signal,
  );

  const entity = data.entities?.[wikidataId];

  const categoryClaim = entity?.claims?.P373?.find(
    (claim) =>
      claim.rank !== "deprecated" &&
      typeof claim.mainsnak?.datavalue?.value === "string",
  );

  const categoryValue =
    categoryClaim?.mainsnak?.datavalue?.value;

  const commonsLink = entity?.sitelinks?.commonswiki?.title;

  const rootCategory =
    typeof categoryValue === "string" && categoryValue.trim()
      ? `Category:${categoryValue.replace(/^Category:/i, "").trim()}`
      : commonsLink?.startsWith("Category:")
        ? commonsLink
        : null;

  if (!rootCategory) return;

  const normalize = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[_\s]+/g, " ")
      .trim();

  const rootName = normalize(
    rootCategory.replace(/^Category:/i, ""),
  );

  const queue = [rootCategory];
  const visited = new Set<string>();
  const seenPhotos = new Set<string>();

  let total = 0;
  let requests = 0;

  // Bound metadata requests. Image files load separately as needed.
  while (
    queue.length > 0 &&
    total < limit &&
    requests < 16 &&
    !signal.aborted
  ) {
    const category = queue.shift();
    if (!category || visited.has(category)) continue;

    visited.add(category);

    let continuation: string | undefined;
    let discoverChildren = category === rootCategory;

    do {
      const params: Record<string, string> = {
        action: "query",
        generator: "categorymembers",
        gcmtitle: category,
        gcmtype: "file",
        gcmlimit: "20",
        prop: "imageinfo",
        iiprop: "url|size|mime|sha1|extmetadata",
        iiurlwidth: "1280",
        iiextmetadatalanguage: "en",
      };

      if (continuation) {
        params.gcmcontinue = continuation;
        params.continue = "-||";
      }

      // Inspect direct subcategories once, staying within this person.
      if (discoverChildren) {
        params.list = "categorymembers";
        params.cmtitle = rootCategory;
        params.cmtype = "subcat";
        params.cmlimit = "100";
      }

      const result = await requestJson<CommonsResponse>(
        COMMONS_API,
        params,
        signal,
      );

      requests += 1;

      if (discoverChildren) {
        for (const child of result.query?.categorymembers || []) {
          const normalized = normalize(child.title);

          const unrelatedMedia =
            /\b(albums|singles|songs|logos|signatures|portraits by)\b/i.test(
              child.title,
            );

          if (
            normalized.includes(rootName) &&
            !unrelatedMedia &&
            queue.length < 12
          ) {
            queue.push(child.title);
          }
        }

        discoverChildren = false;
      }

      const batch: Photo[] = [];

      for (const page of result.query?.pages || []) {
        if (total >= limit) break;

        const info = page.imageinfo?.[0];
        if (!info) continue;

        if (
          !["image/jpeg", "image/png", "image/webp"].includes(
            info.mime || "",
          )
        ) {
          continue;
        }

        if (
          Math.max(info.width || 0, info.height || 0) < 500
        ) {
          continue;
        }

        const src = commonsImageUrl(info.thumburl || info.url);
        const sourceUrl = secureUrl(info.descriptionurl);
        const id = info.sha1 || String(page.pageid);
        const metadata = info.extmetadata || {};

        const license = plainText(
          metadata.LicenseShortName?.value,
        );

        // Keep source and licence information with every Commons photo.
        if (!src || !sourceUrl || !license || seenPhotos.has(id)) {
          continue;
        }

        seenPhotos.add(id);

        batch.push({
          id: `commons-${id}`,
          src,
          thumbnail: src,
          caption:
            plainText(metadata.ImageDescription?.value) ||
            page.title
              .replace(/^File:/, "")
              .replace(/\.[^.]+$/, "")
              .replace(/_/g, " "),
          source: "Wikimedia Commons",
          sourceUrl,
          author: plainText(metadata.Artist?.value),
          attribution: plainText(metadata.Attribution?.value),
          license,
          licenseUrl: secureUrl(metadata.LicenseUrl?.value),
        });

        total += 1;
      }

      if (batch.length > 0 && !signal.aborted) {
        onBatch(batch);
      }

      continuation = result.continue?.gcmcontinue;
    } while (
      continuation &&
      total < limit &&
      requests < 16 &&
      !signal.aborted
    );
  }
}

export default function PersonPhotoHero({
  name,
  images,
  wikidataId,
}: PersonPhotoHeroProps) {
  const [extraPhotos, setExtraPhotos] = useState<Photo[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const basePhotos = useMemo<Photo[]>(
    () =>
      Array.from(new Set(images.filter(Boolean)))
        .slice(0, MAX_PHOTOS)
        .map((src, index) => ({
          id: `tmdb-${src}`,
          src,
          thumbnail: src.includes("image.tmdb.org/t/p/")
            ? src.replace(/\/t\/p\/[^/]+\//, "/t/p/w185/")
            : src,
          caption: `${name} — photo ${index + 1}`,
          source: "TMDB",
        })),
    [images, name],
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setExtraPhotos([]);
    setActive(0);
    setBroken(new Set());
    setFailed(false);
    setLoading(false);

    const remaining = MAX_PHOTOS - basePhotos.length;

    if (
      !wikidataId ||
      !/^Q[1-9]\d*$/.test(wikidataId) ||
      remaining < 1
    ) {
      return () => controller.abort();
    }

    setLoading(true);

    void loadCommonsPhotos(
      wikidataId,
      remaining,
      controller.signal,
      (batch) => {
        setExtraPhotos((current) =>
          [...current, ...batch].slice(0, remaining),
        );
      },
    )
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [wikidataId, basePhotos.length, name, retry]);

  const photos = useMemo(() => {
    const unique = new Map<string, Photo>();

    for (const photo of [...basePhotos, ...extraPhotos]) {
      if (!broken.has(photo.src) && !unique.has(photo.src)) {
        unique.set(photo.src, photo);
      }
    }

    return Array.from(unique.values()).slice(0, MAX_PHOTOS);
  }, [basePhotos, extraPhotos, broken]);

  const currentIndex = Math.min(
    active,
    Math.max(0, photos.length - 1),
  );

  const currentPhoto = photos[currentIndex];

  const playing =
    !paused && !hovered && !focused && !reducedMotion;

  useEffect(() => {
    if (!playing || photos.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;

      setActive((current) => (current + 1) % photos.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [playing, photos.length]);

  function move(direction: number) {
    if (photos.length < 2) return;

    setActive(
      (currentIndex + direction + photos.length) % photos.length,
    );
  }

  function markBroken(src: string) {
    setBroken((current) => {
      if (current.has(src)) return current;
      return new Set([...current, src]);
    });
  }

  const thumbnailStart =
    Math.floor(currentIndex / THUMBNAILS_PER_PAGE) *
    THUMBNAILS_PER_PAGE;

  const thumbnails = photos.slice(
    thumbnailStart,
    thumbnailStart + THUMBNAILS_PER_PAGE,
  );

  const controlClass =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full " +
    "border border-white/20 bg-[#111722] text-white transition " +
    "hover:border-yellow-400 hover:text-yellow-300 " +
    "focus-visible:ring-2 focus-visible:ring-yellow-400";

  return (
    <section
      aria-label={`${name} photo gallery`}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#080b11]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-4 sm:px-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            CINRYVAN Photo Archive
          </p>

          <p
            role="status"
            className="mt-2 text-xs text-white/60"
          >
            {photos.length} photos
            {loading ? " · Finding more photographs…" : ""}
          </p>
        </div>

        {photos.length > 1 && (
          <button
            type="button"
            className={controlClass}
            aria-label={
              paused || reducedMotion
                ? "Play slideshow"
                : "Pause slideshow"
            }
            onClick={() => {
              if (reducedMotion) {
                setReducedMotion(false);
                setPaused(false);
              } else {
                setPaused((current) => !current);
              }
            }}
          >
            {paused || reducedMotion ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="relative h-[360px] bg-[#05070d] sm:h-[520px] lg:h-[600px]">
        {currentPhoto ? (
          <Image
            key={currentPhoto.src}
            src={currentPhoto.src}
            alt={currentPhoto.caption}
            fill
            unoptimized
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-contain"
            onError={() => markBroken(currentPhoto.src)}
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-white/50">
            {loading
              ? "Looking for photographs…"
              : "Photographs are not available yet."}
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photograph"
              onClick={() => move(-1)}
              className={`${controlClass} absolute left-3 top-1/2 -translate-y-1/2`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Next photograph"
              onClick={() => move(1)}
              className={`${controlClass} absolute right-3 top-1/2 -translate-y-1/2`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {currentPhoto && (
        <div className="border-t border-white/10 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-lg font-black text-white">
                {name}
              </p>

              <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-white/70">
                {currentPhoto.caption}
              </p>
            </div>

            <p className="shrink-0 text-sm font-bold text-yellow-300">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-5 text-white/55">
            {currentPhoto.sourceUrl ? (
              <a
                href={currentPhoto.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 underline underline-offset-4"
              >
                Source, full caption and credits ↗
              </a>
            ) : (
              <span>{currentPhoto.source}</span>
            )}

            {currentPhoto.author && (
              <span>Photo: {currentPhoto.author}</span>
            )}

            {currentPhoto.licenseUrl ? (
              <a
                href={currentPhoto.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {currentPhoto.license}
              </a>
            ) : (
              currentPhoto.license && (
                <span>{currentPhoto.license}</span>
              )
            )}
          </div>

          {currentPhoto.attribution && (
            <p className="mt-2 break-words text-xs leading-5 text-white/50">
              {currentPhoto.attribution}
            </p>
          )}
        </div>
      )}

      {photos.length > 1 && (
        <div className="border-t border-white/10 p-3 sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {thumbnails.map((photo, offset) => {
              const index = thumbnailStart + offset;

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photograph ${index + 1}`}
                  aria-current={
                    index === currentIndex ? "true" : undefined
                  }
                  className={`relative h-20 w-16 shrink-0 overflow-hidden rounded border transition ${
                    index === currentIndex
                      ? "border-yellow-400"
                      : "border-white/15 hover:border-white/60"
                  }`}
                >
                  <Image
                    src={photo.thumbnail}
                    alt=""
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </button>
              );
            })}
          </div>

          {photos.length > THUMBNAILS_PER_PAGE && (
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                disabled={thumbnailStart === 0}
                onClick={() =>
                  setActive(
                    Math.max(
                      0,
                      thumbnailStart - THUMBNAILS_PER_PAGE,
                    ),
                  )
                }
                className="px-2 py-2 font-bold text-yellow-300 disabled:opacity-30"
              >
                ← Previous 20
              </button>

              <span className="text-white/50">
                {thumbnailStart + 1}–
                {Math.min(
                  thumbnailStart + THUMBNAILS_PER_PAGE,
                  photos.length,
                )}
              </span>

              <button
                type="button"
                disabled={
                  thumbnailStart + THUMBNAILS_PER_PAGE >=
                  photos.length
                }
                onClick={() =>
                  setActive(
                    thumbnailStart + THUMBNAILS_PER_PAGE,
                  )
                }
                className="px-2 py-2 font-bold text-yellow-300 disabled:opacity-30"
              >
                Next 20 →
              </button>
            </div>
          )}
        </div>
      )}

      {failed && (
        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 text-xs text-white/60">
          <span>Some additional photographs could not load.</span>

          <button
            type="button"
            onClick={() => setRetry((current) => current + 1)}
            className="shrink-0 py-2 font-bold text-yellow-300"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}