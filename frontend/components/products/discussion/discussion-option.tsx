"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";

interface DiscussionOptionProps {
  discussionId: string;
  productId: string;
  queryKey?: string[];
  setEditable: (editable: boolean) => void;
}

export function DiscussionOption({
  discussionId,
  productId,
  queryKey,
  setEditable
}: DiscussionOptionProps) {

  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (discussionId: string) => {
      return apiFetch(`product/${productId}/discussions/${discussionId}`, {
        method: "DELETE",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: ["discussions", productId],
        }),
      ]);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setEditable(true)}
          >
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteMutation(discussionId)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
