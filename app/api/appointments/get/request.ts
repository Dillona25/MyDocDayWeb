import { AppError } from "@/backend/errors/app-error";
import type { ReturnedAppointment } from "@/backend/services/appointments/appointment-types";

type GetAppointmentsResponse = {
  message: string;
  appointments: ReturnedAppointment[];
};

export async function getAppointments(): Promise<GetAppointmentsResponse> {
  const response = await fetch("/api/appointments", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message ?? "Unable to fetch appointments.",
      response.status,
      data.code,
      data.field,
    );
  }

  return data;
}
