import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Theme } from "./layout";

export function SiteContent({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <div className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-1 md:gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="my-2 data-[orientation=vertical]:h-6"
            />
            <h1 className="text-base font-medium">{title}</h1>
          </div>
          <Theme />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full p-4 md:gap-6 md:p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
