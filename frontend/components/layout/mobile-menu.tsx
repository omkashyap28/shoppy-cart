import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants";
import Link from "next/link";

export function MobileMenu() {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-trasparent hover:bg-transparent"
            aria-label="Open menu"
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="h-0.5 w-5 rounded bg-foreground" />
              <div className="h-0.5 w-5 rounded bg-foreground" />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-90! px-6 pt-12">
          {/* Screen reader friendly title */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
