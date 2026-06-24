"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, CopyCheckIcon } from "lucide-react";
import { Button } from "../ui/button";

export function CopyButton({
  copyValue,
  size,
  className,
  varient = "ghost",
  ...props
}: {
  copyValue: string;
  size?: string;
  className?: string;
  varient?: "ghost" | "outline";
  props?: React.ComponentProps<"button">;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsCopied(true);

    await window.navigator.clipboard.writeText(value);
    timerRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Button
      variant={varient}
      disabled={isCopied}
      aria-disabled={isCopied}
      onClick={() => handleCopy(copyValue)}
      className={cn("h-fit w-fit p-2", className)}
      {...props}
    >
      {isCopied ? (
        <Check className={size || "size-3"} />
      ) : (
        <Copy className={size || "size-3"} />
      )}
    </Button>
  );
}
