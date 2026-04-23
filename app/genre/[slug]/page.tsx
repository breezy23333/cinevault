type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;

  // use slug below
  return <main>{slug}</main>;
}
