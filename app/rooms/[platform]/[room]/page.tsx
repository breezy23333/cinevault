import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/userSession";

import MovieRoom from "@/components/rooms/MovieRoom";
import TVRoom from "@/components/rooms/TvRoom";
import AnimeRoom from "@/components/rooms/AnimeRoom";
import CartoonRoom from "@/components/rooms/CartoonRoom";
import SpoilerRoom from "@/components/rooms/SpoilerRoom";
import NewsRoom from "@/components/rooms/NewsRoom";
import GamingRoom from "@/components/rooms/GamingRoom";

export const runtime = "nodejs";

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
    channel?: string | string[];
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

  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Reject repeated channel parameters.
  if (Array.isArray(channel)) {
    notFound();
  }

  const activeChannel =
    channel?.trim().toLowerCase() || "general";

  if (!/^[a-z0-9-]{1,50}$/.test(activeChannel)) {
    notFound();
  }

  const username = (
    user.name?.trim() ||
    user.email.split("@")[0] ||
    "CINRYVAN Member"
  ).slice(0, 40);

  const roomProps = {
    userId: user.id,
    username,
    activeChannel,
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