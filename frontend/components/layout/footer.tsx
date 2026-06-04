"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "./logo";
import {
  footerLinksSection1,
  footerLinksSection2,
  footerLinksSection3,
  footerLinksSection4,
} from "@/constants";
import React from "react";

export function Footer() {
  const handleClick = () => {
    document.body.scroll({
      top: 0,
      behavior: "smooth",
    });
    document.documentElement.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full">
      <div className="w-full">
        <Button
          onClick={handleClick}
          className="mb-7 h-12 w-full rounded-none bg-input text-foreground hover:bg-transparent"
        >
          Go to Top
        </Button>
      </div>
      <Logo />
      <div className="py-8 md:px-5">
        <div className="grid font-sans text-sm font-normal sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mt-4 mb-2 text-[15px] font-semibold tracking-tight">
              Categories
            </h4>
            <ul className="flex flex-col gap-1.5">
              {footerLinksSection1.map(({ label, href }) => (
                <li key={label}>
                  <LinkItem href={href}>{label}</LinkItem>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mt-4 mb-2 text-[15px] font-semibold tracking-tight">
              User Stuff
            </h4>
            <ul className="flex flex-col gap-1.5">
              {footerLinksSection2.map(({ label, href }) => (
                <li key={label}>
                  <LinkItem href={href}>{label}</LinkItem>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mt-4 mb-2 text-[15px] font-semibold tracking-tight">
              Earnings
            </h4>
            <ul className="flex flex-col gap-1.5">
              {footerLinksSection3.map(({ label, href }) => (
                <li key={label}>
                  <LinkItem href={href}>{label}</LinkItem>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mt-4 mb-2 text-[15px] font-semibold tracking-tight">
              Also Check
            </h4>
            <ul className="flex flex-col gap-1.5">
              {footerLinksSection4.map(({ label, href }) => (
                <li key={label}>
                  <LinkItem href={href}>{label}</LinkItem>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-7 w-full border-t border-muted py-2 text-center text-sm font-light tracking-tight">
          &copy; All rights reserved for Shoppy Cart
        </div>
      </div>
    </footer>
  );
}

function LinkItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="underline-offset-1 transition-all duration-100 hover:underline max-sm:text-center"
    >
      {children}
    </Link>
  );
}
