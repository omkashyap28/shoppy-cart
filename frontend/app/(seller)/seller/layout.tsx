import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
