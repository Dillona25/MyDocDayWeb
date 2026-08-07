import { NextResponse } from "next/server";
import { signInSchema } from "@/backend/services/auth/sign-in/sign-in-schema";
import { signIn } from "@/backend/services/auth/sign-in/sign-in";
import { handleApiError } from "@/backend/errors/handle-api-error";
import { SESSION_COOKIE_NAME } from "@/backend/services/auth/session-cookie";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const validationResult = signInSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid sign-in information.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { user, session } = await signIn(validationResult.data);

    const response = NextResponse.json(
      {
        message: "Signed in successfully.",
        user,
        session: {
          token: session.id,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 },
    );

    // Web uses this HTTP-only cookie. Mobile can ignore the cookie and store
    // the returned session token instead.
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });

    return response;
  } catch (error) {
    return handleApiError(error, "POST /api/auth/sign-in");
  }
}
