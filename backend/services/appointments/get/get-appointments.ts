import { db } from "@/backend/lib/db";
import { mapAppointmentRow } from "../appointment-mappers";
import type { AppointmentRow, ReturnedAppointment } from "../appointment-types";

export async function getAppointments(
  userId: number,
): Promise<ReturnedAppointment[]> {
  const result = await db.query<AppointmentRow>(
    `
      SELECT
        appointments.id,
        appointments.user_id,
        appointments.provider_id,
        appointments.title,
        appointments.appointment_date,
        appointments.start_time,
        appointments.appointment_type,
        COALESCE(
          appointments.doctor_name,
          CONCAT('Dr. ', providers.first_name, ' ', providers.last_name)
        ) AS doctor_name,
        appointments.created_at,
        appointments.updated_at
      FROM appointments
      LEFT JOIN providers
        ON providers.id = appointments.provider_id
      WHERE appointments.user_id = $1
      ORDER BY appointments.appointment_date ASC, appointments.start_time ASC
    `,
    [userId],
  );

  return result.rows.map(mapAppointmentRow);
}
