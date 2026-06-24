"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className={cn("size-8 rounded-full", className)}
    >
      <ArrowLeft className="size-5" />
    </Button>
  );
}
