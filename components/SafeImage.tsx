"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & { fallback?: string };

export default function SafeImage({ src, fallback = NO_POSTER, ...rest }: Props) {
  const [s, setS] = useState(src || fallback);
  return (
    <Image
      {...rest}
      src={s as any}
      unoptimized
      onError={() => setS(fallback)}
    />
  );
}

/** Simple SVG fallbacks (no files required) */
export const NO_POSTER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 750'>
      <rect width='100%' height='100%' fill='#18181b'/>
      <text x='50%' y='50%' fill='#9ca3af' font-family='Inter,Arial' font-size='24'
            dominant-baseline='middle' text-anchor='middle'>No Poster</text>
    </svg>`
  );

export const NO_PROFILE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 220'>
      <rect width='100%' height='100%' fill='#18181b'/>
      <text x='50%' y='50%' fill='#9ca3af' font-family='Inter,Arial' font-size='12'
            dominant-baseline='middle' text-anchor='middle'>No Image</text>
    </svg>`
  );
