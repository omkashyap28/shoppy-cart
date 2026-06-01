"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { navLinks } from "@/constants"

export function Navbar() {
  return (
    <NavigationMenu className="hidden sm:flex">
      <NavigationMenuList className="gap-1">
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} rounded-md px-3 py-1.5`}
            >
              <Link href={link.href}>{link.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
