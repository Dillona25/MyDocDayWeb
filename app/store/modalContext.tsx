"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import type { ReturnedProvider } from "@/backend/services/providers/provider-types";
import type { ReturnedAppointment } from "@/backend/services/appointments/appointment-types";

type ProviderCreatedHandler = (provider: ReturnedProvider) => void;
type ProviderDeletedHandler = (providerId: number) => void;
type AppointmentCreatedHandler = (appointment: ReturnedAppointment) => void;
type AppointmentDeletedHandler = (appointmentId: number) => void;

interface ModalContextType {
  isSignInModalOpen: boolean;
  isAddProviderModalOpen: boolean;
  isAddAppointmentModalOpen: boolean;
  isDeleteProviderModalOpen: boolean;
  isDeleteAppointmentModalOpen: boolean;
  onProviderCreated?: ProviderCreatedHandler;
  onAppointmentCreated?: AppointmentCreatedHandler;
  providerToDelete?: ReturnedProvider;
  appointmentToDelete?: ReturnedAppointment;
  onProviderDeleted?: ProviderDeletedHandler;
  onAppointmentDeleted?: AppointmentDeletedHandler;
  openSignInModal: () => void;
  closeSignInModal: () => void;
  openAddProviderModal: (onProviderCreated?: ProviderCreatedHandler) => void;
  closeAddProviderModal: () => void;
  openAddAppointmentModal: (
    onAppointmentCreated?: AppointmentCreatedHandler,
  ) => void;
  closeAddAppointmentModal: () => void;
  openDeleteProviderModal: (
    provider: ReturnedProvider,
    onProviderDeleted?: ProviderDeletedHandler,
  ) => void;
  closeDeleteProviderModal: () => void;
  openDeleteAppointmentModal: (
    appointment: ReturnedAppointment,
    onAppointmentDeleted?: AppointmentDeletedHandler,
  ) => void;
  closeDeleteAppointmentModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState(false);
  const [isDeleteProviderModalOpen, setIsDeleteProviderModalOpen] =
    useState(false);
  const [isDeleteAppointmentModalOpen, setIsDeleteAppointmentModalOpen] =
    useState(false);
  const [onProviderCreated, setOnProviderCreated] =
    useState<ProviderCreatedHandler>();
  const [onAppointmentCreated, setOnAppointmentCreated] =
    useState<AppointmentCreatedHandler>();
  const [providerToDelete, setProviderToDelete] = useState<ReturnedProvider>();
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<ReturnedAppointment>();
  const [onProviderDeleted, setOnProviderDeleted] =
    useState<ProviderDeletedHandler>();
  const [onAppointmentDeleted, setOnAppointmentDeleted] =
    useState<AppointmentDeletedHandler>();

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);
  const openAddProviderModal = (handler?: ProviderCreatedHandler) => {
    setOnProviderCreated(() => handler);
    setIsAddProviderModalOpen(true);
  };
  const closeAddProviderModal = () => {
    setIsAddProviderModalOpen(false);
    setOnProviderCreated(undefined);
  };
  const openAddAppointmentModal = (handler?: AppointmentCreatedHandler) => {
    setOnAppointmentCreated(() => handler);
    setIsAddAppointmentModalOpen(true);
  };
  const closeAddAppointmentModal = () => {
    setIsAddAppointmentModalOpen(false);
    setOnAppointmentCreated(undefined);
  };
  const openDeleteProviderModal = (
    provider: ReturnedProvider,
    handler?: ProviderDeletedHandler,
  ) => {
    setProviderToDelete(provider);
    setOnProviderDeleted(() => handler);
    setIsDeleteProviderModalOpen(true);
  };
  const closeDeleteProviderModal = () => {
    setIsDeleteProviderModalOpen(false);
    setProviderToDelete(undefined);
    setOnProviderDeleted(undefined);
  };
  const openDeleteAppointmentModal = (
    appointment: ReturnedAppointment,
    handler?: AppointmentDeletedHandler,
  ) => {
    setAppointmentToDelete(appointment);
    setOnAppointmentDeleted(() => handler);
    setIsDeleteAppointmentModalOpen(true);
  };
  const closeDeleteAppointmentModal = () => {
    setIsDeleteAppointmentModalOpen(false);
    setAppointmentToDelete(undefined);
    setOnAppointmentDeleted(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isSignInModalOpen,
        isAddProviderModalOpen,
        isAddAppointmentModalOpen,
        isDeleteProviderModalOpen,
        isDeleteAppointmentModalOpen,
        onProviderCreated,
        onAppointmentCreated,
        providerToDelete,
        appointmentToDelete,
        onProviderDeleted,
        onAppointmentDeleted,
        openSignInModal,
        closeSignInModal,
        openAddProviderModal,
        closeAddProviderModal,
        openAddAppointmentModal,
        closeAddAppointmentModal,
        openDeleteProviderModal,
        closeDeleteProviderModal,
        openDeleteAppointmentModal,
        closeDeleteAppointmentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error("useModal must be used inside a ModalProvider");
  }

  return context;
}
