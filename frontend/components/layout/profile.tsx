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
import { logout } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AvatarSkeleton } from "../sekeleton/avatar-skeleton";

export function Profile() {
  const user = useAppStore(state => state.user);
  const isAuth = useAppStore((state) => state.isAuth);
  const sellerId = useAppStore((state) => state.sellerId);
  const affiliateCode = useAppStore((state) => state.affiliateCode);
  const router = useRouter();

  if(isAuth && !user) {
    return (
      <Button onClick={() => router.push("/login")}>
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          type="button"
          title="Avatar"
        >
          <Avatar>
            <AvatarImage src={user?.avatarUrl || "/user.png"} alt="Avatar" />
            <AvatarFallback>
              <AvatarSkeleton className="size-8!" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit!">
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
