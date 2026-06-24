"use client";

import { apiFetch } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit2Icon, RotateCcw, SaveIcon } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePings } from "react-pings";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserDetails } from "@/schemas";
import z from "zod";
import { SecurityCard } from "./security-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ProfileCardSkeleton } from "@/components/sekeleton/profile-card-skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DeleteAccountButton } from "./delete-account-btn";
import { UserDetails } from "./user-details";
import { AvatarCard } from "./avatar-card";
import { UserAddresses } from "./user-addresses";

export interface AddressResponse {
  addressId: string;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  postalCode: string;
}

export interface UserResponse {
  userId: string;
  firstName: string;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  email: string;
  contact: string | null;
  avatarUrl: string | null;
  addresses: AddressResponse[] | [];
  createdAt: string;
}

export function ProfileCard() {
  const userId = useAppStore((state) => state.userId);
  const [isNotEditable, setIsNotEditable] = useState<boolean>(true);

  const pings = usePings();

  // Query
  const {
    data: user,
    isError,
    isLoading,
  } = useQuery<UserResponse>({
    queryKey: ["user-data", userId],
    queryFn: async () => {
      const response = await apiFetch(`user/${userId}`);

      if (!response.ok) {
        throw new Error("Unabel to fetch user details");
      }

      return await response.json();
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!userId,
  });

  // form
  const form = useForm<z.infer<typeof editUserDetails>>({
    resolver: zodResolver(editUserDetails),
    defaultValues: {
      firstName: "",
      lastName: "",
      contact: "",
      gender: "",
      dateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      contact: user.contact ?? "",
      gender: (user.gender as "MALE" | "FEMALE" | "OTHER") ?? "",
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
    });
  }, [user, form]);

  // form submit handle
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: z.infer<typeof editUserDetails>) => {
      const payload: Record<string, unknown> = {};

      (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
        const value = values[key];

        if (value === undefined || value === null) return;
        if (typeof value === "string" && value.trim() === "") return;

        if (value instanceof Date) {
          payload[key] = value.toISOString().split("T")[0];
        } else {
          payload[key] = value;
        }
      });

      const response = await apiFetch(`user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to update user details");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data", userId] });
      pings.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      pings.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
  });

  const onSubmit = (values: z.infer<typeof editUserDetails>) => {
    updateUser(values);
  };

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  if (isError) {
    throw new Error("Failed to get user details");
  }

  if (!user) return;

  return (
    <div className="space-y-5">
      <AvatarCard
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        avatarUrl={user.avatarUrl}
      />
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button
            onClick={() => setIsNotEditable(false)}
            variant="default"
            className="w-full"
          >
            <Edit2Icon /> Edit Profile
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-none! pb-7">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Update Profile</DrawerTitle>
            </DrawerHeader>
            <form id="editProfileForm" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="p-4">
                <Controller
                  name="firstName"
                  control={form.control}
                  disabled={isNotEditable || isSubmitting}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="first-name"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="lastName"
                  control={form.control}
                  disabled={isNotEditable || isSubmitting}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="last-name"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="contact"
                  control={form.control}
                  disabled={isNotEditable || isSubmitting}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact">Contact</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="contact"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="gender"
                  control={form.control}
                  disabled={isNotEditable || isSubmitting}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={field.disabled}
                      >
                        <SelectTrigger
                          id="gender"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="dateOfBirth"
                  control={form.control}
                  disabled={isNotEditable || isSubmitting}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                      <Input
                        type="date"
                        id="dob"
                        disabled={field.disabled}
                        aria-invalid={fieldState.invalid}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <DrawerFooter>
              <Button
                form="editProfileForm"
                type="submit"
                variant="default"
                disabled={isSubmitting || isNotEditable}
                aria-disabled={isSubmitting || isNotEditable}
              >
                {isSubmitting ? <Spinner /> : <SaveIcon />}
                Save Changes
              </Button>
              <DrawerClose asChild>
                <Button
                  onClick={() => {
                    form.reset();
                    setIsNotEditable(true);
                  }}
                  variant="outline"
                >
                  <RotateCcw /> Discard
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <FieldGroup>
        <UserAddresses userId={user.userId} />
        <UserDetails user={user} />
        <SecurityCard />
        <DeleteAccountButton userId={user.userId} email={user.email} />
      </FieldGroup>
    </div>
  );
}
