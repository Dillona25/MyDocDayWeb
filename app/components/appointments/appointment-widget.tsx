interface AppointmentWidgetProps {
  title: string;
  date: string;
  startTime: string;
  doctorName?: string | null;
}

function formatAppointmentDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatAppointmentTime(startTime: string): string {
  const [hours, minutes] = startTime.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return startTime;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes));
}

export const AppointmentWidget = ({
  title,
  date,
  startTime,
  doctorName,
}: AppointmentWidgetProps) => {
  return (
    <article className="h-full rounded-lg border border-primary/40 bg-slate-50 p-5 shadow-[0_12px_28px_rgb(31_53_87/10%)]">
      <p className="text-xs font-semibold uppercase text-secondary">
        Appointment
      </p>
      <h3 className="mt-1 truncate text-lg font-semibold text-primary">
        {title}
      </h3>

      <div className="mt-5 flex items-start justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Date
          </p>
          <p className="mt-1 text-sm text-body">
            {formatAppointmentDate(date)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Time
          </p>
          <p className="mt-1 text-sm text-body">
            {formatAppointmentTime(startTime)}
          </p>
        </div>
      </div>

      {doctorName && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Doctor
          </p>
          <p className="mt-1 truncate text-sm text-body">{doctorName}</p>
        </div>
      )}
    </article>
  );
};
