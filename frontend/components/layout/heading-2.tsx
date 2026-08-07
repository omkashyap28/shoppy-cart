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
      className={cn("mb-4 text-2xl font-semibold text-foreground tracking-tight", className)}
    >
      {children}
    </h2>
  );
}
