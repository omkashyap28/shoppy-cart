import { Skeleton } from "@/components/ui/skeleton";
import { AddressCardSkeleton } from "./";
import { AvatarSkeleton } from "./avatar-skeleton";

export function ProfileCardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {/* Profile Header */}
      <div className="flex items-center gap-5">
        <AvatarSkeleton />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>

      {/* Edit button */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Address Section */}
      <AddressCardSkeleton />

      {/* User Details */}
      <div className="space-y-5">
        <Skeleton className="h-5 w-32" />

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>

      {/* Security */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />

        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />

        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="mx-auto h-4 w-72" />
      </div>
    </div>
  );
}
