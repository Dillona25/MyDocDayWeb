import { handleApiError } from "@/backend/errors/handle-api-error";
import { getApiSession } from "@/backend/services/auth/get-api-session";
import { deleteProvider } from "@/backend/services/providers/delete/delete-provider";
import { getProviders } from "@/backend/services/providers/get/get-providers";
import { createProvider } from "@/backend/services/providers/post/create-provider";
import {
  createProviderSchema,
  deleteProviderSchema,
} from "@/backend/services/providers/provider-schema";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const { userId } = await getApiSession(request);
    const providers = await getProviders(userId);

    return Response.json(
      {
        message: "Providers fetched successfully.",
        providers,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "GET /api/providers");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const validationResult = createProviderSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid provider information.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userId } = await getApiSession(request);

    const provider = await createProvider({
      userId,
      ...validationResult.data,
    });

    return Response.json(
      {
        message: "Provider created successfully.",
        provider,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "POST /api/providers");
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const validationResult = deleteProviderSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid provider information.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userId } = await getApiSession(request);

    await deleteProvider({
      userId,
      providerId: validationResult.data.providerId,
    });

    return Response.json(
      {
        message: "Provider deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "DELETE /api/providers");
  }
}
