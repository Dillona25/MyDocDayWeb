import type { Metadata } from "next";
import { AddAppointmentModal } from "./components/modals/add-appointment-modal";
import { AddProviderModal } from "./components/modals/add-provider-modal";
import { DeleteAppointmentModal } from "./components/modals/delete-appointment-modal";
import { DeleteProviderModal } from "./components/modals/delete-provider-modal";
import { SignInModal } from "./components/modals/sign-in-modal";
import { ModalProvider } from "./store/modalContext";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "MyDocDay - Early Access Care Setup",
  description:
    "Create an early access MyDocDay account and set up your care profile before the mobile app launches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* This root-layout stylesheet applies the shared brand fonts app-wide. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ModalProvider>
          {children}
          <SignInModal />
          <AddProviderModal />
          <AddAppointmentModal />
          <DeleteProviderModal />
          <DeleteAppointmentModal />
        </ModalProvider>
      </body>
    </html>
  );
}
