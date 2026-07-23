import { BackButton } from "./back-btn";

export function PageComponent({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="sticky inset-x-auto top-14 z-8 flex items-center gap-2 bg-background py-2">
        <BackButton />
        <h1 className="font-heading text-lg tracking-tight text-secondary-foreground">
          {heading}
        </h1>
      </div>
      <section className="mt-6">{children}</section>
    </div>
  );
}
