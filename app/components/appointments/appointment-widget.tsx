interface AppointmentWidgetProps {
  title: string;
  date: string;
  startTime: string;
  appointmentType: "in_person" | "telehealth";
  doctorName?: string | null;
  onDelete?: () => void;
}

const appointmentTypeIcons = {
  in_person: (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0 fill-current"
      viewBox="0 0 640 640"
    >
      <path d="M160 128C160 92.7 188.7 64 224 64L416 64C451.3 64 480 92.7 480 128L480 192L544 192C579.3 192 608 220.7 608 256L608 512C608 547.3 579.3 576 544 576L96 576C60.7 576 32 547.3 32 512L32 256C32 220.7 60.7 192 96 192L160 192L160 128zM304 416C286.3 416 272 430.3 272 448L272 528L368 528L368 448C368 430.3 353.7 416 336 416L304 416zM160 432L160 400C160 391.2 152.8 384 144 384L112 384C103.2 384 96 391.2 96 400L96 432C96 440.8 103.2 448 112 448L144 448C152.8 448 160 440.8 160 432zM144 320C152.8 320 160 312.8 160 304L160 272C160 263.2 152.8 256 144 256L112 256C103.2 256 96 263.2 96 272L96 304C96 312.8 103.2 320 112 320L144 320zM544 432L544 400C544 391.2 536.8 384 528 384L496 384C487.2 384 480 391.2 480 400L480 432C480 440.8 487.2 448 496 448L528 448C536.8 448 544 440.8 544 432zM528 320C536.8 320 544 312.8 544 304L544 272C544 263.2 536.8 256 528 256L496 256C487.2 256 480 263.2 480 272L480 304C480 312.8 487.2 320 496 320L528 320zM296 168L296 200L264 200C255.2 200 248 207.2 248 216L248 232C248 240.8 255.2 248 264 248L296 248L296 280C296 288.8 303.2 296 312 296L328 296C336.8 296 344 288.8 344 280L344 248L376 248C384.8 248 392 240.8 392 232L392 216C392 207.2 384.8 200 376 200L344 200L344 168C344 159.2 336.8 152 328 152L312 152C303.2 152 296 159.2 296 168z" />
    </svg>
  ),
  telehealth: (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0 fill-current"
      viewBox="0 0 640 640"
    >
      <path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 391.7L537.4 463.2C553.1 475.8 576 464.6 576 444.5L576 195.5C576 175.4 553.1 164.2 537.4 176.8L448 248.3L448 192C448 156.7 419.3 128 384 128L128 128z" />
    </svg>
  ),
} as const;

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
  appointmentType,
  doctorName,
  onDelete,
}: AppointmentWidgetProps) => {
  const appointmentTypeLabel =
    appointmentType === "telehealth" ? "Telehealth" : "In Person";

  return (
    <article className="h-full rounded-lg border border-primary/40 bg-slate-50 p-5 shadow-[0_12px_28px_rgb(31_53_87/10%)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-secondary">
          Appointment
        </p>
        {onDelete && (
          <button
            type="button"
            aria-label={`Delete ${title}`}
            className="shrink-0 cursor-pointer text-[11px] font-semibold text-slate-400 hover:text-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
      <h3 className="mt-1 truncate text-lg font-semibold text-primary">
        {title}
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        {appointmentTypeIcons[appointmentType]}
        {appointmentTypeLabel}
      </p>

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
