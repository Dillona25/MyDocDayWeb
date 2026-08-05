export type ProviderType = "provider" | "clinic";

export type CreateProviderInput = {
  userId: number;
  firstName?: string;
  lastName?: string;
  clinicName?: string;
  specialty: string;
  type: ProviderType;
  phoneNumber?: string;
  imageUrl?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export type DeleteProviderInput = {
  userId: number;
  providerId: number;
};

export type ReturnedProvider = {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  clinicName: string | null;
  specialty: string;
  type: ProviderType;
  phoneNumber: string | null;
  imageUrl: string | null;
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProviderRow = {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  clinic_name: string | null;
  specialty: string;
  type: ProviderType;
  phone_number: string | null;
  image_url: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  created_at: Date;
  updated_at: Date;
};
