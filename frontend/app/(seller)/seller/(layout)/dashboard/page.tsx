import { Metadata } from "next";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "../../data.json";
import { SiteContent } from "@/components/site-content";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description:
    "Seller dashboard which provides various functionalitis to single place from where seller can track his sales, growth, add products, delete products reply to discussions and read reviews and ratings",
  keywords: ["seller", "dashboard"],
};

export default function Page() {
  return (
    <SiteContent title="Seller Dashboard">
      <div className="flex flex-col gap-4">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </SiteContent>
  );
}
