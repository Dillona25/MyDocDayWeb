import { AppError } from "@/backend/errors/app-error";

export async function clearSession() {
  const response = await fetch("/api/auth/session", {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message ?? "Unable to clear session.",
      response.status,
      data.code,
      data.field,
    );
  }

  return data;
}
