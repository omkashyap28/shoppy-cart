import { Geist, Geist_Mono, Outfit } from "next/font/google"

import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable)}
    >
      <body cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  )
}
