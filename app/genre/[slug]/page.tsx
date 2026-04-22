// app/genre/[id]/page.tsx
export default function GenrePage({ params }: { params: { id: string } }) {
  return <div className="p-4">Genre #{params.id}</div>;
}

