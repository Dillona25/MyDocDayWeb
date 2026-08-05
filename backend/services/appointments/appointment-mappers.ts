import type { AppointmentRow, ReturnedAppointment } from "./appointment-types";

export function mapAppointmentRow(row: AppointmentRow): ReturnedAppointment {
  const date =
    row.appointment_date instanceof Date
      ? row.appointment_date.toISOString().slice(0, 10)
      : row.appointment_date;

  return {
    id: row.id,
    userId: row.user_id,
    providerId: row.provider_id,
    title: row.title,
    date,
    startTime: row.start_time,
    doctorName: row.doctor_name,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
