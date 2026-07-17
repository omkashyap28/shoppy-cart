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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/")}>
              <Image
                src="/logo.png"
                alt=""
                className="size-6 dark:invert"
                height={24}
                width={24}
                fetchPriority="high"
                loading="eager"
              />
              <span className="text-xl font-medium tracking-tighter">
                Shoppy Cart
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton>
            <Settings className="size-5!" />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
