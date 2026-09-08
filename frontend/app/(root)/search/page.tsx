import { Search } from "@/components/search/search";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";
import { PageComponent } from "@/components/layout";
import { SearchSidebar } from "@/components/search/search-sidebar";

interface Props {
  searchParams: Promise<{ query: string } | null>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;

  return {
    title: `Results for: ${params?.query}` || "",
    description: `Search results for ${params?.query}`,
  };
}

export default async function SearchPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
      className="h-fit!"
    >
      <SearchSidebar variant="floating" />
      <SidebarInset className="h-full!">
        <Search />
      </SidebarInset>
    </SidebarProvider>
  );
}
