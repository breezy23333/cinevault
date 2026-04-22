"use client";

import { useEffect, useMemo, useState } from "react";

export default function YouTube({
  id,
  title = "Trailer",
}: { id: string; title?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = useMemo(() => {
    if (!mounted) return "";
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      controls: "1",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  }, [id, mounted]);

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-zinc-800" />}
      {mounted && (
        <iframe
          src={src}
          title={title}
          className="w-full h-full"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}