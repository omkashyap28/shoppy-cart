import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserResponse } from "./profile-card";

export function UserDetails({ user }: { user: UserResponse }) {
  return (
    <>
      <FieldSeparator className="my-4 *:data-[slot=field-separator-content]:bg-background">
        User Details
      </FieldSeparator>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first-name">First Name</FieldLabel>
          <Input
            disabled
            aria-disabled
            id="first-name"
            value={user.firstName}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
          <Input
            disabled
            aria-disabled
            id="last-name"
            value={user.lastName ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input disabled aria-disabled id="email" value={user.email} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact">Contact</FieldLabel>
          <Input
            disabled
            aria-disabled
            id="contact"
            value={user.contact ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <Input disabled aria-disabled id="gender" value={user.gender ?? ""} />
        </Field>
        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <Input
            disabled
            aria-disabled
            id="dob"
            value={user.dateOfBirth ?? ""}
          />
        </Field>
      </FieldGroup>
    </>
  );
}
