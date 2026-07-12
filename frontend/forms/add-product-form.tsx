"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  FieldGroup,
  Field,
  FieldSeparator,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ProductImageUpload } from "@/components/products";
import { UploadedItems } from "@/types/product";
import { Spinner } from "@/components/ui/spinner";
import { usePings } from "react-pings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories } from "@/constants";

export function AddProductForm() {
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const sellerId = useAppStore((state) => state.sellerId);
  const [uploadedItems, setUploadedItems] = useState<UploadedItems[]>([]);
  const pings = usePings();

  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      brandName: "",
      categoryId: "",
      description: "",
      productAttributes: [],
      price: 0,
      quantity: 0,
      productImages: [],
      tags: [],
    },
  });

  useEffect(() => {
    form.setValue(
      "productImages",
      uploadedItems.map((item) => ({
        imageId: item.imageId,
        imageUrl: item.imageUrl,
        thumbnailUrl: item.thumbnailUrl,
        priority: item.priority,
        isThumbnail: item.isThumbnail,
      })),
      { shouldValidate: true, shouldDirty: true }
    );
  }, [uploadedItems, form]);

  async function onSubmit(data: z.infer<typeof addProductSchema>) {
    const formData = {
      ...data,
      categoryId: Number(data.categoryId),
      tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      setLoading(true);

      const response = await apiFetch(`seller/${sellerId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status !== 201) {
        throw new Error("Failed to create product");
      }

      pings.success("Product created successfully");
      localStorage.removeItem("uploadProductsImages");

      return await response.json();
    } catch (e) {
      pings.error("Failed to add product");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <ProductImageUpload
          uploadedItems={uploadedItems}
          setUploadedItems={setUploadedItems}
        />
        {form.formState.errors.productImages && (
          <FieldError>
            {form.formState.errors.productImages.message as string}
          </FieldError>
        )}
      </div>

      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="brandName"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="brand-name">Brand Name</FieldLabel>
                <Input
                  {...field}
                  id="brand-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Brand name"
                />
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Product Description
                </FieldLabel>
                <Textarea
                  className="h-22 resize-none"
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your product description"
                />
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            name="categoryId"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Product Category</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={field.disabled}
                >
                  <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      productCategories.map(({value, title}, idx) => (
                        <SelectItem value={value} key={idx}>{title}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            name="price"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">Product Price</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Product price"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      Number.isNaN(e.target.valueAsNumber)
                        ? 0
                        : e.target.valueAsNumber
                    )
                  }
                />
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            name="quantity"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="quantity">Product Quantity</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="quantity"
                  aria-invalid={fieldState.invalid}
                  placeholder="Product quantity"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      Number.isNaN(e.target.valueAsNumber)
                        ? 0
                        : e.target.valueAsNumber
                    )
                  }
                />
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <Controller
            name="tags"
            control={form.control}
            disabled={loading}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tags">Product Tags</FieldLabel>
                <Input
                  id="tags"
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                  placeholder="Product tags (comma separated)"
                  value={field.value?.join(",") ?? ""}
                  onChange={(e) => field.onChange(e.target.value.split(","))}
                />
                <FieldError>
                  {fieldState.error ? fieldState.error.message : null}
                </FieldError>
              </Field>
            )}
          />
          <FieldSeparator />
          <Field>
            <Button disabled={loading} type="submit">
              {loading && <Spinner />}
              Submit Product
            </Button>
            <Button
              onClick={() => {
                form.reset();
                setUploadedItems([]);
              }}
              type="button"
              variant="outline"
            >
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
