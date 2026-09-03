import { cn } from "@/lib/utils";

export function Heading2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-4 text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}
