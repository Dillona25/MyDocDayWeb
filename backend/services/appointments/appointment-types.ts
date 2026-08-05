export type AppointmentType = "in_person" | "telehealth";

export type CreateAppointmentInput = {
  userId: number;
  title: string;
  date: string;
  startTime: string;
  appointmentType: AppointmentType;
  providerId?: number;
  doctorName?: string;
};

export type DeleteAppointmentInput = {
  userId: number;
  appointmentId: number;
};

export type ReturnedAppointment = {
  id: number;
  userId: number;
  providerId: number | null;
  title: string;
  date: string;
  startTime: string;
  appointmentType: AppointmentType;
  doctorName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentRow = {
  id: number;
  user_id: number;
  provider_id: number | null;
  title: string;
  appointment_date: Date | string;
  start_time: string;
  appointment_type: AppointmentType;
  doctor_name: string | null;
  created_at: Date;
  updated_at: Date;
};
