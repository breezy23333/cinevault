// components/NewsCard.tsx
import Link from "next/link";

export default function NewsCard({
  title,
  source,
  href,
}: {
  title: string;
  source: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl bg-zinc-900/40 ring-1 ring-white/10 p-3 hover:bg-zinc-900/60 transition"
    >
      <p className="line-clamp-2 text-sm">{title}</p>
      <p className="mt-1 text-xs text-zinc-400">{source}</p>
    </Link>
  );
}