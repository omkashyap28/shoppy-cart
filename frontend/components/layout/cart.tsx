import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"

export function Cart() {
  // fetch cart data here

  return (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-8 w-8 rounded-full">
            <ShoppingCart className="size-5 text-neutral-700" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <SheetHeader>
            <SheetTitle>All Cart Items</SheetTitle>
          </SheetHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <p key={index} className="mb-2 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
          <SheetFooter>
            <Button type="submit">Buy All</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
