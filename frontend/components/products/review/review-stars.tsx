import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ReviewStarsProps {
  ratings: number;
}

export function ReviewStars({ ratings }: ReviewStarsProps) {
  return <div className="flex items-center gap-1 mb-4 justify-end">
    {
      Array.from({ length: 5 }, (_, idx) => (
        <Star className={cn("size-4 text-amber-400", ratings > idx && "fill-amber-400")} key={idx} />
      ))
    }
  </div>
}