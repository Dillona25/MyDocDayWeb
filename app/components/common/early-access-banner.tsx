import { CreateAccountLink } from "@/app/components/auth/create-account-link";

export const EarlyAccessBanner = () => {
  return (
    <div className="early-access-banner">
      <div className="container flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <span>Mobile application coming soon.</span>
        <CreateAccountLink>Create Early Access Account Now!</CreateAccountLink>
      </div>
    </div>
  );
};
