import { NextResponse } from "next/server";
import { db } from "@/backend/lib/db";
import { SESSION_COOKIE_NAME } from "@/backend/services/auth/session-cookie";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function DELETE(): Promise<Response> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    try {
      await db.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
    } catch (error) {
      console.error("Unable to delete session row.", error);
    }
  }

  const response = NextResponse.json({
    message: "Session cleared successfully.",
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
