import { Metadata } from "next";
import { ProfileCard } from "./component/profile-card";
import { BackButton } from "@/components/layout";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "User profile page where users can update, delete and views thier profiles.",
  keywords: [
    "e-commerce",
    "shopping",
    "online",
    "online-shop",
    "shoppy-cart",
    "profile",
    "user-profile",
    "profile-page",
    "user-dashboard",
  ],
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-md py-4">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
      </div>
      <div className="mt-6">
        <ProfileCard />
      </div>
    </div>
  );
}
