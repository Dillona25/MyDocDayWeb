import { z } from "zod";

export const createAppointmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Appointment title is required.")
      .max(150, "Appointment title cannot exceed 150 characters."),

    date: z
      .string()
      .trim()
      .min(1, "Date is required.")
      .refine((date) => !Number.isNaN(Date.parse(`${date}T00:00:00`)), {
        message: "Enter a valid date.",
      }),

    startTime: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time."),

    appointmentType: z.enum(["in_person", "telehealth"]),

    providerId: z.number().int().positive("Doctor is required.").optional(),

    doctorName: z
      .string()
      .trim()
      .max(200, "Doctor name cannot exceed 200 characters.")
      .transform((value) => (value.length > 0 ? value : undefined))
      .optional(),
  })
  .refine(
    (appointment) =>
      appointment.providerId !== undefined ||
      appointment.doctorName !== undefined,
    {
      message: "Doctor is required.",
      path: ["providerId"],
    },
  );

export type CreateAppointmentSchemaInput = z.infer<
  typeof createAppointmentSchema
>;

export const deleteAppointmentSchema = z.object({
  appointmentId: z.number().int().positive("Appointment id is required."),
});
