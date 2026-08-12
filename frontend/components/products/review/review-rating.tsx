"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewRatingProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string | undefined;
  disabled?: boolean;
}

const RATING_MAP: Record<number, { label: string; colorClass: string; starColorClass: string }> = {
  1: { label: "Terrible", colorClass: "text-red-500 dark:text-red-400", starColorClass: "fill-red-500 text-red-500" },
  2: { label: "Poor", colorClass: "text-orange-500 dark:text-orange-400", starColorClass: "fill-orange-500 text-orange-500" },
  3: { label: "Average", colorClass: "text-amber-500 dark:text-amber-400", starColorClass: "fill-amber-500 text-amber-500" },
  4: { label: "Good", colorClass: "text-lime-500 dark:text-lime-400", starColorClass: "fill-lime-500 text-lime-500" },
  5: { label: "Excellent", colorClass: "text-primary", starColorClass: "fill-primary text-primary" },
};

export function ReviewRating({ value, onChange, error, disabled = false }: ReviewRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const activeRating = hoveredRating !== null ? hoveredRating : value;
  const activeRatingConfig = activeRating > 0 ? RATING_MAP[activeRating] : null;

  const handleKeyDown = (e: React.KeyboardEvent, starIndex: number) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(starIndex);
    } else if (e.key === "ArrowRight" && starIndex < 5) {
      e.preventDefault();
      onChange(starIndex + 1);
    } else if (e.key === "ArrowLeft" && starIndex > 1) {
      e.preventDefault();
      onChange(starIndex - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2 py-2">
      <div
        role="radiogroup"
        aria-label="Product rating selection"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? "rating-error" : undefined}
        className="flex items-center gap-1 sm:gap-2"
        onMouseLeave={() => setHoveredRating(null)}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = activeRating >= starIndex;
          const starConfig = isFilled ? RATING_MAP[activeRating] : null;

          return (
            <motion.button
              key={starIndex}
              type="button"
              role="radio"
              aria-checked={value === starIndex}
              aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""} - ${RATING_MAP[starIndex].label}`}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.15 }}
              whileTap={{ scale: disabled ? 1 : 0.9 }}
              onClick={() => onChange(starIndex)}
              onMouseEnter={() => !disabled && setHoveredRating(starIndex)}
              onFocus={() => !disabled && setHoveredRating(starIndex)}
              onBlur={() => setHoveredRating(null)}
              onKeyDown={(e) => handleKeyDown(e, starIndex)}
              className={cn(
                "relative rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <Star
                className={cn(
                  "size-7 transition-colors duration-200 smsize-8",
                  isFilled && starConfig
                    ? starConfig.starColorClass
                    : "text-muted-foreground/30 dark:text-muted-foreground/20"
                )}
              />
            </motion.button>
          );
        })}
      </div>

      <div className="h-7 min-h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeRatingConfig ? (
            <motion.p
              key={activeRatingConfig.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn("text-base font-semibold tracking-wide", activeRatingConfig.colorClass)}
            >
              {activeRatingConfig.label}
            </motion.p>
          ) : (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              Select a rating
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p id="rating-error" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}