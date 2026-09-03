import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface QuantitySelectorProps {
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  min: number;
  max: number;
  bordered?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity = 1,
  onIncrement,
  onDecrement,
  min,
  max,
  bordered = false,
  className,
}: QuantitySelectorProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-border py-px pl-2">
      <span className="pointer-events-none">Quantity</span>
      <div
        className={cn(
          "flex w-fit items-center rounded-lg",
          bordered && "border border-border",
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          disabled={min === quantity}
          onClick={onDecrement}
        >
          <Minus className="size-4" />
        </Button>
        <div
          className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden font-medium"
          aria-live="polite"
          aria-label={`Quantity ${quantity}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              layout
              key={quantity}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="absolute"
            >
              {quantity}
            </motion.span>
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          size="icon"
          disabled={max === quantity}
          onClick={onIncrement}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
