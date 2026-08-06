import { Spinner } from "../ui/spinner";

export function Loader() {
  return (
    <div className="relative z-10 flex h-36 w-full items-center justify-center rounded-full bg-background/30 p-2">
      <Spinner className="size-8" />
    </div>
  );
}
