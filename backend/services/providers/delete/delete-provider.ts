import { AppError } from "@/backend/errors/app-error";
import { db } from "@/backend/lib/db";
import type { DeleteProviderInput } from "../provider-types";

type DeletedProviderRow = {
  id: number;
};

export async function deleteProvider(
  input: DeleteProviderInput,
): Promise<void> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        DELETE FROM appointments
        WHERE provider_id = $1
          AND user_id = $2
      `,
      [input.providerId, input.userId],
    );

    const result = await client.query<DeletedProviderRow>(
      `
        DELETE FROM providers
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [input.providerId, input.userId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new AppError("Provider not found.", 404, "PROVIDER_NOT_FOUND");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
