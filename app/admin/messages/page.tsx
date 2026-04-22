// app/admin/messages/page.tsx
import { prisma, } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import Link from "next/link";

const fmt = new Intl.DateTimeFormat("en-ZA", {
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false,
});

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

type PageProps = {
  searchParams: {
    q?: string;
    cursor?: string;        // last seen id (number as string)
    dir?: "next" | "prev";  // which direction to page
  };
};

export default async function AdminMessages({ searchParams }: PageProps) {
  const q = (searchParams.q || "").trim();
  const dir: "next" | "prev" = (searchParams.dir as any) === "prev" ? "prev" : "next";
  const cursorId = Number(searchParams.cursor || 0) || undefined;

  // --- Typed search filter
  const where: Prisma.ContactMessageWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { subject: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  // --- Cursor pagination without negative `take`
  // newest first (id desc). For "next", fetch ids < cursor (older).
  // For "prev", fetch ids > cursor (newer), then still order desc.
  let extraIdFilter: Prisma.IntFilter | undefined = undefined;
  if (cursorId) {
    extraIdFilter = dir === "next" ? { lt: cursorId } : { gt: cursorId };
  }

  const items = await prisma.contactMessage.findMany({
    where: extraIdFilter ? { ...where, id: extraIdFilter } : where,
    orderBy: { id: "desc" },
    take: PAGE_SIZE,
  });

  // Cursors for links (still newest→oldest view)
  const prevCursor = items.length ? items[0].id : undefined;                    // first row id (newest in this page)
  const nextCursor = items.length ? items[items.length - 1].id : undefined;     // last row id (oldest in this page)

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Contact Messages</h1>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2" action="/admin/messages" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, subject…"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none"
            />
            <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">Search</button>
          </form>
          <Link
            href={`/api/admin/messages/export${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          >
            Export CSV
          </Link>
          <Link href="/" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
            Back to site
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-zinc-500">No messages.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900/60">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email / Phone</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>IP</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-zinc-900/30">
                {items.map((m) => (
                  <tr key={m.id} className="[&>td]:px-4 [&>td]:py-3 align-top">
                    <td title={m.createdAt.toISOString()}>
                      {format(m.createdAt, "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="font-medium">{m.name}</td>
                    <td>
                      <div>{m.email}</div>
                      <div className="text-zinc-400">{m.phone || "—"}</div>
                    </td>
                    <td className="font-medium">{m.subject}</td>
                    <td className="max-w-[40ch] whitespace-pre-wrap text-zinc-200">{m.message}</td>
                    <td className="text-zinc-400">{m.ip || "—"}</td>
                    <td className="text-right">
                      <form
                        action={`/api/admin/messages/${m.id}`}
                        method="post"
                        onSubmit={(e) => {
                          // runs in browser
                          // eslint-disable-next-line no-alert
                          if (!confirm("Delete this message?")) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="_method" value="DELETE" />
                        <button className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-zinc-500">Showing {items.length} results</div>
            <div className="flex items-center gap-2">
              <Link
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
                href={`/admin/messages?dir=prev${q ? `&q=${encodeURIComponent(q)}` : ""}${
                  prevCursor ? `&cursor=${prevCursor}` : ""
                }`}
              >
                ◀ Prev
              </Link>
              <Link
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800"
                href={`/admin/messages?dir=next${q ? `&q=${encodeURIComponent(q)}` : ""}${
                  nextCursor ? `&cursor=${nextCursor}` : ""
                }`}
              >
                Next ▶
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
