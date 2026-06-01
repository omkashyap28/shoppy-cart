import {
  Cart,
  Categories,
  Logo,
  MobileMenu,
  Navbar,
  Profile,
  Search,
} from "@/components/layout"

export function Header() {
  return (
    <>
      <header className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 max-sm:gap-6">
          <MobileMenu />
          <Logo />
          <Navbar />
        </div>
        <div className="flex items-center gap-3">
          <Search />
          <Cart />
          <Profile />
        </div>
      </header>
      <Categories />
    </>
  )
}
