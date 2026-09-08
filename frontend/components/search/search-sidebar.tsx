"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Star } from "lucide-react";

const MIN_PRICE = 50;
const MAX_PRICE = 10000;

export function SearchSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);

  const [inStock, setInStock] = useState(false);
  const [rating, setRating] = useState("all");

  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice"));
    const maxPrice = Number(searchParams.get("maxPrice"));

    (() => {
      setPrice([
        Number.isFinite(minPrice) && minPrice >= MIN_PRICE
          ? minPrice
          : MIN_PRICE,

        Number.isFinite(maxPrice) && maxPrice <= MAX_PRICE
          ? maxPrice
          : MAX_PRICE,
      ]);

      setInStock(searchParams.get("inStock") === "true");
      setRating(searchParams.get("rating") ?? "all");
    })();
  }, [searchParams]);

  const updateQueryParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (price[0] > MIN_PRICE) {
      params.set("minPrice", price[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (price[1] < MAX_PRICE) {
      params.set("maxPrice", price[1].toString());
    } else {
      params.delete("maxPrice");
    }

    if (inStock) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    if (rating !== "all") {
      params.set("rating", rating);
    } else {
      params.delete("rating");
    }

    params.delete("page");
    params.delete("cursor");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("inStock");
    params.delete("rating");
    params.delete("page");
    params.delete("cursor");

    setPrice([MIN_PRICE, MAX_PRICE]);
    setInStock(false);
    setRating("all");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Sidebar className="relative! h-fit!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-2 py-1 text-base font-semibold">
            Search Filters
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-6 p-4">
          {/* Price */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Price</h3>
              <p className="text-xs text-muted-foreground">
                Choose your price range
              </p>
            </div>

            <Slider
              value={price}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              onValueChange={(value) => {
                setPrice(value as [number, number]);
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="min-price">Minimum</Label>
                <Input
                  id="min-price"
                  type="number"
                  min={MIN_PRICE}
                  max={price[1]}
                  value={price[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setPrice([
                      Math.min(Math.max(value, MIN_PRICE), price[1]),
                      price[1],
                    ]);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-price">Maximum</Label>
                <Input
                  id="max-price"
                  type="number"
                  min={price[0]}
                  max={MAX_PRICE}
                  value={price[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setPrice([
                      price[0],
                      Math.max(Math.min(value, MAX_PRICE), price[0]),
                    ]);
                  }}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Availability */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Availability</h3>
              <p className="text-xs text-muted-foreground">
                Filter products by stock
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="in-stock" className="cursor-pointer font-normal">
                Only show in-stock products
              </Label>

              <Switch
                id="in-stock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">Rating</h3>
              <p className="text-xs text-muted-foreground">
                Show products with a minimum rating
              </p>
            </div>

            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Any rating</SelectItem>
                <SelectItem value="4">4stars & above</SelectItem>
                <SelectItem value="3">3stars & above</SelectItem>
                <SelectItem value="2">2stars & above</SelectItem>
                <SelectItem value="1">1stars & above</SelectItem>
              </SelectContent>
            </Select>
          </section>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>

              <Button onClick={updateQueryParams}>Apply Filters</Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
