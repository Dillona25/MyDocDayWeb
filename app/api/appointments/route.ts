import { cookies } from "next/headers";
import { AppError } from "@/backend/errors/app-error";
import { handleApiError } from "@/backend/errors/handle-api-error";
import { db } from "@/backend/lib/db";
import { SESSION_COOKIE_NAME } from "@/backend/services/auth/session-cookie";
import { getAppointments } from "@/backend/services/appointments/get/get-appointments";
import { createAppointment } from "@/backend/services/appointments/post/create-appointment";
import { deleteAppointment } from "@/backend/services/appointments/delete/delete-appointment";
import {
  createAppointmentSchema,
  deleteAppointmentSchema,
} from "@/backend/services/appointments/appointment-schema";

export const runtime = "nodejs";

type SessionUserRow = {
  user_id: number;
};

async function getSessionUserId(): Promise<number> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    throw new AppError("You must be signed in.", 401, "UNAUTHORIZED");
  }

  const sessionResult = await db.query<SessionUserRow>(
    `
      SELECT user_id
      FROM sessions
      WHERE id = $1
        AND expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `,
    [sessionId],
  );

  const session = sessionResult.rows[0];

  if (!session) {
    throw new AppError("Your session has expired.", 401, "SESSION_EXPIRED");
  }

  return session.user_id;
}

export async function GET(): Promise<Response> {
  try {
    const userId = await getSessionUserId();
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

    const userId = await getSessionUserId();
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

    const userId = await getSessionUserId();

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
