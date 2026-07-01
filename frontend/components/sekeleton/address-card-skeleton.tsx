import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AddressCardSkeleton() {
  return <div className="space-y-3 overflow-hidden">
    <Skeleton className="h-5 w-40" />
    <Card className="flex items-center gap-3 overflow-hidden">
      <Skeleton className="h-28 aspect-rectangle flex-1" />
      <Skeleton className="h-28 aspect-rectangle flex-1" />
    </Card>
  </div>
}