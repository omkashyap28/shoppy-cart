import { Heading2 } from "@/components/layout";
import { ProductCard } from "@/components/products/product-card";
import { serverFetch } from "@/lib/serverFetch";
import { Products } from "@/types/product";

async function getTrendingProducts() {
  "use cache"
  try {
    return await serverFetch<Products[]>(`/search/trendings/products`, {
      next: {
        tags: ["trendings-products"],
      },
      errorMessage: "Failed to get trendings products",
    });
  } catch (e) {
    console.error("ERROR ON TRENDING PRODUCT", e);
  }
}

export async function Trendings() {
  const products = await getTrendingProducts();

  return (
    <section
      className="mt-10 mb-4 scroll-mt-18 px-0 sm:px-6 md:px-8"
      id="trendings"
    >
      <Heading2>Trendings Now</Heading2>
      {!products ? (
        <div className="relative flex h-36 w-full items-center justify-center bg-background p-2">
          <p className="text-sm tracking-tight text-muted-foreground">
            Fail to load trending products.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="relative flex h-36 w-full items-center justify-center bg-background p-2">
          <p className="text-sm tracking-tight text-muted-foreground">
            No trendings exists.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 py-4 max-xs:p-4 sm:grid-cols-3 md:gap-6 md:p-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.productId} />
          ))}
        </div>
      )}
    </section>
  );
}
