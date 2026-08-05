"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/common/button";
import { ProviderWidget } from "@/app/components/providers/provider-widget";
import "@/app/styles/onboardingProgress.css";
import { useOnboardingNavigation } from "@/app/hooks/useOnboardingNavigation";
import { useModal } from "@/app/store/modalContext";
import { getProviders } from "@/app/api/providers/get/request";
import type { ReturnedProvider } from "@/backend/services/providers/provider-types";

export default function ProvidersOnboardingPage() {
  const { handleNextStep } = useOnboardingNavigation();
  const { openAddProviderModal, openDeleteProviderModal } = useModal();
  const [providers, setProviders] = useState<ReturnedProvider[]>([]);
  const [providersError, setProvidersError] = useState("");

  useEffect(() => {
    async function loadProviders() {
      try {
        const data = await getProviders();
        setProviders(data.providers);
      } catch (error) {
        setProvidersError(
          error instanceof Error ? error.message : "Unable to load providers.",
        );
      }
    }

    loadProviders();
  }, []);

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] flex-col pb-14">
      <div className="row min-h-0 flex-1">
        <div className="col-12 mx-auto md:col-8">
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto rounded-lg border border-dashed border-primary/25 bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Providers & Clinics
                </h2>
                <p className="mt-1 max-w-md text-sm text-body">
                  Add the care providers you want available in your dashboard,
                  or skip this step and add them later.
                </p>
              </div>
              <Button
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-primary hover:underline"
                buttonText="+ Add Provider"
                onClick={() =>
                  openAddProviderModal((provider) =>
                    setProviders((current) => [provider, ...current]),
                  )
                }
              />
            </div>

            {providersError && (
              <p className="mt-4 text-sm font-semibold text-red-400">
                {providersError}
              </p>
            )}

            {providers.length > 0 ? (
              <div className="row mt-6">
                {providers.map((provider) => (
                  <div className="col-12 mb-4 md:col-6" key={provider.id}>
                    <ProviderWidget
                      firstName={provider.firstName}
                      lastName={provider.lastName}
                      clinicName={provider.clinicName}
                      specialty={provider.specialty}
                      type={provider.type}
                      phoneNumber={provider.phoneNumber ?? undefined}
                      imageUrl={provider.imageUrl ?? undefined}
                      city={provider.city ?? undefined}
                      state={provider.state ?? undefined}
                      zipCode={provider.zipCode ?? undefined}
                      onDelete={() =>
                        openDeleteProviderModal(provider, (providerId) =>
                          setProviders((current) =>
                            current.filter((item) => item.id !== providerId),
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-primary/20 px-6 py-8 text-center">
                <h3 className="text-lg font-semibold text-primary">
                  No providers added yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-body">
                  Add one now and they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-12 shrink-0">
        <div className="col-12 mx-auto flex justify-end md:col-8">
          <Button
            varient="primary"
            buttonText="Next Step"
            onClick={() => handleNextStep("/onboarding/appointments")}
          />
        </div>
      </div>
    </div>
  );
}
