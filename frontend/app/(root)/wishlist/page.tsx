import { PageComponent } from "@/components/layout";
import { Wishlist } from "@/components/wishlist/wishlist";

export default function WishlistPage() {
  return (
    <PageComponent heading="Wishlist" className="max-w-lg!">
      <Wishlist />
    </PageComponent>
  );
}
