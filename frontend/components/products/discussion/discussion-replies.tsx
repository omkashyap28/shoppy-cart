"use client";

import { ReplyType } from "@/types/product";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/layout";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { DiscussionOption } from "./discussion-option";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/store";
import { useState } from "react";
import { DiscussionEditForm } from "./discussion-edit-form";

interface DiscussionRepliesProps {
  productId: string;
  discussionId: string;
  open: boolean;
}

export function DiscussionReplies({
  productId,
  discussionId,
  open,
}: DiscussionRepliesProps) {
  const {
    data: replies,
    isLoading,
    error,
  } = useQuery<ReplyType[]>({
    queryKey: ["discussion-replies", discussionId],
    queryFn: async () => {
      const response = await fetch(
        `/backend/product/${productId}/discussions/${discussionId}/replies`
      );

      if (response.status !== 200) {
        throw Error("Failed to fetch reply replies");
      }

      return await response.json();
    },
    enabled: !!open,
    staleTime: 20 * 60 * 1000,
  });

  if (isLoading) return <Loader />;

  if (error || !replies) {
    return (
      <div className="relative z-10 flex h-36 w-full items-center justify-center rounded-full bg-background/30 p-2">
        <p className="text-muted-foreground">Failed to get product replies</p>
      </div>
    );
  }

  return (
    <Collapsible open={open}>
      <CollapsibleContent>
        <div className="ml-6 w-full divide-y divide-dashed divide-border border-l border-dashed border-border">
          {replies.map((reply) => (
            <DiscussionRepliesItem
              key={reply.replyId}
              reply={reply}
              productId={productId}
              discussionId={discussionId}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DiscussionRepliesItem({
  reply,
  productId,
  discussionId,
}: {
  reply: ReplyType;
  productId: string;
  discussionId: string;
}) {
  const userId = useAppStore((state) => state.userId);
  const [editable, setEditable] = useState(false);

  return (
    <div className="relative flex flex-col items-start p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-10!">
            <AvatarImage
              src={reply.profileImgUrl!}
              alt={`${reply.username} Profile image}`}
            />
            <AvatarFallback>
              <span className="text-xl">{reply.username.charAt(0)}</span>
            </AvatarFallback>
          </Avatar>

          <div className="flex items-start gap-3">
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {reply.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(
                  new Date(reply.createdAt as string).toLocaleDateString(),
                  "PPP"
                )}
              </span>
            </div>
            {reply.isEdited && (
              <Badge
                variant="secondary"
                className="-4 px-1.5 py-0 text-[10px] leading-none"
              >
                Edited
              </Badge>
            )}
          </div>
        </div>
        {reply.userId === userId && (
          <DiscussionOption
            discussionId={reply.replyId}
            productId={productId}
            queryKey={["discussion-replies", discussionId]}
            setEditable={setEditable}
          />
        )}
      </div>
      <div className="mt-4 w-full">
        {!editable ? (
          <p className="wrap-break text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
            {reply.message}
          </p>
        ) : (
          <DiscussionEditForm
            discussionId={reply.replyId}
            message={reply.message}
            productId={productId}
            setEditable={setEditable}
            queryKey={["discussion-replies", discussionId]}
          />
        )}
      </div>
    </div>
  );
}
