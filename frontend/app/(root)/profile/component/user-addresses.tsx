import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressFormSchema } from "@/schemas";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { apiFetch } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";
import { Badge } from "@/components/ui/badge";
import { AddressCardSkeleton } from "@/components/sekeleton";
import { useAppStore } from "@/store/store";

export interface UserAddressResponse {
  addressId: string;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  postalCode: string;
}

export function UserAddresses() {
  const userId = useAppStore((state) => state.user?.userId);

  const queryClient = useQueryClient();
  const pings = usePings();

  const { data: addresses, isLoading: loadingUserAddress } = useQuery<
    UserAddressResponse[] | []
  >({
    queryKey: ["user-addresses", userId],
    queryFn: async () => {
      try {
        const resposne = await apiFetch(`user/${userId}/address`);

        if (resposne.status !== 200) {
          throw new Error("Failed to fetch user address");
        }

        const data = await resposne.json();
        return data;
      } catch (e) {
        throw e;
      }
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const { mutate: changeDefaultAddress } = useMutation({
    mutationFn: async (addressId: string) => {
      console.log("kdjkasld.");
      const response = await apiFetch(`user/${userId}/address/${addressId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-addresses", userId],
      });
      pings.success("Default address changed successfully");
    },
    onError: () => {
      pings.error("Failed to set default address");
    },
  });

  if (loadingUserAddress) {
    return <AddressCardSkeleton />;
  }

  if (!addresses) {
    throw new Error("Failed to get user addresses");
  }

  if (addresses.length === 0 || !addresses) {
    return (
      <>
        <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
          Delivery Addresses
        </FieldSeparator>
        <p className="text-center text-sm text-muted-foreground">
          No delivery addresses saved yet.
        </p>
        <AddressForm>
          <Button className="w-full">
            <Plus /> Add Address
          </Button>
        </AddressForm>
      </>
    );
  }

  return (
    <>
      <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
        Delivery Addresses
      </FieldSeparator>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {addresses.map(
            ({
              address,
              addressId,
              city,
              country,
              isDefault,
              postalCode,
              state,
              street,
            }) => (
              <CarouselItem key={addressId} className="max-w-fit">
                <div className="aspect-rectangle relative flex h-28 flex-col justify-center rounded-md border border-primary/50 bg-linear-140 from-transparent from-20% via-primary/20 to-transparent dark:via-primary/40">
                  <div className="p-3">
                    <div className="flex items-start gap-2">
                      <label htmlFor={addressId}>
                        <Input
                          type="radio"
                          id={addressId}
                          name="defaultAddress"
                          className="peer size-4 accent-primary"
                          checked={isDefault}
                          hidden
                          onChange={() => {
                            if (!isDefault) {
                              changeDefaultAddress(addressId);
                            }
                          }}
                        />
                        <div className="size-4 rounded-full border-2 border-background outline-2 outline-primary peer-checked:bg-primary"></div>
                      </label>
                      <div className="text-sm font-semibold tracking-tight">
                        {address}, {street}
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-light text-muted-foreground">
                      {city}, {state}-{postalCode}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground">
                      {country}
                    </div>
                  </div>
                  {isDefault && (
                    <Badge className="absolute right-2 bottom-2 border-primary/30 shadow-md backdrop-blur-sm">
                      Default
                    </Badge>
                  )}
                </div>
              </CarouselItem>
            )
          )}
          <CarouselItem className="max-w-fit">
            <div className="relative flex aspect-square h-28 flex-col items-center justify-center rounded-md border border-primary/20 bg-linear-140 from-transparent to-primary/10">
              <AddressForm>
                <Button
                  variant="default"
                  className="rounded-full shadow"
                  size="icon-lg"
                >
                  <Plus size="6" />
                </Button>
              </AddressForm>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselNext className="hidden md:flex" />
        <CarouselPrevious className="hidden md:flex" />
      </Carousel>
    </>
  );
}

function AddressForm({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userId);
  const pings = usePings();

  const form = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const { mutate: mutateUserAddress, isPending: loading } = useMutation({
    mutationFn: async (values: z.infer<typeof addressFormSchema>) => {
      const formData = {
        address: values.address,
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      };

      try {
        const resposne = await apiFetch(`user/${userId}/address`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (resposne.status !== 201) {
          throw new Error("Failed to create address for this user");
        }

        const data = await resposne.json();
        form.reset();
        return data;
      } catch (e) {
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-addresses", userId],
      });
      pings.success("Address added successfully");
    },
    onError: () => {
      pings.error("Failed to set address");
    },
  });

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    mutateUserAddress(values);
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="border-none">
        <DrawerHeader>
          <DrawerTitle>Add Address</DrawerTitle>
          <DrawerDescription>Add your delivery address</DrawerDescription>
        </DrawerHeader>
        <form id="userAddressForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="p-4">
            <Controller
              name="address"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="address"
                    placeholder="Enter address"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="street"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="street">Street</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="street"
                    type="text"
                    placeholder="Enter street"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="city"
                    type="text"
                    placeholder="Enter city"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="state"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="state"
                    type="text"
                    placeholder="Enter state"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="country"
                    type="text"
                    placeholder="Enter country"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="postalCode"
              control={form.control}
              disabled={loading}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="postalCode"
                    type="text"
                    placeholder="Enter postal code"
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
          <Button disabled={loading} form="userAddressForm" type="submit">
            {loading && <Spinner />}
            Add Address
          </Button>
          <DrawerClose>
            <Button
              onClick={() => form.reset()}
              variant="outline"
              className="w-full"
            >
              Discard
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
