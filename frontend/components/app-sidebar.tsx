"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  Settings,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/user.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/seller/dashboard",
      icon: <LayoutDashboardIcon className="size-5!" />,
    },
    {
      title: "Products",
      url: "/seller/products",
      icon: <ListIcon className="size-5!" />,
    },
    {
      title: "Discussion",
      url: "/seller/discussion",
      icon: <ChartBarIcon className="size-5!" />,
    },
    {
      title: "Reviews",
      url: "/seller/reviews",
      icon: <FolderIcon className="size-5!" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar
      className="sticky! top-14.5! h-[calc(100vh-60px)]"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                router.push("/seller/products/add");
              }}
              tooltip="Add Product"
              className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground active:bg-primary/80"
            >
              <Plus className="size-5!" /> Add Product
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenuButton>
          <Settings className="size-5!" /> Settings
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
