import { AffiliateDashboard } from "@/components/affiliate/affiliate-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Dashboard",
  description: "Track your earnings, referrals, and manage affiliate products.",
  keywords: ["affiliate", "dashboard", "earnings", "referrals"],
};

export default function AffiliateDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <AffiliateDashboard />
    </div>
  );
}
