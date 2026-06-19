import { cn } from "@/lib/utils";

export function Heading3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("mb-2 text-lg font-medium text-foreground", className)}>
      {children}
    </h3>
  );
}
