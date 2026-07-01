import { Skeleton } from "../ui/skeleton";

export function CartItemsSkeleton() {
  return (
    <div className="relative w-full">
      <div className="flex items-start gap-3">
        <Skeleton className="size-32 rounded-lg" />
        <div>
          <div className="w-auto">
            <Skeleton className="w-22" />

            <Skeleton className="mt-1 w-full" />
            <Skeleton className="w-full" />

            <Skeleton className="mt-2 w-34" />

            {/* Price */}
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="w-28" />
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-13" />
            <Skeleton className="w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
