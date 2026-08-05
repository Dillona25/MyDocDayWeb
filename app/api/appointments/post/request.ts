import { AppError } from "@/backend/errors/app-error";
import type {
  CreateAppointmentInput,
  ReturnedAppointment,
} from "@/backend/services/appointments/appointment-types";

type CreateAppointmentRequest = Omit<CreateAppointmentInput, "userId">;

type CreateAppointmentResponse = {
  message: string;
  appointment: ReturnedAppointment;
};

export async function createAppointment(
  appointmentData: CreateAppointmentRequest,
): Promise<CreateAppointmentResponse> {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message ?? "Unable to create appointment.",
      response.status,
      data.code,
      data.field,
    );
  }

  return data;
}
