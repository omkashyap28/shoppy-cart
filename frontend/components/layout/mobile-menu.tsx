"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export function MobileMenu() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    (() => {
      setCurrentDate(String(new Date().getFullYear())); 
    })();
  });

  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted"
            aria-label="Open navigation menu"
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="h-0.5 w-5 rounded bg-foreground" />
              <div className="h-0.5 w-5 rounded bg-foreground" />
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-70 rounded-r-xl border-r border-border bg-background/95 p-0 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <SheetHeader className="border-b border-border px-6 py-5 text-left">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              <Logo />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigate around the site
            </SheetDescription>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex flex-col px-4 py-5">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="group transiton-all relative flex h-full items-center px-3 py-2 text-lg font-medium text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="underline-offset-2 group-hover:underline">
                    {link.label}
                  </span>
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* Optional footer */}
          <div className="absolute inset-x-0 bottom-0 border-t border-border p-6">
            <p className="text-xs text-muted-foreground">
              © {currentDate} Shoppy Cart
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
