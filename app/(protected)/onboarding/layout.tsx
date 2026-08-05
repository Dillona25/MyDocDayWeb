import type { ReactNode } from "react";
import { OnboardingProgress } from "@/app/components/onboarding/onboarding-progress";
import { OnboardingProvider } from "@/app/store/onboardingStepsContext";
import "@/app/styles/onboardingProgress.css";
import { db } from "@/backend/lib/db";
import { requireSession } from "@/backend/services/auth/require-session";

type OnboardingRow = {
  current_step: number;
  completed_steps: number[];
  is_complete: boolean;
};

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  const onboardingResult = await db.query<OnboardingRow>(
    `
      SELECT
        current_step,
        completed_steps,
        is_complete
      FROM user_onboarding
      WHERE user_id = $1
      LIMIT 1
    `,
    [session.userId],
  );
  const onboarding = onboardingResult.rows[0];

  return (
    <OnboardingProvider
      initialOnboarding={{
        currentStep: onboarding?.current_step ?? 1,
        completedSteps: onboarding?.completed_steps ?? [],
        isComplete: onboarding?.is_complete ?? false,
      }}
    >
      <main>
        <OnboardingProgress />
        {children}
      </main>
    </OnboardingProvider>
  );
}
