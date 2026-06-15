import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import { Metadata } from "next";
import "../node_modules/react-pings/dist/index.css";
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PingsProvider } from "@/providers/pings-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Shoppy Cart",
    default: "Shoppy Cart",
  },
  description:
    "Online e-commerce for all end users to shop anything at anytime",
  applicationName: "Shoppy Cart",
  creator: "Hariom Kashyap",
  category: "e-commerce",
  keywords: ["e-commerce", "shopping", "online", "online-shop", "shoppy-cart"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body cz-shortcut-listen="true">
        <QueryProvider>
          <TooltipProvider>
            <PingsProvider>
              {children}
            </PingsProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
