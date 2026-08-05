import { db } from "@/backend/lib/db";
import { mapProviderRow } from "../provider-mappers";
import type { ProviderRow, ReturnedProvider } from "../provider-types";

export async function getProviders(userId: number): Promise<ReturnedProvider[]> {
  const result = await db.query<ProviderRow>(
    `
      SELECT
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
      FROM providers
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapProviderRow);
}
