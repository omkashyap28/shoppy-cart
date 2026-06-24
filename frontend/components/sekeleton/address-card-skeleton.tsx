import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AddressCardSkeleton() {
  return <div className="space-y-3">
    <Skeleton className="h-5 w-40" />
    <Card className="space-y-3 p-5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[60%]" />
    </Card>
  </div>
}