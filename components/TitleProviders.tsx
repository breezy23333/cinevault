// components/TitleProvider.tsx
type Source = {
  name: string;
  type: string;       // "sub" | "rent" | "buy" | etc.
  region?: string;
  web_url?: string;
  price?: string | number | null;
};

export default function TitleProvider({ sources, region = "ZA" }: { sources: Source[]; region?: string; }) {
  const list = (sources || []).filter(s => !s.region || s.region.toUpperCase() === region.toUpperCase());
  if (!list.length) return <p className="opacity-70">No providers found for this region.</p>;

  return (
    <ul className="space-y-2">
      {list.map((p, i) => (
        <li key={i}>
          <a className="underline hover:opacity-80" href={p.web_url} target="_blank" rel="noopener noreferrer">
            {p.name} — {p.type} {p.price ? `• ${p.price}` : ""}
          </a>
        </li>
      ))}
    </ul>
  );
}