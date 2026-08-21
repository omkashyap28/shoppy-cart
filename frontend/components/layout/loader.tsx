import { Spinner } from "../ui/spinner";

export function Loader() {
  return (
    <div className="relative z-10 flex h-[calc(100vh-280px)] w-full items-center justify-center bg-background p-2">
      <Spinner className="size-8" />
    </div>
  );
}
