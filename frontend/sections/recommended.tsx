"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Heading2 } from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import { usePings } from "react-pings";

export function Recommended() {
  const { success } = usePings();

  // Creating an array of 7 items for rendering
  const iterate = Array.from({ length: 7 });

  return (
    <section className="mt-10 mb-6 px-0 sm:px-6 md:px-8">
      <Heading2 className="mb-8">Recommended for you</Heading2>

      {/* Responsive Grid Blueprint:
        - Mobile/Default: 1 column (or 2 if you want small cards, but 1 fits the aspect-7/10 best)
        - sm (640px): 2 columns
        - md (768px): 4 columns (As requested)
        - lg (1024px): 4 columns
        - xl (1280px): 5 columns
        - 2xl (1536px): 7 columns
      */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {iterate.map((_, idx) => (
          <Card
            key={idx}
            className="flex aspect-9/14 flex-col items-stretch justify-between rounded-none p-4 transition-all duration-300 hover:shadow-md"
          >
            <CardTitle className="line-clamp-2 text-left text-xl font-semibold tracking-tight text-foreground">
              30% Off on Home Appliances
            </CardTitle>

            <CardContent className="my-4 flex-1 p-0">
              <div className="grid h-full w-full grid-cols-2 items-center justify-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Link
                    key={num}
                    href="#"
                    className="group relative aspect-square overflow-hidden"
                  >
                    <Image
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      alt={`Product sample ${num}`}
                      className="object-cover object-center"
                      src={`/products/product-${num}.jpg`}
                    />
                  </Link>
                ))}
              </div>
            </CardContent>

            <Link
              href="/"
              className="mt-2 self-start text-sm font-medium text-primary hover:underline"
            >
              Show more
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
