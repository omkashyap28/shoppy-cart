import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AvatarCard({
  avatarUrl,
  firstName,
  lastName,
  email,
}: {
  avatarUrl: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
}) {
  const [fullScreenPreview, setFullScreenPreview] = useState(false);

  async function handleProfieChange() {}

  return (
    <>
      {fullScreenPreview && (
        <div
          onClick={() => setFullScreenPreview(false)}
          className="fixed inset-0 z-99 flex h-screen w-full items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <Avatar className="size-68 shadow-md">
            <AvatarImage
              src={avatarUrl ?? "/user.png"}
              alt="Profile Image"
              className="bg-background"
            />
          </Avatar>
        </div>
      )}
      <div className="flex items-center gap-5">
        <Avatar className="size-20 md:size-24">
          <AvatarImage
            src={avatarUrl ?? "/user.png"}
            alt="Profile Image"
            onClick={() => setFullScreenPreview(true)}
            className="bg-background"
          />
          <label htmlFor="user-profile-input">
            <AvatarBadge className="z-2! size-6.5! cursor-pointer transition-all duration-150 active:scale-90">
              <Plus className="size-4!" />
            </AvatarBadge>
            <input
              type="file"
              name="user-profile-input"
              id="user-profile-input"
              className="hidden"
              hidden
              aria-hidden
              accept="image/*"
              onChange={handleProfieChange}
            />
          </label>
        </Avatar>
        <div className="flex flex-col items-start">
          <h2 className="-mb-1 text-2xl font-semibold tracking-tight">
            {`${firstName} ${lastName ?? ""}`}
          </h2>
          <div className="font-[14px] tracking-tight">{email}</div>
        </div>
      </div>
    </>
  );
}
