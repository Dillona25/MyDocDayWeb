"use client";

import { useEffect, useState } from "react";
import { getAppointments } from "@/app/api/appointments/get/request";
import { AppointmentWidget } from "@/app/components/appointments/appointment-widget";
import { Button } from "@/app/components/common/button";
import { useOnboardingNavigation } from "@/app/hooks/useOnboardingNavigation";
import { useModal } from "@/app/store/modalContext";
import type { ReturnedAppointment } from "@/backend/services/appointments/appointment-types";

function sortAppointmentsByDateTime(
  appointments: ReturnedAppointment[],
): ReturnedAppointment[] {
  return [...appointments].sort((firstAppointment, secondAppointment) => {
    const firstDateTime = `${firstAppointment.date}T${firstAppointment.startTime}`;
    const secondDateTime = `${secondAppointment.date}T${secondAppointment.startTime}`;

    return firstDateTime.localeCompare(secondDateTime);
  });
}

export default function AppointmentsOnboardingPage() {
  const { handleNextStep, handlePreviousStep } = useOnboardingNavigation();
  const { openAddAppointmentModal } = useModal();
  const [appointments, setAppointments] = useState<ReturnedAppointment[]>([]);
  const [appointmentsError, setAppointmentsError] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getAppointments();
        setAppointments(sortAppointmentsByDateTime(data.appointments));
      } catch (error) {
        setAppointmentsError(
          error instanceof Error
            ? error.message
            : "Unable to load appointments.",
        );
      }
    }

    loadAppointments();
  }, []);

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] flex-col pb-14">
      <div className="row min-h-0 flex-1">
        <div className="col-12 mx-auto md:col-8">
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto rounded-lg border border-dashed border-primary/25 bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Appointments
                </h2>
                <p className="mt-1 max-w-md text-sm text-body">
                  Add upcoming appointments you want available in your
                  dashboard, or skip this step and add them later.
                </p>
              </div>
              <Button
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-primary hover:underline"
                buttonText="+ Add Appointment"
                onClick={() =>
                  openAddAppointmentModal((appointment) =>
                    setAppointments((current) =>
                      sortAppointmentsByDateTime([...current, appointment]),
                    ),
                  )
                }
              />
            </div>

            {appointmentsError && (
              <p className="mt-4 text-sm font-semibold text-red-400">
                {appointmentsError}
              </p>
            )}

            {appointments.length > 0 ? (
              <div className="row mt-6">
                {appointments.map((appointment) => (
                  <div className="col-12 mb-4 md:col-6" key={appointment.id}>
                    <AppointmentWidget
                      title={appointment.title}
                      date={appointment.date}
                      startTime={appointment.startTime}
                      doctorName={appointment.doctorName}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-primary/20 px-6 py-8 text-center">
                <h3 className="text-lg font-semibold text-primary">
                  No appointments added yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-body">
                  Add one now and it will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-12 shrink-0">
        <div className="col-12 mx-auto flex justify-between md:col-8">
          <Button
            varient="secondary"
            buttonText="Previous Step"
            onClick={() => handlePreviousStep("/onboarding/providers")}
          />
          <Button
            varient="primary"
            buttonText="Next Step"
            onClick={() => handleNextStep("/")}
          />
        </div>
      </div>
    </div>
  );
}
