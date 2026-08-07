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
import { MessageCircle, Send } from "lucide-react";
import { productDiscussionSchema } from "@/schemas";
import { apiFetch } from "@/lib/utils";
import { usePings } from "react-pings";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

type ProductDiscussionReplySchema = z.infer<typeof productDiscussionSchema>;

interface DiscussionReplyFormProps {
  productId: string;
  discussionId: string;
  replyTo: string;
}

export function DiscussionReplyForm({
  productId,
  discussionId,
  replyTo,
}: DiscussionReplyFormProps) {
  const queryClient = useQueryClient();
  const pings = usePings();

  const [open, setOpen] = useState(false);

  const form = useForm<ProductDiscussionReplySchema>({
    resolver: zodResolver(productDiscussionSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutate, status } = useMutation({
    mutationFn: async (data: ProductDiscussionReplySchema) => {
      const payload = {
        message: data.message,
      };

      const response = await apiFetch(
        `product/${productId}/discussions/${discussionId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to add user reply");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussion-replies", discussionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["discussions", productId],
      });
      setOpen(false);
      form.reset();
    },
    onError: (e: unknown) => {
      console.error(e);
      pings.error("Failed to add user reply");
    },
  });

  const onSubmit = async (data: ProductDiscussionReplySchema) => {
    mutate(data);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <MessageCircle />
          <span className="ml-0.5">Reply</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full max-w-md md:w-md">
        <PopoverHeader>
          <PopoverTitle>Reply to {replyTo}</PopoverTitle>
          <PopoverDescription>
            Replying to this message can help resolve the issue faster.
          </PopoverDescription>
        </PopoverHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Controller
            control={form.control}
            name="message"
            render={({ field }) => (
              <InputGroup>
                <InputGroupTextarea
                  id="block-end-textarea"
                  placeholder="Write a comment..."
                  autoFocus
                  autoCapitalize="on"
                  {...field}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton
                    disabled={!form.formState.isDirty || status === "pending"}
                    variant="default"
                    size="sm"
                    className="ml-auto"
                    type="submit"
                  >
                    {status === "pending" ? <Spinner /> : <Send />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            )}
          />
        </form>
      </PopoverContent>
    </Popover>
  );
}
