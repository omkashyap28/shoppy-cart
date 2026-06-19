import {
  Categories,
  Logo,
  MobileMenu,
  Navbar,
  Profile,
  Search,
} from "@/components/layout";

export function Header() {
  return (
    <>
      <header className="mx-auto max-w-640 px-4 sm:px-6 md:px-8 flex h-auto flex-col items-center justify-center sticky top-0 inset-x-auto bg-background z-10">
        <div className="flex items-center justify-between h-14 w-full">
          <div className="flex items-center gap-2 sm:gap-6">
            {/* <MobileMenu /> */}
            <Logo />
            <Navbar />
          </div>
          <div className="flex items-center gap-3">
            <Search />
            <Profile />
          </div>
        </div>
        <Categories />
      </header>
    </>
  );
}
