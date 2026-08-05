import type { ProviderRow, ReturnedProvider } from "./provider-types";

export function mapProviderRow(row: ProviderRow): ReturnedProvider {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    clinicName: row.clinic_name,
    specialty: row.specialty,
    type: row.type,
    phoneNumber: row.phone_number,
    imageUrl: row.image_url,
    streetAddress: row.street_address,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
