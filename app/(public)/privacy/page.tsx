import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fa] text-slate-950">
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            href="/"
          >
            Back to MyDocDay
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase text-secondary">
            Privacy
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-primary">
            Your care details should be treated carefully.
          </h1>
          <div className="mt-6 space-y-5 text-base leading-8 text-body">
            <p>
              MyDocDay is currently an early access account setup experience.
              The information you enter may include account details, providers,
              clinics, and upcoming appointments.
            </p>
            <p>
              We use this information only to create and maintain your MyDocDay
              care profile. Your data is protected as private account
              information and is not used to make medical decisions, diagnose
              conditions, or replace communication with your healthcare
              providers.
            </p>
            <p>
              We do not sell your care profile information. Before the mobile
              app launches, we will keep expanding this page into a full privacy
              policy with clear details about data collection, storage, sharing,
              account deletion, and data deletion.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
