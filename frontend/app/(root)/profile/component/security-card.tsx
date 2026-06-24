"use client";

import * as React from "react";
import {
  KeyRound,
  LogOut,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas";
import { apiFetch, cn, logout } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { usePings } from "react-pings";
import z from "zod";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UAParser } from "ua-parser-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionResponse {
  sessionId: string;
  isCurrent: boolean;
  isActive: boolean;
  deviceInformation: {
    browser: string;
    os: string;
  };
}

export function SecurityCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const isAuth = useAppStore((state) => state.isAuth);
  const userId = useAppStore((state) => state.userId);
  const pings = usePings();

  const { data: deviceSessions } = useQuery<SessionResponse[]>({
    queryKey: ["user-device-sessions"],
    queryFn: async () => {
      const response = await apiFetch("auth/active-session");

      const responseData = await response.json();

      return responseData.map(
        ({
          sessionId,
          isCurrent,
          isActive,
          deviceInformation,
        }: {
          sessionId: string;
          isCurrent: string;
          isActive: string;
          deviceInformation: string;
        }) => {
          const { browser, os } = UAParser(deviceInformation);

          return {
            sessionId,
            isCurrent,
            isActive,
            deviceInformation: {
              browser: browser.name,
              os: os.name,
            },
          };
        }
      );
    },
    enabled: !!isAuth && !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const queryClient = useQueryClient();

  const { mutate: signOutBySessionId } = useMutation({
    mutationFn: async (sessionId: string) => {
      apiFetch(`auth/logout/session/${sessionId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-device-sessions"],
      });
      pings.success("Session delete successfully");
      logout();
    },
    onError: (error: unknown) => {
      pings.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const formData = {
      password: data.password,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    };

    try {
      setLoading(true);
      const response = await apiFetch("auth/password/reset", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        pings.error("Failed to reset password");
        throw new Error(`Failed to rest password`);
      }
      pings.success("Password reset successfully");
      form.reset();
      logout();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
        Securtity
      </FieldSeparator>
      <Field>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <KeyRound /> Change Password
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-none! pb-5">
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle>Change Password</DrawerTitle>
              </DrawerHeader>
              <form
                id="resetPasswordForm"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup className="p-4">
                  <Controller
                    name="password"
                    control={form.control}
                    disabled={loading}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Current password"
                        />
                        <FieldError>
                          {fieldState.error ? fieldState.error.message : null}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    name="newPassword"
                    control={form.control}
                    disabled={loading}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          // type="password"
                          id="confirm-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Confirm password"
                        />
                        <FieldError>
                          {fieldState.error ? fieldState.error.message : null}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    disabled={loading}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirm-new-password">
                          Confirm New Password
                        </FieldLabel>
                        <Input
                          {...field}
                          // type="password"
                          id="confirm-new-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Confirm new password"
                        />
                        <FieldError>
                          {fieldState.error ? fieldState.error.message : null}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Field>
                    <Link className="text-right" href="/">
                      Forget password
                    </Link>
                    <Link className="text-right" href="/">
                      Don&#39;t have password
                    </Link>
                  </Field>
                </FieldGroup>
              </form>
              <DrawerFooter>
                <Button
                  form="resetPasswordForm"
                  variant="default"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  aria-disabled={loading}
                >
                  <>
                    {loading && <Spinner />}
                    Change
                  </>
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </Field>
      <Field>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-full flex-col gap-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-blue-500! text-blue-500"
            >
              <MonitorSmartphone className="size-5" />
              Active Session
              <span className="sr-only">Active sessions</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col rounded-xl bg-secondary px-3 py-4">
            {deviceSessions?.map(
              ({ deviceInformation, sessionId, isActive, isCurrent }, idx) => {
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between py-2",
                      idx !== deviceSessions.length - 1 &&
                      "border-b border-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`mr-3 rounded-full p-1 shadow ${isActive ? "bg-green-500" : "bg-red-500"}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {isActive ? "Active" : "Not Active"}
                        </TooltipContent>
                      </Tooltip>
                      {deviceInformation.os === "Windows" ? (
                        <Monitor className="size-4" />
                      ) : (
                        <Smartphone className="size-4" />
                      )}
                      <FieldSeparator />
                      <h4 className="text-sm font-semibold">
                        {deviceInformation.browser}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
                      {isCurrent && (
                        <Badge variant="outline">This Device</Badge>
                      )}
                      {isActive ? (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => signOutBySessionId(sessionId)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Badge variant="secondary">Signed Out</Badge>
                      )}
                    </div>
                  </div>
                );
              }
            )}
            <FieldSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="mt-3 w-full">
                  <LogOut /> Signout from All Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="default">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <AlertTriangle />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Alert</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure to sign out from all the devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={signedOutFromAllDevices}
                    variant="destructive"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CollapsibleContent>
        </Collapsible>
      </Field>
    </>
  );
}

async function signedOutFromAllDevices() {
  await apiFetch("auth/logout/all-devices", {
    method: "DELETE"
  });
}
