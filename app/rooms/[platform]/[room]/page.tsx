export default function RoomPage({
  params,
  searchParams,
}: {
  params: { platform: string; room: string };
  searchParams: Record<string, string>;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Room: {params.room}</h1>
      <p className="text-white/70 mt-2">
        Platform: <span className="font-medium">{params.platform}</span>
      </p>
      <div className="mt-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
        <p className="text-white/80">
          This is a placeholder. Drop in your chat provider (e.g. Supabase Realtime, Ably, Liveblocks, or your own
          WS server) here.
        </p>
      </div>
    </main>
  );
}
