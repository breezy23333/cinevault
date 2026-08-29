import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Your Profile",
  description:
    "Customize your CINRYVAN profile, manage your favourites, watchlist, activity and notifications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}