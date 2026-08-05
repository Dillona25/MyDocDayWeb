"use client";

import { useState } from "react";
import { deleteProvider } from "@/app/api/providers/delete/request";
import { useModal } from "@/app/store/modalContext";
import { Button } from "../common/button";

export const DeleteProviderModal = () => {
  const {
    isDeleteProviderModalOpen,
    closeDeleteProviderModal,
    providerToDelete,
    onProviderDeleted,
  } = useModal();
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteProviderModalOpen || !providerToDelete) {
    return null;
  }

  const provider = providerToDelete;

  function handleClose() {
    setDeleteError("");
    closeDeleteProviderModal();
  }

  async function handleDelete() {
    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteProvider({ providerId: provider.id });
      onProviderDeleted?.(provider.id);
      handleClose();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete provider.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8"
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        aria-modal="true"
        aria-labelledby="delete-provider-modal-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_24px_70px_rgb(15_23_42/28%)]"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="delete-provider-modal-title"
              className="text-2xl font-semibold text-primary"
            >
              Delete Provider
            </h2>
            <p className="mt-3 text-sm text-body">
              Are you sure you want to delete this doctor? Any appointments
              attached to this doctor will also be deleted. This cannot be
              undone.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close delete provider modal"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>

        {deleteError && (
          <p className="mt-4 text-sm font-semibold text-red-400">
            {deleteError}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="rounded-lg border border-primary/20 px-4 py-2 text-primary hover:bg-primary/5"
            buttonText="Cancel"
            disabled={isDeleting}
            onClick={handleClose}
            type="button"
          />
          <Button
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            buttonText={isDeleting ? "Deleting..." : "Delete"}
            disabled={isDeleting}
            onClick={handleDelete}
            type="button"
          />
        </div>
      </section>
    </div>
  );
};
