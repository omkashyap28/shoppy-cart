"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { productDiscussionSchema } from "@/schemas";
import { apiFetch } from "@/lib/utils";
import { usePings } from "react-pings";
import { Spinner } from "@/components/ui/spinner";

type ProductDiscussionEditSchema = z.infer<typeof productDiscussionSchema>;

interface DiscussionEditFormProps {
  productId: string;
  discussionId: string;
  message: string;
  setEditable: (editable: boolean) => void;
  queryKey: string[];
}

export function DiscussionEditForm({
  productId,
  discussionId,
  message,
  setEditable,
  queryKey
}: DiscussionEditFormProps) {
  const queryClient = useQueryClient();
  const pings = usePings();

  const form = useForm<ProductDiscussionEditSchema>({
    resolver: zodResolver(productDiscussionSchema),
    defaultValues: {
      message,
    },
  });

  const { mutate, status } = useMutation({
    mutationFn: async (data: ProductDiscussionEditSchema) => {
      const payload = {
        message: data.message,
      };

      const response = await apiFetch(
        `product/${productId}/discussions/${discussionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status !== 202) {
        throw new Error("Failed to update message");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      setEditable(false);
      form.reset();
    },
    onError: (e: unknown) => {
      console.error(e);
      pings.error("Failed to update message");
    },
  });

  const onSubmit = (data: ProductDiscussionEditSchema) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <InputGroup>
        <Controller
          control={form.control}
          name="message"
          render={({ field }) => (
            <InputGroupTextarea
              {...field}
              autoFocus
              autoCapitalize="on"
              disabled={status === "pending"}
            />
          )}
        />

        <InputGroupAddon align="block-end">
          <div className="ml-auto flex items-center gap-2">
            <InputGroupButton
              type="button"
              disabled={status === "pending"}
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset();
                setEditable(false);
              }}
            >
              Discard
            </InputGroupButton>

            <InputGroupButton
              type="submit"
              disabled={status === "pending"}
              variant="default"
              size="sm"
            >
              {status === "pending" ?
                <>
                  <Spinner />
                  <span>Saving...</span>
                </> :
                <>
                  <Save />
                  <span>Save</span>
                </>
              }
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
