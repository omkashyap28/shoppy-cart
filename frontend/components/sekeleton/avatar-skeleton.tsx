import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("size-20 rounded-full md:size-24", className)} />
  );
}
