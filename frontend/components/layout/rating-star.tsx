import { LucideProps, Star, StarHalf } from "lucide-react";

interface RatingStarProps extends LucideProps {
  rating: number;
}

export function RatingStar({ rating, ...props }: RatingStarProps) {
  const normalizedRating = rating > 5 ? 4.5 : Math.max(0, rating);

  const fullStars = Math.floor(normalizedRating);
  const decimal = normalizedRating % 1;

  const hasHalfStar = decimal >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;

        if (starNumber <= fullStars) {
          return <Star key={index} {...props} fill="currentColor" />;
        }

        if (starNumber === fullStars + 1 && hasHalfStar) {
          return <StarHalf key={index} {...props} fill="currentColor" />;
        }

        return <Star key={index} {...props} fill="none" />;
      })}
    </div>
  );
}
