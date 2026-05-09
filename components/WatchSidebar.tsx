import Link from "next/link";

const platforms = [
  { name: "Netflix", label: "N", href: "#" },
  { name: "Disney+", label: "D+", href: "#" },
  { name: "Prime", label: "P", href: "#" },
  { name: "Apple TV", label: "TV", href: "#" },
  { name: "YouTube", label: "YT", href: "#" },
];

export default function WatchSidebar() {
  return (
    <div className="fixed left-5 top-1/2 z-[90] hidden -translate-y-1/2 lg:flex flex-col items-center gap-3">
      
      {/* top logo */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/30 bg-black/70 text-lg font-black text-yellow-400 shadow-[0_0_30px_rgba(255,184,0,0.2)] backdrop-blur-xl">
        N
      </div>

      {/* line */}
      <div className="h-16 w-px bg-white/10" />

      {/* platform buttons */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/55 p-3 backdrop-blur-xl">
        {platforms.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            title={p.name}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[11px] font-black text-white transition-all duration-300 hover:scale-110 hover:border-yellow-400/40 hover:bg-yellow-400 hover:text-black"
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}