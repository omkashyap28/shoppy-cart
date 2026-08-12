"use client";

import { createReview } from "@/actions/reviewActions";
import { ReviewImageUpload } from "@/components/products/review/review-image-upload";
import { ReviewRating } from "@/components/products/review/review-rating";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { reviewSchema } from "@/schemas/review-schema";
import { useAppStore } from "@/store/store";
import { ReviewImageType } from "@/types/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { usePings } from "react-pings";
import z from "zod";

type ReviewSchema = z.infer<typeof reviewSchema>;

const MAXLENGHT = 200;

export function AddReviewForm({ className }: { className: string }) {

  const [uploadedImages, setUploadedImages] = useState<ReviewImageType[]>([]);

  const { productId } = useParams<{ productId: string }>();
  const userId = useAppStore((state) => state.userId);
  const accessToken = useAppStore((state) => state.accessToken);
  const pings = usePings();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      message: "",
      rating: 0,
      reviewImages: [],
    },
  });

  useEffect(() => {
    form.setValue("reviewImages", uploadedImages);
  }, [uploadedImages, form])

  const onSubmit = (data: ReviewSchema) => {
    startTransition(async () => {

      const payload = {
        userId,
        message: data.message,
        rating: data.rating,
        reviewImages: data.reviewImages,
      };

      try {
        await createReview(productId, payload, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        form.reset();
        router.replace(`/products/${productId}`);

      } catch (error) {
        pings.error("Failed to create review");
        throw error;
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <FieldGroup>
        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <ReviewRating
              onChange={field.onChange}
              value={field.value}
              disabled={
                field.disabled || isPending
              }
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="review-message">Review Message</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="review-message"
                  maxLength={MAXLENGHT}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={
                    fieldState.error ? "textarea-error" : "textarea-counter"
                  }
                  placeholder={`What did you like or dislike?`}
                  disabled={
                    field.disabled || isPending
                  }
                  {...field}
                />
                <InputGroupAddon align="block-end">
                  <span className="text-sm">
                    {field.value?.length}/{MAXLENGHT}
                  </span>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Add Photos (optional)</FieldLabel>
          <ReviewImageUpload
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </Field>

        <Field>
          <Button
            className="w-full"
            size="default"
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </Button>
          <FieldDescription>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius sed 
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
