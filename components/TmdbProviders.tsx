// components/TmdbProviders.tsx
type Pv = {
  flatrate?: { provider_id: number; provider_name: string }[];
  rent?:     { provider_id: number; provider_name: string }[];
  buy?:      { provider_id: number; provider_name: string }[];
  free?:     { provider_id: number; provider_name: string }[];
  ads?:      { provider_id: number; provider_name: string }[];
};

export default function TmdbProviders({ pv }: { pv?: Pv }) {
  if (!pv) return <p className="opacity-70">No provider data for this region.</p>;

  const groups = [
    { label: "Streaming", items: pv.flatrate },
    { label: "Rent",      items: pv.rent },
    { label: "Buy",       items: pv.buy },
    { label: "Free",      items: pv.free },
    { label: "With Ads",  items: pv.ads },
  ].filter(g => g.items?.length);

  if (!groups.length) return <p className="opacity-70">No provider data for this region.</p>;

  return (
    <div className="space-y-3">
      {groups.map(g => (
        <div key={g.label}>
          <h3 className="font-semibold">{g.label}</h3>
          <ul className="flex flex-wrap gap-2 mt-1">
            {g.items!.map(p => (
              <li key={p.provider_id} className="rounded-full border border-zinc-700 px-3 py-1 text-sm">
                {p.provider_name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}