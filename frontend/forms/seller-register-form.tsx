"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { sellerRegistrationFormSchema } from "@/schemas";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/store";
import { apiFetch } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePings } from "react-pings";

const categories = ["ELECTRONICS", "FASHION", "GROCERY", "BOOKS", "FURNITURE"];

export function SellerRegistrationForm() {

  const userId = useAppStore((state) => state.userId);
  const pings = usePings();
  const setLoading = useAppStore(state => state.setLoading)
  const loading = useAppStore(state => state.loading);
  const router = useRouter();

  const form = useForm<z.infer<typeof sellerRegistrationFormSchema>>({
    resolver: zodResolver(sellerRegistrationFormSchema),
    defaultValues: {
      shopName: "",
      description: "",
      category: undefined,
    },
  });


  const onSubmit = async (data: z.infer<typeof sellerRegistrationFormSchema>) => {
    try {
      setLoading(true);

      const formData = {
        userId,
        shopName: data.shopName,
        description: data.description,
        category: data.category,  
      }

      const res = await apiFetch(`auth/seller/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      })

      const responseData = await res.json();

      if (!res.ok) {
        pings.error(responseData.message);
        throw new Error(responseData.message);
      }

      localStorage.setItem("sellerId", responseData.sellerId);
      form.reset();
      pings.success("Shop registered successfully");
      router.push("/seller/dashboard")
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="shopName"
          control={form.control}
          disabled={loading}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="shop-name">Shopname</FieldLabel>
              <Input
                {...field}
                id="shop-name"
                aria-invalid={fieldState.invalid}
                placeholder="Shop name"
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
              <FieldLabel htmlFor="description">Shop Description</FieldLabel>
              <Input
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="Shop description"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="category"
          control={form.control}
          disabled={loading}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category">Shop Category</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category, index) => {
                      return (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Field>
          <Button disabled={loading} aria-disabled={loading} type="submit">Register</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
