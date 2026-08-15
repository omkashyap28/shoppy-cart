import { Heading2 } from "@/components/layout";
import { serverFetch } from "@/lib/serverFetch";
import { Products } from "@/types/product";
import { ProductCard } from "../product-card";

interface RecommendationProps {
  productId: string;
}

export default async function Recommendation({
  productId,
}: RecommendationProps) {
  const response = await serverFetch<Products[]>(
    `/product/${productId}/related`
  );

  return (
    <section id="customer-reviews" className="w-full py-6">
      <Heading2 className="relative border-y border-border bg-background py-2 text-xl md:text-3xl">
        Related Products
      </Heading2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {response.map((product) => (
          <ProductCard product={product} key={product.productId} />
        ))}
      </div>
    </section>
  );
}
