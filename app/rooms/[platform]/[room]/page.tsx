import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import MovieRoom from "@/components/rooms/MovieRoom";
import TVRoom from "@/components/rooms/TvRoom";
import AnimeRoom from "@/components/rooms/AnimeRoom";
import CartoonRoom from "@/components/rooms/CartoonRoom";
import SpoilerRoom from "@/components/rooms/SpoilerRoom";
import NewsRoom from "@/components/rooms/NewsRoom";
import GamingRoom from "@/components/rooms/GamingRoom";

export const metadata: Metadata = {
  title: "CINRYVAN Room | Chat",
  description: "Private live CINRYVAN community room.",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{
    platform: string;
    room: string;
  }>;

  searchParams: Promise<{
    channel?: string;
  }>;
};

const validRooms = new Set([
  "movie",
  "tv",
  "anime",
  "cartoons",
  "spoilers",
  "news",
  "gaming",
]);

export default async function RoomPage({
  params,
  searchParams,
}: PageProps) {
  const { platform, room } = await params;
  const { channel } = await searchParams;

  if (platform !== "cinryvan" || !validRooms.has(room)) {
    notFound();
  }

  const cookieStore = await cookies();

  const userId =
    cookieStore.get("cinryvan_user_id")?.value ||
    cookieStore.get("cinryvan_user")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const username = (
    user.name ||
    user.email?.split("@")[0] ||
    "CINRYVAN Member"
  )
    .trim()
    .slice(0, 40);

  const roomProps = {
    userId: user.id,
    username,
    activeChannel:
      typeof channel === "string" && channel.trim()
        ? channel.trim()
        : "general",
  };

  switch (room) {
    case "movie":
      return <MovieRoom {...roomProps} />;

    case "tv":
      return <TVRoom {...roomProps} />;

    case "anime":
      return <AnimeRoom {...roomProps} />;

    case "cartoons":
      return <CartoonRoom {...roomProps} />;

    case "spoilers":
      return <SpoilerRoom {...roomProps} />;

    case "news":
      return <NewsRoom {...roomProps} />;

    case "gaming":
      return <GamingRoom {...roomProps} />;

    default:
      notFound();
  }
}