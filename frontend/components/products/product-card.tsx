import { ProductCardProps } from "@/types/product";
import { Image } from "@imagekit/next";
import { CircleDollarSign, Star } from "lucide-react";
import Link from "next/link";

export function ProductCard({
  product,
  ...props
}: { product: ProductCardProps } & React.ComponentProps<"a">) {
  const {
    averageRating,
    brandName,
    coins,
    description,
    inStock,
    price,
    productId,
    productThumbnail,
    totalReviews,
  } = product;

  return (
    <Link
      href={`/products/${productId}`}
      title={description}
      className="group"
      {...props}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted px-2 sm:px-3">
        <Image
          src={productThumbnail}
          alt={description}
          fill
          sizes="100%"
          className="bg-white object-cover object-center"
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-black uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 p-2 sm:p-3">
        <p className="mt-2 truncate text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {brandName}
        </p>
        <h2 className="group-hover:underline line-clamp-2 min-h-10 text-sm font-medium text-foreground">
          {description}
        </h2>

        <div className="mt-3 flex items-center justify-end gap-1 text-sm text-muted-foreground">
          <Star className="size-4 text-amber-400 fill-current" />
          <span>
            {averageRating?.toFixed(1) ?? "0.0"} ({totalReviews})
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-base font-bold text-foreground">
          <span className="">₹{price}</span> /
          {coins > 0 && (
            <span className="flex items-center gap-0.5">
              <CircleDollarSign className="size-4" /> {coins}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
