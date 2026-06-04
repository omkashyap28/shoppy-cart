"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { createAccountFormSchema } from "@/schemas/index";
import z from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import Image from "next/image";
import { CameraIcon } from "lucide-react";
import { format } from "date-fns";

export function CreateAccountForm() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [profileImage, setProfleImage] = React.useState<string>("/user.png");

  const form = useForm({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      email: "omkashyap@gmail.com",
      firstName: "",
      lastName: "",
      contact: "",
      dob: undefined,
      gender: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const filePath = URL.createObjectURL(file);
      setProfleImage(filePath);
    }
  };

  const onSubmit = (data: z.infer<typeof createAccountFormSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <div
            className="my-5 flex w-full items-center justify-center" // Center-aligns the avatar
          >
            <FieldLabel htmlFor="profile">
              <div className="group relative size-32 cursor-pointer overflow-hidden rounded-full bg-gray-100 transition hover:opacity-80">
                <div className="absolute inset-0 z-2 flex h-full w-full items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-1 text-white">
                    <CameraIcon />
                    <span className="text-sm tracking-tight">Add Profile</span>
                  </div>
                </div>
                <Image
                  src={profileImage}
                  alt="User profile"
                  fill
                  sizes="(max-width: 128px) 100vw, 128px"
                  priority
                  className="object-cover"
                />
              </div>
            </FieldLabel>
          </div>
          <Input
            id="profile"
            type="file"
            accept="image/.png,.jpg,.jpeg" // Restricts file picker to images only
            className="hidden" // Standard Tailwind way to hide it completely
            aria-hidden="true"
            onChange={handleImage}
          />
        </Field>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="email"
                placeholder="m@example.com"
                aria-readonly
                readOnly
                disabled
                aria-disabled
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="first-name" placeholder="Hariom" />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="last-name" placeholder="Kashyap" />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="contact"
          control={form.control}
          rules={{
            max: 10,
          }}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact">
                Contact <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  max="10"
                  id="contact"
                  placeholder="0123456789"
                />
                <InputGroupAddon>
                  <InputGroupText>+91</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel>
                Gender <span className="text-destructive">*</span>
              </FieldLabel>
              <RadioGroup {...field} className="flex w-fit items-center gap-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="FEMALE" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="OTHER" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="dob"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="dob">
                Date of birth <span className="text-destructive">*</span>
              </FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Input
                    value={
                      field.value
                        ? format(new Date(field.value), "dd-mm-yyyy")
                        : ""
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    id="dob"
                    placeholder="dd-mm-yyyy"
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    defaultMonth={
                      field.value ? new Date(field.value) : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      field.onChange(selectedDate);
                      setOpen(false); // Close popover on selection
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="password"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="confirm-password"
                type="password"
                placeholder="password"
              />
              <FieldError>
                {fieldState.error ? fieldState.error.message : null}
              </FieldError>
            </Field>
          )}
        />

        <Field>
          <Button type="submit">Create</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
