"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { apiFetch } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { usePings } from "react-pings";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DeleteAccountButton({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [open, setOpen] = useState(false);

  return (
    <>
      <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
        Delete Account
      </FieldSeparator>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="destructive" className="h-10 w-full">
              <Trash2Icon /> Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Delete Account
              </DialogTitle>
              <DialogDescription>
                This action will delete your account permanently. Once it is
                deleted you may lose all your data, if you need some break
                signed out instead of deleting account permanently.
              </DialogDescription>
            </DialogHeader>
            <ConfirmationForm userId={userId} email={email} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button type="button" variant="destructive" className="h-10 w-full">
              <Trash2Icon /> Delete Account
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-none pb-7">
            <DrawerHeader className="text-left">
              <DrawerTitle className="mb-5 text-xl text-destructive">
                Delete Account
              </DrawerTitle>
              <DrawerDescription>
                This action will delete your account permanently. Once it is
                deleted you may lose all your data, if you need some break
                signed out instead of deleting account permanently.
              </DrawerDescription>
            </DrawerHeader>
            <ConfirmationForm userId={userId} email={email} />
            <DrawerFooter>
              <Button
                type="submit"
                form="deleteConfirmationForm"
                variant="destructive"
              >
                <Trash2Icon /> Delete Account
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      <Field>
        <FieldDescription className="my-4 text-center text-destructive">
          Once you delete your account, it may also delete all your personal
          data
        </FieldDescription>
      </Field>
    </>
  );
}

interface ConfirmationFormSchema {
  verifyEmail: string;
  verifyMessage: string;
}

function ConfirmationForm({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const form = useForm<ConfirmationFormSchema>({
    defaultValues: {
      verifyEmail: "",
      verifyMessage: "",
    },
  });

  async function onSubmit() {
    const { verifyEmail, verifyMessage } = form.getValues();

    if (verifyEmail !== email) {
      form.setError(
        "verifyEmail",
        {
          message: `Enter delete ${email} nothing else`,
        },
        {
          shouldFocus: true,
        }
      );
      return;
    }
    if (verifyMessage !== "delete my account") {
      form.setError(
        "verifyMessage",
        {
          message: `Enter delete my account nothing else`,
        },
        {
          shouldFocus: true,
        }
      );
      return;
    }
    await apiFetch(`user/${userId}`, {
      method: "DELETE",
    });
    redirect("/");
  }

  return (
    <form id="deleteConfirmationForm" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-5 p-4">
        <Controller
          name="verifyEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="verifyEmail" className="text-wrap!">
                Enter{" "}
                <Badge
                  variant="secondary"
                  className="text-bold rounded! text-sm"
                >
                  {email}
                </Badge>{" "}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="verifyEmail"
                placeholder={email}
              />
            </Field>
          )}
        />
        <Controller
          name="verifyMessage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="verifyMessage">
                Enter{" "}
                <Badge
                  variant="secondary"
                  className="text-bold rounded! text-sm"
                >
                  delete my account
                </Badge>{" "}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="verifyMessage"
                placeholder="delete my account"
              />
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
