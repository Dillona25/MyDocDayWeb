import { db } from "@/backend/lib/db";
import { mapProviderRow } from "../provider-mappers";
import type {
  CreateProviderInput,
  ProviderRow,
  ReturnedProvider,
} from "../provider-types";

export async function createProvider(
  input: CreateProviderInput,
): Promise<ReturnedProvider> {
  const result = await db.query<ProviderRow>(
    `
      INSERT INTO providers (
        user_id,
        first_name,
        last_name,
        clinic_name,
        specialty,
        type,
        phone_number,
        image_url,
        street_address,
        city,
        state,
        zip_code
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING
        id,
        user_id,
        first_name,
        last_name,
        clinic_name,
        specialty,
        type,
        phone_number,
        image_url,
        street_address,
        city,
        state,
        zip_code,
        created_at,
        updated_at
    `,
    [
      input.userId,
      input.type === "provider" ? input.firstName : undefined,
      input.type === "provider" ? input.lastName : undefined,
      input.type === "clinic" ? input.clinicName : undefined,
      input.specialty,
      input.type,
      input.phoneNumber,
      input.imageUrl,
      input.streetAddress,
      input.city,
      input.state,
      input.zipCode,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("PostgreSQL did not return the created provider.");
  }

  return mapProviderRow(row);
}
