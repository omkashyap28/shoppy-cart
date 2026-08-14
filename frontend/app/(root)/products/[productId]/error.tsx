"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
    <div className="relative z-10 flex w-full flex-col items-center justify-center rounded-full bg-background/30 p-2 py-14">
      <PackageSearch className="size-38 drop-shadow-md" />
      <h1 className="mt-5 text-lg tracking-tight text-muted-foreground">
        Product you try to get is not exists anymore.
      </h1>
      <div className="mt-8 flex items-center gap-2">
        <Button className="shadow" onClick={() => router.push("/products")}>
          Explore Products
        </Button>
        <Button
          className="shadow"
          variant="secondary"
          onClick={() => router.back()}
        >
          <ChevronLeft />
          Go Back
        </Button>
      </div>
    </div>
  );
}
