"use client";

import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { editProductSchema } from "@/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EditIcon } from "lucide-react";

interface SellerProductsType {
  productId: string;
  brandName: string;
  description: string;
  sellerId: string;
  inStock: boolean;
  totalReviews: number;
  averageRating: number;
  categoryId: number;
  price: number;
  coins: number;
  productUrl: string;
  tags: string[];
  quantity: number;
}

type EditProductFormValues = z.infer<typeof editProductSchema>;

interface EditProductPayload extends EditProductFormValues {
  productId: string;
}

interface EditProductDrawerProps {
  product: {
    productId: string;
    description: string;
    quantity: number;
  } | null;
  onClose: () => void;
}

export function EditProduct({ product, onClose }: EditProductDrawerProps) {
  const sellerId = useAppStore((state) => state.sellerId);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const queryClient = useQueryClient();
  const isOpen = !!product;

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      description: product?.description ?? "",
      quantity: product?.quantity ?? 0,
    },
  });

  // Reset form whenever a new product is opened
  useEffect(() => {
    if (product) {
      form.reset({
        description: product.description,
        quantity: product.quantity,
      });
    }
  }, [product, form]);

  const editMutation = useMutation({
    mutationFn: async ({
      productId,
      description,
      quantity,
    }: EditProductPayload) => {
      const response = await apiFetch(
        `seller/${sellerId}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, quantity }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      return { productId, description, quantity };
    },
    onSuccess: ({ productId, description, quantity }) => {
      queryClient.setQueryData<SellerProductsType[]>(
        ["seller-products", sellerId],
        (old) =>
          old?.map((p) =>
            p.productId === productId ? { ...p, description, quantity } : p
          )
      );
      onClose();
    },
    onError: (err: Error) => {
      form.setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
  });

  if (!product) return null;

  const onSubmit = (values: EditProductFormValues) => {
    editMutation.mutate({ productId: product.productId, ...values });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <EditIcon className="size-5" /> Edit product
                </div>
              </DialogTitle>
              <DialogDescription>
                Edit product
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-5">
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="description"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="quantity">quantity</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="quantity"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={editMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  editMutation.isPending ||
                  (!form.formState.isDirty &&
                    form.formState.isSubmitted === false)
                }
              >
                {editMutation.isPending ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="border-none pb-7">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DrawerHeader>
            <DrawerTitle>Edit product</DrawerTitle>
            <DrawerDescription>
              Edit product
            </DrawerDescription>
          </DrawerHeader>

          <FieldGroup className="p-4">
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="description"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="quantity">quantity</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="quantity"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DrawerFooter className="flex-row justify-end gap-2 pt-0">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="ghost"
                disabled={editMutation.isPending}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={
                editMutation.isPending ||
                (!form.formState.isDirty &&
                  form.formState.isSubmitted === false)
              }
            >
              {editMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
