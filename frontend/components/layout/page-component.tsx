import { cn } from "@/lib/utils";
import { BackButton } from "./back-btn";

export function PageComponent({
  heading,
  children,
  className,
  headingClassName
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div className="sticky inset-x-auto top-14 z-8 flex items-center gap-2 bg-background py-2">
        <BackButton />
        <h1 className={cn("font-heading text-lg tracking-tight text-secondary-foreground", headingClassName)}>
          {heading}
        </h1>
      </div>
      <section className="mt-4">{children}</section>
    </div>
  );
}
