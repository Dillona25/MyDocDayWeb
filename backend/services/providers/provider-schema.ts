import { z } from "zod";

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional();

export const createProviderSchema = z
  .object({
    firstName: optionalTrimmedString(100),
    lastName: optionalTrimmedString(100),
    clinicName: optionalTrimmedString(200),

    specialty: z
      .string()
      .trim()
      .min(2, "Specialty is required.")
      .max(150, "Specialty cannot exceed 150 characters."),

    type: z.enum(["provider", "clinic"]).default("provider"),

    phoneNumber: optionalTrimmedString(25),
    imageUrl: z
      .string()
      .trim()
      .transform((value) => (value.length > 0 ? value : undefined))
      .pipe(z.string().url("Enter a valid image URL.").optional())
      .optional(),
    streetAddress: optionalTrimmedString(255),
    city: optionalTrimmedString(100),
    state: optionalTrimmedString(100),
    zipCode: optionalTrimmedString(20),
  })
  .superRefine((provider, context) => {
    if (provider.type === "provider") {
      if (!provider.firstName || provider.firstName.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "First name is required.",
          path: ["firstName"],
        });
      }

      if (!provider.lastName || provider.lastName.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last name is required.",
          path: ["lastName"],
        });
      }

      return;
    }

    if (!provider.clinicName || provider.clinicName.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Clinic name is required.",
        path: ["clinicName"],
      });
    }
  });

export const deleteProviderSchema = z.object({
  providerId: z.number().int().positive("Provider id is required."),
});

export type CreateProviderSchemaInput = z.infer<typeof createProviderSchema>;
