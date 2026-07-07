"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";

const META_THEME = {
  light: "#FFFFFF",
  dark: "#000000",
};

export function Theme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (() => setMounted(true))();
  }, []);

  useEffect(() => {
    if (!resolvedTheme) return;
    const theme = META_THEME[resolvedTheme as "light" | "dark"];

    let meta = document.querySelector("meta[name='theme-color']");

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.append(meta);
    }

    meta.setAttribute("content", theme);
  }, [resolvedTheme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  if (!mounted) return <Skeleton className="size-7! rounded-full!" />;

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="rounded-full"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="size-4 opacity-40" />
      ) : (
        <Sun className="size-4 opacity-40" />
      )}
    </Button>
  );
}
