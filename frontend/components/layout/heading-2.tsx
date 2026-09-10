import { cn } from "@/lib/utils";

export function Heading2({
  className,
  ...props
}: React.ComponentProps<"h2"> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-4 text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}
