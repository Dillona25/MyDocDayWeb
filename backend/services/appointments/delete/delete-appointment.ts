import { AppError } from "@/backend/errors/app-error";
import { db } from "@/backend/lib/db";
import type { DeleteAppointmentInput } from "../appointment-types";

type DeletedAppointmentRow = {
  id: number;
};

export async function deleteAppointment(
  input: DeleteAppointmentInput,
): Promise<void> {
  const result = await db.query<DeletedAppointmentRow>(
    `
      DELETE FROM appointments
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [input.appointmentId, input.userId],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(
      "Appointment not found.",
      404,
      "APPOINTMENT_NOT_FOUND",
    );
  }
}
