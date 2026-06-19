"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React, { useRef } from "react";
import Link from "next/link";
import { ShoppingBag, TrendingUp } from "lucide-react";

const productImages = [
  "/products/product-1.jpg",
  "/products/product-2.jpg",
  "/products/product-3.jpg",
  "/products/product-4.jpg",
  "/products/product-5.jpg",
  "/products/product-6.jpg",
];

export function Hero() {
  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrame = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      imageRefs.current.forEach((img) => {
        if (!img) return;

        img.style.transform = `translate3d(${x * 40}px, ${y * 40
          }px, 0) scale(1.08)`;
      });
    });
  };

  const handleMouseLeave = () => {
    imageRefs.current.forEach((img) => {
      if (!img) return;

      img.style.transform = "translate3d(0,0,0) scale(1)";
    });
  };

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-1 h-full w-full bg-black/20`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-10 px-4 max-sm:gap-16">
            <h1 className="md:text-6vw text-center font-sans text-4xl font-semibold tracking-tight text-background text-shadow-lg sm:text-[6vw] lg:text-8xl 2xl:text-9xl">
              Get upto 50% off on your first order
            </h1>
            <div className="pointer-events-auto flex w-full items-center justify-center gap-3 max-xs:flex-col sm:gap-7">
              <Link
                href="/"
                className="rounded-full border-2 border-background bg-background px-5 py-2 text-xl font-semibold tracking-tight text-accent-foreground shadow-md transition-colors duration-200 hover:bg-background/90 max-xs:w-full!"
              >
                <div className="flex items-center gap-2 max-xs:justify-center max-xs:gap-3 sm:gap-3">
                  Trendings <TrendingUp className="size-5" />
                </div>
              </Link>
              <Link
                href="/"
                className="relative overflow-hidden rounded-full border-2 border-background bg-linear-120 from-background/30 to-background/10 px-5 py-2 text-xl font-semibold tracking-tight text-background shadow-md backdrop-blur-md transition-colors duration-200 text-shadow-md hover:bg-background hover:text-accent-foreground hover:text-shadow-none max-xs:w-full!"
              >
                <div className="flex items-center gap-2 max-xs:justify-center max-xs:gap-3 sm:gap-3">
                  Shop Now
                  <ShoppingBag className="size-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Carousel
        opts={{
          loop: true,
        }}
        // eslint-disable-next-line react-hooks/refs
        plugins={[plugin.current]}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
        className="group h-[60vh] max-h-186 w-full overflow-hidden sm:h-[calc(100vh-96px)] md:h-[calc(100vh-96px)] 2xl:max-h-126"
      >
        <CarouselContent className="ml-0 h-[60vh] max-h-186 w-full sm:h-[calc(100vh-96px)] md:h-[calc(100vh-96px)] 2xl:max-h-126">
          {productImages.map((item, idx) => (
            <CarouselItem
              key={idx}
              className="relative h-[60vh] max-h-186 w-full overflow-hidden sm:h-[calc(100vh-96px)] md:h-[calc(100vh-96px)] 2xl:max-h-126"
            >
              <div
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                className="absolute inset-0 transition-transform duration-300 ease-out"
              >
                <Image
                  src={item}
                  alt={`Banner image ${item}`}
                  fill
                  priority={idx === 0}
                  loading="eager"
                  className="object-cover object-center"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
