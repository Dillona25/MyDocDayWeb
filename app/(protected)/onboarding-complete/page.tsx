import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/backend/lib/db";
import { requireSession } from "@/backend/services/auth/require-session";

type OnboardingRow = {
  current_step: number;
  is_complete: boolean;
};

const onboardingStepRoutes: Record<number, string> = {
  1: "/onboarding",
  2: "/onboarding/providers",
  3: "/onboarding/appointments",
};

export default async function OnboardingCompletePage() {
  const session = await requireSession();
  const onboardingResult = await db.query<OnboardingRow>(
    `
      SELECT
        current_step,
        is_complete
      FROM user_onboarding
      WHERE user_id = $1
      LIMIT 1
    `,
    [session.userId],
  );
  const onboarding = onboardingResult.rows[0];

  if (!onboarding?.is_complete) {
    redirect(onboardingStepRoutes[onboarding?.current_step ?? 1]);
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase text-secondary">
          Early Access Account Ready
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-primary">
          You&apos;re on the list
        </h1>
        <p className="mt-4 text-base leading-7 text-body">
          Your MyDocDay account and care profile are ready. The mobile app is
          coming soon, and when it launches you&apos;ll be able to sign in with
          this account and pick up from here.
        </p>
        <p className="mt-4 text-sm leading-6 text-body">
          For now, follow{" "}
          <a
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary-light"
            href="https://www.linkedin.com/in/dillonarnold/"
            rel="noreferrer"
            target="_blank"
          >
            MyDocDay&apos;s journey on LinkedIn
          </a>{" "}
          for launch updates, and continue using your usual care channels for
          appointments, reminders, and medical guidance.
        </p>
        <div className="mt-8">
          <Link
            className="button-primary inline-flex text-sm font-bold text-primary hover:bg-white"
            href="/onboarding/providers"
          >
            Update Care Profile
          </Link>
        </div>
        <div className="mt-5">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            href="/"
          >
            Back to MyDocDay
          </Link>
        </div>
      </section>
    </main>
  );
}
