import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressFormSchema } from "@/schemas";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { apiFetch } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePings } from "react-pings";
import { Badge } from "@/components/ui/badge";

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

export function UserAddresses({ userId }: { userId: string }) {

  const queryClient = useQueryClient();
  const pings = usePings();

  const { data: addresses, isLoading: loadingUserAddress } = useQuery<UserAddressResponse[] | []>({
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
  })

  const form = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  })

  const { mutate: mutateUserAddress, isPending: loading } = useMutation({
    mutationFn: async (values: z.infer<typeof addressFormSchema>) => {
      const formData = {
        address: values.address,
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      }

      try {
        const resposne = await apiFetch(`user/${userId}/address`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (resposne.status !== 201) {
          throw new Error("Failed to create address for this user");
        }

        const data = await resposne.json()
        form.reset();
        return data;

      } catch (e) {
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-addresses", userId]
      })
      pings.success("Address added successfully");
    },
    onError: () => {
      pings.error("Failed to set address");
    }
  })

  if (loadingUserAddress) return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  );

  if (!addresses) {
    throw new Error("Failed to get user addresses");
  }

  async function onSubmit(values: z.infer<typeof addressFormSchema>) {
    mutateUserAddress(values);
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
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="secondary" className="w-full">
              <PlusCircle /> Add Address
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                Add new Address
              </DrawerTitle>
            </DrawerHeader>
            <form id="userAddressForm" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="p-4">
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input {...field}
                        aria-invalid={fieldState.invalid}
                        id="address"
                        placeholder="Enter address" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />
                <Controller
                  name="street"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="street">Street</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="street"
                        type="text"
                        placeholder="Enter street" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />
                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        {...field}
                        aria-invaid={fieldState.invalid}
                        id="city"
                        type="text"
                        placeholder="Enter city" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />

                <Controller
                  name="state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="state">State</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="state"
                        type="text"
                        placeholder="Enter state" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />
                <Controller
                  name="country"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="country">Country</FieldLabel>
                      <Input
                        {...field}
                        aria-invaid={fieldState.invalid}
                        id="country"
                        type="text"
                        placeholder="Enter country" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />
                <Controller
                  name="postalCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="postalCode"
                        type="text"
                        placeholder="Enter postal code" />
                      {
                        fieldState.error &&
                        <FieldError>{fieldState.error.message}</FieldError>
                      }
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <DrawerFooter>
              <Button form="userAddressForm" type="submit">
                {loading && <Spinner />}
                Add Address
              </Button>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Discard
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
        Delivery Addresses
      </FieldSeparator>
      <Carousel>
        <CarouselContent>
          {addresses.map(({ address, addressId, city, country, isDefault, postalCode, state, street }) => (
            <CarouselItem key={addressId} className="max-w-fit">
              <div className="relative rounded-md border border-primary/20 bg-linear-140 from-transparent to-primary/10 flex flex-col justify-center">
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <Input type="radio" name="defaultAddress" className="size-4 accent-primary outline-primary" checked={isDefault} />
                    <div className="text-sm font-semibold tracking-tight">
                      {address},{" "}{street}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground font-light">
                    {city},{" "}
                    {state}-
                    {postalCode}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">
                    {country}
                  </div>
                </div>
                {isDefault && <Badge variant="secondary" className="border-primary/30 text-primary shadow-md absolute right-2 bottom-2">Default</Badge>}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {
          addresses.length < 1 && (
            <>
              <CarouselNext className="-right-10" />
              <CarouselPrevious className="-left-10" />
            </>
          )
        }
      </Carousel >
    </>
  );
}