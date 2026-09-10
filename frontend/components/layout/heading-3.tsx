import { cn } from "@/lib/utils";

export function Heading3({
  className,
  ...props
}: React.ComponentProps<"h3"> & {
  className?: string;
}) {
  return (
    <h3
      className={cn("mb-2 text-lg font-medium text-foreground", className)}
      {...props}
    />
  );
}
