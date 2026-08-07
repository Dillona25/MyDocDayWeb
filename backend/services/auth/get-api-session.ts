import { cookies } from "next/headers";
import { AppError } from "@/backend/errors/app-error";
import { db } from "@/backend/lib/db";
import { SESSION_COOKIE_NAME } from "@/backend/services/auth/session-cookie";

type ApiSession = {
  userId: number;
};

type SessionUserRow = {
  user_id: number;
};

export async function getApiSession(request: Request): Promise<ApiSession> {
  const sessionId = await getSessionId(request);

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

  return {
    userId: session.user_id,
  };
}

async function getSessionId(request: Request): Promise<string | undefined> {
  const bearerToken = getBearerToken(request);

  if (bearerToken) {
    return bearerToken;
  }

  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

function getBearerToken(request: Request): string | undefined {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token || undefined;
}
