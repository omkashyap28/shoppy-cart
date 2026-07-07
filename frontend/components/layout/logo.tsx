import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/">
      <div
        className={cn(
          "flex items-center gap-1 font-sans text-xl font-medium tracking-tighter",
          className
        )}
      >
        <Image
          src="/logo.png"
          alt=""
          className="size-6 dark:invert"
          height={24}
          width={24}
          fetchPriority="high"
          loading="eager"
        />
        Shoppy Cart
      </div>
    </Link>
  );
}
