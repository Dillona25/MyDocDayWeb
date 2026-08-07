import { AppError } from "@/backend/errors/app-error";
import { db } from "@/backend/lib/db";
import type {
  CurrentUser,
  CurrentUserRow,
} from "@/backend/services/auth/sign-in/sign-in-types";

export async function getCurrentUser(userId: number): Promise<CurrentUser> {
  const currentUserResult = await db.query<CurrentUserRow>(
    `
      SELECT
        users.id,
        users.email,
        users.first_name,
        users.last_name,
        users.city,
        users.state,
        users.is_active,
        user_onboarding.current_step AS onboarding_current_step,
        user_onboarding.completed_steps AS onboarding_completed_steps,
        user_onboarding.is_complete AS onboarding_is_complete
      FROM users
      INNER JOIN user_onboarding
        ON user_onboarding.user_id = users.id
      WHERE users.id = $1
      LIMIT 1
    `,
    [userId],
  );

  const currentUserRow = currentUserResult.rows[0];

  if (!currentUserRow) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  return mapCurrentUser(currentUserRow);
}

function mapCurrentUser(row: CurrentUserRow): CurrentUser {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    city: row.city,
    state: row.state,
    isActive: row.is_active,
    onboarding: {
      currentStep: row.onboarding_current_step,
      completedSteps: row.onboarding_completed_steps,
      isComplete: row.onboarding_is_complete,
    },
  };
}
