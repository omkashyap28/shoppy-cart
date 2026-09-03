import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ReviewStarsProps {
  ratings: number;
}

export function ReviewStars({ ratings }: ReviewStarsProps) {
  return (
    <div className="mb-4 flex items-center justify-end gap-1">
      {Array.from({ length: 5 }, (_, idx) => (
        <Star
          className={cn(
            "size-4 text-amber-400",
            ratings > idx && "fill-amber-400"
          )}
          key={idx}
        />
      ))}
    </div>
  );
}
