import {
  Categories,
  Logo,
  Navbar,
  Profile,
  Search,
  Theme,
} from "@/components/layout";

export function Header() {
  return (
    <>
      <header className="sticky inset-x-auto top-0 z-10 mx-auto flex h-auto max-w-640 flex-col items-center justify-center bg-background px-4 sm:px-6 md:px-8">
        <div className="flex h-14 w-full items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6">
            {/* <MobileMenu /> */}
            <Logo />
            <Navbar />
          </div>
          <div className="flex items-center gap-3">
            <Search />
            <Theme />
            <Profile />
          </div>
        </div>
        <Categories />
      </header>
    </>
  );
}
