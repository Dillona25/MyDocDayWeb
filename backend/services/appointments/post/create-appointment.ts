import { AppError } from "@/backend/errors/app-error";
import { db } from "@/backend/lib/db";
import { mapAppointmentRow } from "../appointment-mappers";
import type {
  AppointmentRow,
  CreateAppointmentInput,
  ReturnedAppointment,
} from "../appointment-types";

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<ReturnedAppointment> {
  if (input.providerId !== undefined) {
    const providerResult = await db.query<{ id: number }>(
      `
        SELECT id
        FROM providers
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
      `,
      [input.providerId, input.userId],
    );

    if (!providerResult.rows[0]) {
      throw new AppError(
        "Selected doctor does not exist.",
        400,
        "PROVIDER_NOT_FOUND",
        "providerId",
      );
    }
  }

  const result = await db.query<AppointmentRow>(
    `
      WITH inserted_appointment AS (
        INSERT INTO appointments (
          user_id,
          provider_id,
          title,
          appointment_date,
          start_time,
          appointment_type,
          doctor_name
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          user_id,
          provider_id,
          title,
          appointment_date,
          start_time,
          appointment_type,
          doctor_name,
          NULL::VARCHAR(20) AS provider_type,
          created_at,
          updated_at
      )
      SELECT
        inserted_appointment.id,
        inserted_appointment.user_id,
        inserted_appointment.provider_id,
        inserted_appointment.title,
        inserted_appointment.appointment_date,
        inserted_appointment.start_time,
        inserted_appointment.appointment_type,
        COALESCE(
          inserted_appointment.doctor_name,
          providers.clinic_name,
          CONCAT('Dr. ', providers.first_name, ' ', providers.last_name)
        ) AS doctor_name,
        providers.type AS provider_type,
        inserted_appointment.created_at,
        inserted_appointment.updated_at
      FROM inserted_appointment
      LEFT JOIN providers
        ON providers.id = inserted_appointment.provider_id
    `,
    [
      input.userId,
      input.providerId,
      input.title,
      input.date,
      input.startTime,
      input.appointmentType,
      input.doctorName,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("PostgreSQL did not return the created appointment.");
  }

  return mapAppointmentRow(row);
}
