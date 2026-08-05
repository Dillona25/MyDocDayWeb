"use client";

import { clearSession } from "@/app/api/auth/session/request";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type CreateAccountLinkProps = {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export const CreateAccountLink = ({
  children,
  className,
  onNavigate,
}: CreateAccountLinkProps) => {
  const router = useRouter();

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNavigate?.();

    try {
      await clearSession();
    } finally {
      router.push("/onboarding/");
    }
  }

  return (
    <a className={className} href="/onboarding/" onClick={handleClick}>
      {children}
    </a>
  );
};
