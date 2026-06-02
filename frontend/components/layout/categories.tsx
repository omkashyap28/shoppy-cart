"use client";

import { useRef } from "react";
import { categories } from "@/constants";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or use your own SVG icons

export function Categories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="group relative h-8 w-full border-y border-border bg-background">
      <div className="relative flex h-full w-full items-center">
        {/* Left Scroll Button & Gradient */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-16 items-center bg-linear-to-r from-background to-transparent pl-2">
          <button
            onClick={() => scroll("left")}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center bg-background text-muted-foreground hover:text-foreground"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>

        {/* Right Scroll Button & Gradient */}
        <div className="pointer-events-none absolute top-0 right-0 z-10 flex h-full w-16 items-center justify-end bg-linear-to-l from-background to-transparent pr-2">
          <button
            onClick={() => scroll("right")}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center bg-background text-muted-foreground hover:text-foreground"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex h-full w-full items-center gap-4 overflow-x-auto px-12"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {categories.map((category, idx) => {
            const slug = category
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replaceAll(" ", "-")
              .replaceAll("--", "-");

            return (
              <Link
                key={idx}
                href={`/categories/${slug}`}
                className="shrink-0 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {category}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
