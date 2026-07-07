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
  fileId: string | null;
  addresses: AddressResponse[] | [];
  createdAt: string;
}
