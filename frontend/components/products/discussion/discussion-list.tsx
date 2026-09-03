"use client";

import { DiscussionType } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { DiscussionListFooter } from "./discussion-list-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DiscussionOption } from "./discussion-option";
import { useAppStore } from "@/store/store";
import { useState } from "react";
import { DiscussionEditForm } from "./discussion-edit-form";

export function DiscussionList({
  discussions,
}: {
  discussions: DiscussionType[];
}) {
  const userId = useAppStore((state) => state.userId);
  const [editable, setEditable] = useState(false);

  if (discussions.length === 0) {
    return (
      <div className="flex h-36 w-full items-center justify-center rounded-lg">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MessageCircle className="size-10 opacity-50" />
          <p className="text-sm">No discussions yet. Be the first to ask!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full divide-y divide-dashed divide-border">
      {discussions.map((discussion) => (
        <div
          key={discussion.discussionId}
          className="relative flex flex-col items-start p-4"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-10!">
                <AvatarImage
                  src={discussion.profileImgUrl!}
                  alt={`${discussion.username} Profile image}`}
                />
                <AvatarFallback>
                  <span className="text-xl">{discussion.username[0]}</span>
                </AvatarFallback>
              </Avatar>

              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    {discussion.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(String(discussion.createdAt), "PPP")}
                  </span>
                </div>
                {discussion.isEdited && (
                  <Badge
                    variant="secondary"
                    className="-4 px-1.5 py-0 text-[10px] leading-none"
                  >
                    Edited
                  </Badge>
                )}
              </div>
            </div>
            {discussion.userId === userId && (
              <DiscussionOption
                discussionId={discussion.discussionId}
                productId={discussion.productId}
                setEditable={setEditable}
              />
            )}
          </div>

          <div className="mt-4 w-full">
            {!editable ? (
              <p className="wrap-break text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {discussion.message}
              </p>
            ) : (
              <DiscussionEditForm
                discussionId={discussion.discussionId}
                message={discussion.message}
                productId={discussion.productId}
                setEditable={setEditable}
                queryKey={["discussions", discussion.productId]}
              />
            )}

            <div className="mt-4">
              <DiscussionListFooter
                repliesCount={discussion.replies}
                productId={discussion.productId}
                discussionId={discussion.discussionId}
                userName={discussion.username}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
