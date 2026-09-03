import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ReviewHeaderProps {
  username: string;
  profileImgUrl: string | null;
  createdAt: string;
  edited?: boolean;
}

export function ReviewHeader({
  username,
  createdAt,
  profileImgUrl,
}: ReviewHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="size-10!">
          <AvatarImage
            src={profileImgUrl!}
            alt={`${username} Profile image}`}
          />
          <AvatarFallback>
            <span className="text-xl">{username.charAt(0).toUpperCase()}</span>
          </AvatarFallback>
        </Avatar>

        <div className="flex items-start gap-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {username}
            </span>
            <span
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              {format(
                new Date(createdAt as string).toLocaleDateString(),
                "PPP"
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
