"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/common/button";
import { Input } from "@/app/components/forms/input";
import { Select } from "@/app/components/forms/select";
import { usStates } from "@/app/data/usStates";
import { useOnboardingNavigation } from "@/app/hooks/useOnboardingNavigation";
import { CreateUserFormType } from "@/app/types/form-types";
import { createUser } from "@/app/api/auth/create-user/request";
import { AppError } from "@/backend/errors/app-error";

export default function SignupOnboardingPage() {
  const { handleNextStep } = useOnboardingNavigation();

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<CreateUserFormType>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      city: "",
      state: "",
    },
  });

  async function onSubmit(formData: CreateUserFormType) {
    setFormError("");
    setIsLoading(true);

    try {
      const user = await createUser(formData);
      await handleNextStep("/onboarding/providers");
    } catch (error) {
      if (error instanceof AppError && error.field === "email") {
        setError("email", {
          message: error.message,
        });

        return;
      }

      setFormError(
        error instanceof Error ? error.message : "Unable to create user.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mb-9">
      <div className="row my-10">
        <div className="col-12 mx-auto md:col-8">
          <h1 className="text-[30px] font-semibold text-primary">
            Create Account
          </h1>
          <p className="text-sm text-body">
            We want to get to know you. Add your account information here. This
            can all be updated later in the settings.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mx-auto md:col-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-6 md:mb-4">
              <div className="col-12 md:col-6 mb-6 md:mb-0">
                <Input
                  type="email"
                  required={true}
                  LabelText="Email"
                  {...register("email", {
                    required: "Enter a valid email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.email?.message ?? ""}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <Input
                  required={true}
                  type="password"
                  LabelText="Password"
                  {...register("password", {
                    required: "Password must contain at least 8 characters.",
                    minLength: {
                      value: 8,
                      message: "Password must contain at least 8 characters.",
                    },
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.password?.message ?? ""}
                </p>
              </div>
            </div>
            <div className="row mb-6 md:mb-4">
              <div className="col-12 md:col-6 mb-6 md:mb-0">
                <Input
                  required={true}
                  LabelText="First Name"
                  {...register("firstName", {
                    required: "First name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.firstName?.message ?? ""}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <Input
                  required={true}
                  LabelText="Last Name"
                  {...register("lastName", {
                    required: "Last name is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.lastName?.message ?? ""}
                </p>
              </div>
            </div>
            <div className="row mb-8 md:mb-4">
              <div className="col-12 md:col-6 mb-6 md:mb-0">
                <Input
                  required={true}
                  LabelText="City"
                  {...register("city", {
                    required: "City is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.city?.message ?? ""}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <Select
                  required={true}
                  LabelText="Select State"
                  options={usStates}
                  {...register("state", {
                    required: "State is required.",
                  })}
                />
                <p className="mt-2 min-h-5 text-xs font-semibold text-red-400">
                  {errors.state?.message ?? ""}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 flex justify-end">
                <Button
                  varient="primary"
                  type="submit"
                  buttonText={
                    isLoading ? "Creating Account..." : "Create Account"
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
          </form>
        </div>
      </div>
    </div>
  );
}
