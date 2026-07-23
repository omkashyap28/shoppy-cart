import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import { Metadata } from "next";
import "../node_modules/react-pings/dist/index.css";
import { Auth } from "@/components/layout";
import { GlobalProvider } from "@/providers/global-provider";

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
  keywords: ["e-commerce", "shopping", "online", "online-shop", "shoppy-cart"],
  metadataBase: "http://localhost:3000",
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
        "antialiased selection:bg-primary selection:text-white",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body cz-shortcut-listen="true">
        <GlobalProvider>
          {children}
          <Auth />
        </GlobalProvider>
      </body>
    </html>
  );
}
