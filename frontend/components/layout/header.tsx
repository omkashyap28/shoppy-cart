import {
  Logo,
  MobileMenu,
  Navbar,
  Profile,
  Search,
  Theme,
} from "@/components/layout";
import { AvatarSkeleton } from "@/components/sekeleton";
import { Suspense } from "react";

export function Header() {
  return (
    <>
      <header className="sticky inset-x-auto top-0 z-12 mx-auto flex h-auto max-w-640 flex-col items-center justify-center border-b border-border bg-background px-4 sm:px-6 md:px-8">
        <div className="flex h-14 w-full items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6">
            <MobileMenu />
            <Logo />
            <Navbar />
          </div>
          <div className="flex items-center gap-3">
            <Search />
            <Theme />
            <Suspense fallback={<AvatarSkeleton />}>
              <Profile />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
}
