"use client";

import {
  HeartIcon,
  LayoutDashboardIcon,
  List,
  LogInIcon,
  LogOutIcon,
  ShoppingCart,
  User2Icon,
  Wallet2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiFetch, logout } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export function Profile() {
  const userId = useAppStore((state) => state.userId);
  const isAuth = useAppStore((state) => state.isAuth);
  const sellerId = useAppStore((state) => state.sellerId);
  const affiliateCode = useAppStore((state) => state.affiliateCode);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["user", userId],
    staleTime: Infinity,
    queryFn: async () => {
      const fetchResponse = await apiFetch(`user/${userId}`);
      const data = await fetchResponse.json();
      return data;
    },
    enabled: !!userId
  });

  useEffect(() => {
    if (data?.avatarUrl) setAvatarUrl(data.avatarUrl);
  }, [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          type="button"
          title="Profile"
        >
          <Avatar>
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>
              <User2Icon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit!">
        {isAuth && userId ? (
          <>
            <DropdownMenuGroup>
              {menuItems.map(({ title, icon, titleProp, href }) => (
                <Link href={href} key={title} title={titleProp}>
                  <DropdownMenuItem>
                    {icon}
                    {title}
                  </DropdownMenuItem>
                </Link>
              ))}
              {sellerId != "" ? (
                <Link href="/seller/dashboard" title="Dashboard">
                  <DropdownMenuItem>
                    <LayoutDashboardIcon />
                    Seller Dashboard
                  </DropdownMenuItem>
                </Link>
              ) : affiliateCode != "" ? (
                <Link href="/affiliate/dashboard" title="Dashboard">
                  <DropdownMenuItem>
                    <LayoutDashboardIcon />
                    Affiliate Dashboard
                  </DropdownMenuItem>
                </Link>
              ) : (
                <></>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
              title="Sign Out"
            >
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/login")} title="Login">
            <LogInIcon />
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const menuItems = [
  {
    title: "Profile",
    icon: <User2Icon />,
    titleProp: "Profile",
    href: "/profile",
  },
  {
    title: "Cart",
    icon: <ShoppingCart />,
    titleProp: "Cart",
    href: "/cart",
  },
  {
    title: "Wishlist",
    icon: <HeartIcon />,
    titleProp: "Wishlist",
    href: "/wishlist",
  },
  {
    title: "Order",
    icon: <List />,
    titleProp: "Order",
    href: "/orders",
  },
  {
    title: "Wallet",
    icon: <Wallet2 />,
    titleProp: "Wallet",
    href: "/wallet",
  },
];
