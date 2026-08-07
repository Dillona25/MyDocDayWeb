import { handleApiError } from "@/backend/errors/handle-api-error";
import { getApiSession } from "@/backend/services/auth/get-api-session";
import { getAppointments } from "@/backend/services/appointments/get/get-appointments";
import { createAppointment } from "@/backend/services/appointments/post/create-appointment";
import { deleteAppointment } from "@/backend/services/appointments/delete/delete-appointment";
import {
  createAppointmentSchema,
  deleteAppointmentSchema,
} from "@/backend/services/appointments/appointment-schema";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const { userId } = await getApiSession(request);
    const appointments = await getAppointments(userId);

    return Response.json(
      {
        message: "Appointments fetched successfully.",
        appointments,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "GET /api/appointments");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const validationResult = createAppointmentSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid appointment information.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userId } = await getApiSession(request);
    const appointment = await createAppointment({
      userId,
      ...validationResult.data,
    });

    return Response.json(
      {
        message: "Appointment created successfully.",
        appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "POST /api/appointments");
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const validationResult = deleteAppointmentSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid appointment information.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userId } = await getApiSession(request);

    await deleteAppointment({
      userId,
      appointmentId: validationResult.data.appointmentId,
    });

    return Response.json(
      {
        message: "Appointment deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "DELETE /api/appointments");
  }
}
