import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { db } from "@/backend/lib/db";
import { AppError } from "@/backend/errors/app-error";
import { getCurrentUser } from "@/backend/services/auth/current-user";
import type { SignInInput } from "@/backend/services/auth/sign-in/sign-in-schema";
import type {
  CurrentUser,
  SessionRow,
  SignInUserRow,
} from "@/backend/services/auth/sign-in/sign-in-types";
import { SESSION_DURATION_MS } from "@/backend/services/auth/session-cookie";

export async function signIn(input: SignInInput): Promise<{
  user: CurrentUser;
  session: {
    id: string;
    expiresAt: Date;
  };
}> {
  const userResult = await db.query<SignInUserRow>(
    `
      SELECT
        id,
        email,
        password_hash,
        first_name,
        last_name,
        city,
        state,
        is_active
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [input.email],
  );

  const userRow = userResult.rows[0];

  if (!userRow) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  if (!userRow.is_active) {
    throw new AppError("This account is inactive.", 403, "ACCOUNT_INACTIVE");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    userRow.password_hash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const sessionId = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const sessionResult = await db.query<SessionRow>(
    `
      INSERT INTO sessions (
        id,
        user_id,
        expires_at
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        user_id,
        expires_at,
        created_at,
        last_used_at
    `,
    [sessionId, userRow.id, expiresAt],
  );

  const sessionRow = sessionResult.rows[0];

  if (!sessionRow) {
    throw new Error("PostgreSQL did not return the created session.");
  }

  await db.query(
    `
      INSERT INTO user_onboarding (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [userRow.id],
  );

  const currentUser = await getCurrentUser(userRow.id);

  return {
    user: currentUser,
    session: {
      id: sessionRow.id,
      expiresAt: sessionRow.expires_at,
    },
  };
}
