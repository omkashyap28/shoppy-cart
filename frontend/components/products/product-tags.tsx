"use client";

import { Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProductTagsProps {
  tags: string[];
  variant?: "secondary" | "outline";
  className?: string;
}

export function ProductTags({
  tags,
  variant = "outline",
  className,
}: ProductTagsProps) {
  const router = useRouter();

  function handleClick(tag: string) {
    const params = new URLSearchParams();
    params.set("q", tag);

    const query = `/search?${params.toString()}`;
    router.push(query);
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-sm font-semibold tracking-tight">Tags</span>
        <Tag className="size-3" />
      </div>
      <Separator orientation="vertical" />
      {tags.map((tag, index) => (
        <Button
          variant={variant}
          size="xs"
          key={index}
          onClick={() => handleClick(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
