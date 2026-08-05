"use client";

import { getProviders } from "@/app/api/providers/get/request";
import { createAppointment } from "@/app/api/appointments/post/request";
import { appointmentTypes } from "@/app/data/appointmentTypes";
import { useModal } from "@/app/store/modalContext";
import type { ReturnedProvider } from "@/backend/services/providers/provider-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../common/button";
import { Input } from "../forms/input";
import { Select } from "../forms/select";

type AppointmentFormData = {
  title: string;
  date: string;
  startTime: string;
  appointmentType: "in_person" | "telehealth" | "";
  providerId: string;
  doctorName: string;
};

const otherDoctorValue = "other";

const initialAppointmentFormData: AppointmentFormData = {
  title: "",
  date: "",
  startTime: "",
  appointmentType: "",
  providerId: "",
  doctorName: "",
};

export const AddAppointmentModal = () => {
  const {
    isAddAppointmentModalOpen,
    closeAddAppointmentModal,
    onAppointmentCreated,
  } = useModal();
  const [providers, setProviders] = useState<ReturnedProvider[]>([]);
  const [providersError, setProvidersError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<AppointmentFormData>({
    mode: "onChange",
    defaultValues: initialAppointmentFormData,
  });
  const selectedProviderId = watch("providerId");

  useEffect(() => {
    if (!isAddAppointmentModalOpen) {
      return;
    }

    async function loadProviders() {
      try {
        const data = await getProviders();
        setProviders(data.providers);
        setProvidersError("");
      } catch (error) {
        setProvidersError(
          error instanceof Error ? error.message : "Unable to load providers.",
        );
      }
    }

    loadProviders();
  }, [isAddAppointmentModalOpen]);

  if (!isAddAppointmentModalOpen) {
    return null;
  }

  const providerOptions = [
    ...providers
      .filter((provider) => provider.type === "provider")
      .map((provider) => ({
        label: `Dr. ${provider.firstName} ${provider.lastName}`,
        value: String(provider.id),
      })),
    { label: "Add a different doctor", value: otherDoctorValue },
  ];

  async function onSubmit(formData: AppointmentFormData) {
    setFormError("");
    setIsLoading(true);

    try {
      const data = await createAppointment({
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        appointmentType: formData.appointmentType || "in_person",
        providerId:
          formData.providerId === otherDoctorValue
            ? undefined
            : Number(formData.providerId),
        doctorName:
          formData.providerId === otherDoctorValue
            ? formData.doctorName
            : undefined,
      });
      onAppointmentCreated?.(data.appointment);
      reset(initialAppointmentFormData);
      closeAddAppointmentModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to create appointment.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8"
      role="presentation"
      onMouseDown={closeAddAppointmentModal}
    >
      <section
        aria-modal="true"
        aria-labelledby="add-appointment-modal-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-[0_24px_70px_rgb(15_23_42/28%)]"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="add-appointment-modal-title"
            className="text-2xl font-semibold text-primary"
          >
            Add Appointment
          </h2>
          <button
            type="button"
            aria-label="Close add appointment modal"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={closeAddAppointmentModal}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mt-2">
            <div className="col-12">
              <Input
                LabelText="Appointment Title"
                required
                {...register("title", {
                  required: "Appointment title is required.",
                  validate: (title) =>
                    title.trim().length >= 2 ||
                    "Appointment title is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.title?.message ?? ""}
              </p>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 md:col-6">
              <Input
                LabelText="Date"
                required
                type="date"
                {...register("date", {
                  required: "Date is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.date?.message ?? ""}
              </p>
            </div>
            <div className="col-12 md:col-6">
              <Input
                LabelText="Start Time"
                required
                type="time"
                {...register("startTime", {
                  required: "Start time is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.startTime?.message ?? ""}
              </p>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <Select
                options={appointmentTypes}
                LabelText="Appointment Type"
                placeholder="Select appointment type"
                required
                {...register("appointmentType", {
                  required: "Appointment type is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.appointmentType?.message ?? ""}
              </p>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <Select
                options={providerOptions}
                LabelText="Which Doctor?"
                placeholder="Select a doctor"
                required
                {...register("providerId", {
                  required: "Doctor is required.",
                })}
              />
              <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                {errors.providerId?.message ?? ""}
              </p>
            </div>
          </div>
          {selectedProviderId === otherDoctorValue && (
            <div className="row mt-2">
              <div className="col-12">
                <Input
                  LabelText="Doctor Name"
                  required
                  {...register("doctorName", {
                    validate: (doctorName) =>
                      selectedProviderId !== otherDoctorValue ||
                      doctorName.trim().length >= 2 ||
                      "Doctor name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.doctorName?.message ?? ""}
                </p>
              </div>
            </div>
          )}
          <div className="row mt-2">
            <div className="col-12 flex justify-end">
              <Button
                varient="primary"
                type="submit"
                buttonText={
                  isLoading ? "Adding Appointment..." : "Add Appointment"
                }
                disabled={!isValid || isLoading}
              />
            </div>
          </div>
          {formError && (
            <p className="mt-4 text-sm font-semibold text-red-400">
              {formError}
            </p>
          )}
          {providersError && (
            <p className="mt-4 text-sm font-semibold text-red-400">
              {providersError}
            </p>
          )}
        </form>
      </section>
    </div>
  );
};
