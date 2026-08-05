"use client";

import { useModal } from "@/app/store/modalContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../forms/input";
import { Select } from "../forms/select";
import { usStates } from "@/app/data/usStates";
import { Button } from "../common/button";
import { providerTypes } from "@/app/data/providerTypes";
import { createProvider } from "@/app/api/providers/post/request";
import type { ProviderType } from "@/backend/services/providers/provider-types";

type ProviderFormData = {
  firstName: string;
  lastName: string;
  clinicName: string;
  specialty: string;
  phoneNumber: string;
  type: ProviderType | "";
  imageUrl: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

const initialProviderFormData: ProviderFormData = {
  firstName: "",
  lastName: "",
  clinicName: "",
  specialty: "",
  phoneNumber: "",
  type: "",
  imageUrl: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
};

export const AddProviderModal = () => {
  const { isAddProviderModalOpen, closeAddProviderModal, onProviderCreated } =
    useModal();
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ProviderFormData>({
    mode: "onChange",
    defaultValues: initialProviderFormData,
  });
  const providerType = watch("type");

  if (!isAddProviderModalOpen) {
    return null;
  }

  async function onSubmit(formData: ProviderFormData) {
    setFormError("");
    setIsLoading(true);

    try {
      const data = await createProvider({
        ...formData,
        type: formData.type || "provider",
        firstName: formData.type === "provider" ? formData.firstName : "",
        lastName: formData.type === "provider" ? formData.lastName : "",
        clinicName: formData.type === "clinic" ? formData.clinicName : "",
      });
      onProviderCreated?.(data.provider);
      reset(initialProviderFormData);
      closeAddProviderModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to create provider.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-4 sm:py-8"
      role="presentation"
      onMouseDown={closeAddProviderModal}
    >
      <section
        aria-modal="true"
        aria-labelledby="add-provider-modal-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgb(15_23_42/28%)] sm:max-h-[calc(100dvh-4rem)]"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <h2
            id="add-provider-modal-title"
            className="text-2xl font-semibold text-primary"
          >
            Add Provider
          </h2>
          <button
            type="button"
            aria-label="Close add provider modal"
            className="grid size-9 shrink-0 place-items-center rounded-md text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            onClick={closeAddProviderModal}
          >
            &times;
          </button>
        </div>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-2">
          <div className="row mt-2">
            <div className="col-12">
              <Select
                options={providerTypes}
                LabelText="Is this a provider or clinic?"
                placeholder="Select a type"
                required
                {...register("type", {
                  required: "Type is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.type?.message ?? ""}
              </p>
            </div>
          </div>
          {providerType === "provider" && (
            <div className="row mt-2">
              <div className="col-12 md:col-6">
                <Input
                  LabelText="First Name"
                  required
                  {...register("firstName", {
                    validate: (firstName) =>
                      providerType !== "provider" ||
                      firstName.trim().length >= 2 ||
                      "First name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.firstName?.message ?? ""}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <Input
                  LabelText="Last Name"
                  required
                  {...register("lastName", {
                    validate: (lastName) =>
                      providerType !== "provider" ||
                      lastName.trim().length >= 2 ||
                      "Last name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.lastName?.message ?? ""}
                </p>
              </div>
            </div>
          )}
          {providerType === "clinic" && (
            <div className="row mt-2">
              <div className="col-12">
                <Input
                  LabelText="Clinic Name"
                  required
                  {...register("clinicName", {
                    validate: (clinicName) =>
                      providerType !== "clinic" ||
                      clinicName.trim().length >= 2 ||
                      "Clinic name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.clinicName?.message ?? ""}
                </p>
              </div>
            </div>
          )}
          {providerType && (
            <>
              <div className="row mt-2">
                <div className="col-12 md:col-6">
                  <Input
                    LabelText={
                      providerType === "clinic"
                        ? "Clinic Type"
                        : "Provider Specialty"
                    }
                    required
                    {...register("specialty", {
                      required: "Specialty is required.",
                      validate: (specialty) =>
                        specialty.trim().length >= 2 ||
                        "Specialty is required.",
                    })}
                  />
                  <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                    {errors.specialty?.message ?? ""}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <Input
                    LabelText="Phone Number"
                    required={false}
                    type="tel"
                    {...register("phoneNumber")}
                  />
                  <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                    {errors.phoneNumber?.message ?? ""}
                  </p>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <Input
                    LabelText={
                      providerType === "clinic"
                        ? "Clinic Image URL"
                        : "Provider Image URL"
                    }
                    required={false}
                    placeholder="Google image link"
                    {...register("imageUrl")}
                  />
                  <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                    {errors.imageUrl?.message ?? ""}
                  </p>
                </div>
              </div>
              {providerType === "clinic" && (
                <>
                  <div className="row mt-2">
                    <div className="col-12">
                      <Input
                        LabelText="Street Address"
                        required={false}
                        {...register("streetAddress")}
                      />
                      <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                        {errors.streetAddress?.message ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12 md:col-6">
                      <Input
                        LabelText="City"
                        required={false}
                        {...register("city")}
                      />
                      <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                        {errors.city?.message ?? ""}
                      </p>
                    </div>
                    <div className="col-12 md:col-6">
                      <Select
                        options={usStates}
                        LabelText="State"
                        required={false}
                        {...register("state")}
                      />
                      <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                        {errors.state?.message ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12 md:col-6">
                      <Input
                        LabelText="ZIP Code"
                        required={false}
                        {...register("zipCode")}
                      />
                      <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                        {errors.zipCode?.message ?? ""}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {formError && (
            <p className="mt-4 text-sm font-semibold text-red-400">
              {formError}
            </p>
          )}
          </div>
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="row mt-0">
              <div className="col-12 flex justify-end">
                <Button
                  varient="primary"
                  type="submit"
                  buttonText={isLoading ? "Adding Provider..." : "Add Provider"}
                  disabled={!isValid || isLoading}
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
