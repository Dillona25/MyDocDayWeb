// Place to translate database errors into app errors.
// Really for us, this decides how known PostgreSQL failures should look to the frontend.

import { AppError } from "./app-error";

type DatabaseError = {
  code?: string;
  constraint?: string;
};

function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === "object" && error !== null && "code" in error;
}

export function mapDatabaseError(error: unknown): AppError | null {
  if (!isDatabaseError(error)) {
    return null;
  }

  if (error.code === "23505" && error.constraint === "users_email_key") {
    return new AppError(
      "Email already exists.",
      409,
      "EMAIL_ALREADY_EXISTS",
      "email",
    );
  }

  if (
    error.code === "23503" &&
    error.constraint === "appointments_provider_id_fkey"
  ) {
    return new AppError(
      "Selected doctor does not exist.",
      400,
      "PROVIDER_NOT_FOUND",
      "providerId",
    );
  }

  return null;
}
