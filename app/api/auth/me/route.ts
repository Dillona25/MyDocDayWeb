import { handleApiError } from "@/backend/errors/handle-api-error";
import { getApiSession } from "@/backend/services/auth/get-api-session";
import { getCurrentUser } from "@/backend/services/auth/current-user";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const session = await getApiSession(request);
    const user = await getCurrentUser(session.userId);

    return Response.json(
      {
        message: "User fetched successfully.",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "GET /api/auth/me");
  }
}
