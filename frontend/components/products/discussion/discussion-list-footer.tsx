"use client";

import { DiscussionReplyForm } from "./discussion-reply-form";
import { DiscussionReplies } from "./discussion-replies";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DiscussionReplyProps {
  repliesCount: number;
  productId: string;
  discussionId: string;
  userName: string;
}

export function DiscussionListFooter({
  repliesCount,
  productId,
  discussionId,
  userName,
}: DiscussionReplyProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-start justify-between">
        <div className="flex items-start gap-0.5">
          {repliesCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-100",
                  open && "-rotate-180"
                )}
              />{" "}
              View replies
            </Button>
          )}
          <DiscussionReplyForm
            discussionId={discussionId}
            productId={productId}
            replyTo={userName}
          />
        </div>
      </div>
      {open && (
        <DiscussionReplies
          productId={productId}
          discussionId={discussionId}
          open={open}
        />
      )}
    </>
  );
}
