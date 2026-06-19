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
import { ArrowUp } from "lucide-react";

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
    <footer className="w-full mx-auto max-w-640 px-4 py-8 sm:p-6 md:px-13 mt-18 shadow-xl bg-secondary rounded-t-4xl">
      <div className="w-full flex items-center justify-center pb-10">
        <Button
          variant="outline"
          onClick={handleClick}
          className="w-auto flex items-center gap-1.5 p-2! pr-3 rounded-full"
        >
          <ArrowUp className="size-6" />
          <span className="text-[15px] tracking-tighter">Back to Top</span>
        </Button>
      </div>
      <Logo />
      <div className="py-8">
        <div className="grid font-sans text-sm font-normal sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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
