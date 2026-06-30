import { Metadata } from "next";
import { ProfileCard } from "./component/profile-card";
import { PageComponent } from "@/components/layout";

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
    <PageComponent heading="Profile">
      <ProfileCard />
    </PageComponent>
  );
}
