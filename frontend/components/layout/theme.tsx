"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (() => setMounted(true))();
  }, []);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  if (!mounted) return <Skeleton className="size-7! rounded-full!" />;

  return (
    <Button
      variant="outline"
      className="size-7 rounded-full"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="size-4 opacity-60" />
      ) : (
        <Sun className="size-4 opacity-60" />
      )}
    </Button>
  );
}
