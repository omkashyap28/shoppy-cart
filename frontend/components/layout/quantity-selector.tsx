import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

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
        <span className="min-w-10 text-center text-sm">{quantity}</span>
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
