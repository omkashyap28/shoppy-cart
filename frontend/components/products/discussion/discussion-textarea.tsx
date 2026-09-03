"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDiscussionSchema } from "@/schemas";
import z from "zod";
import { apiFetch, cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ProductDiscussionProps {
  productId: string;
  className?: string;
}

type ProductDiscussionSchema = z.infer<typeof productDiscussionSchema>;

export function DiscussionTextarea({
  productId,
  className,
}: ProductDiscussionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const pings = usePings();

  const form = useForm<ProductDiscussionSchema>({
    resolver: zodResolver(productDiscussionSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: ProductDiscussionSchema) => {
      setIsSubmitting(true);

      const payload = {
        message: data.message,
      };

      const response = await apiFetch(`product/${productId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 201) {
        throw new Error("Failed to add user discussion");
      }

      return await response.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["discussions", productId] });
    },
    onError: (error: unknown) => {
      pings.error("Failed to add discussion");
      console.log("Failed to add user discussion", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ProductDiscussionSchema) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <Card className="max-h-fit w-full">
        <CardHeader className="border-b border-border tracking-tight">
          <CardTitle className="text-lg font-semibold">Ask question</CardTitle>
          <CardDescription>
            Ask your questions about product from seller and other shoppy
            user&#39;s.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <Textarea
                    id="message"
                    placeholder="Write a comment..."
                    className="h-34 resize-none"
                    maxLength={255}
                    {...field}
                  />
                </FieldContent>
                <FieldError
                  className={cn(fieldState.error ? "block" : "hidden")}
                >
                  {fieldState.error?.message}
                </FieldError>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            disabled={isSubmitting || !form.formState.isDirty}
            className="flex items-center gap-1"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Submiting...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Submit</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
