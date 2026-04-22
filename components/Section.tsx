// components/Section.tsx
export default function Section({
  title,
  right,
  children,
  className = "",
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={["mt-8", className].join(" ")}>
      <div className="mx-4 md:mx-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {right}
        </div>
        <div className="rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-3 md:p-4">
          {children}
        </div>
      </div>
    </section>
  );
}