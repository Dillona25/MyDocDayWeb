import { AppError } from "@/backend/errors/app-error";
import type { DeleteAppointmentInput } from "@/backend/services/appointments/appointment-types";

type DeleteAppointmentRequest = Omit<DeleteAppointmentInput, "userId">;

type DeleteAppointmentResponse = {
  message: string;
};

export async function deleteAppointment(
  appointmentData: DeleteAppointmentRequest,
): Promise<DeleteAppointmentResponse> {
  const response = await fetch("/api/appointments", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message ?? "Unable to delete appointment.",
      response.status,
      data.code,
      data.field,
    );
  }

  return data;
}
