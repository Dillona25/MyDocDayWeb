import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { OnboardingProgress } from "@/app/components/onboarding/onboarding-progress";
import { OnboardingProvider } from "@/app/store/onboardingStepsContext";
import "@/app/styles/onboardingProgress.css";
import { db } from "@/backend/lib/db";
import { SESSION_COOKIE_NAME } from "@/backend/services/auth/session-cookie";
import { cookies } from "next/headers";

type SessionOnboardingRow = {
  current_step: number;
  completed_steps: number[];
  is_complete: boolean;
};

export default async function PublicOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    const onboardingResult = await db.query<SessionOnboardingRow>(
      `
        SELECT
          user_onboarding.current_step,
          user_onboarding.completed_steps,
          user_onboarding.is_complete
        FROM sessions
        INNER JOIN user_onboarding
          ON user_onboarding.user_id = sessions.user_id
        WHERE sessions.id = $1
          AND sessions.expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [sessionId],
    );
    const onboarding = onboardingResult.rows[0];

    if (onboarding?.is_complete) {
      redirect("/onboarding-complete");
    }

    if (onboarding && onboarding.current_step >= 2) {
      redirect("/onboarding/providers");
    }
  }

  return (
    <OnboardingProvider
      initialOnboarding={{
        currentStep: 1,
        completedSteps: [],
        isComplete: false,
      }}
    >
      <main>
        <OnboardingProgress />
        {children}
      </main>
    </OnboardingProvider>
  );
}
