interface ProviderWidgetProps {
  firstName?: string | null;
  lastName?: string | null;
  clinicName?: string | null;
  specialty: string;
  type?: "provider" | "clinic";
  phoneNumber?: string;
  imageUrl?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  onDelete?: () => void;
}

export const ProviderWidget = ({
  firstName,
  lastName,
  clinicName,
  specialty,
  type = "provider",
  phoneNumber,
  imageUrl,
  city,
  state,
  zipCode,
  onDelete,
}: ProviderWidgetProps) => {
  const displayName =
    type === "clinic"
      ? (clinicName ?? "Clinic")
      : [firstName, lastName].filter(Boolean).join(" ");
  const initials =
    type === "clinic"
      ? displayName.charAt(0).toUpperCase()
      : `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  const widgetLabel = type === "clinic" ? "Clinic" : "Provider";
  const location = [city, state].filter(Boolean).join(", ");

  return (
    <article className="h-full rounded-lg border border-primary/40 bg-slate-50 p-5 shadow-[0_12px_28px_rgb(31_53_87/10%)]">
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <img
            alt={displayName}
            className="size-16 shrink-0 rounded-lg object-cover"
            src={imageUrl}
          />
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase text-secondary">
              {widgetLabel}
            </p>
            {onDelete && (
              <button
                type="button"
                aria-label={`Delete ${displayName}`}
                className="shrink-0 cursor-pointer text-[11px] font-semibold text-slate-400 hover:text-red-600"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
          <h2 className="mt-1 truncate text-lg font-semibold text-primary">
            {displayName}
          </h2>
          <p className="text-sm font-medium text-slate-700">{specialty}</p>
        </div>
      </div>

      {(location || zipCode || phoneNumber) && (
        <div className="mt-5 flex items-start justify-between gap-3 border-t border-slate-100 pt-4">
          {(location || zipCode) && (
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Location
              </p>
              <p className="mt-1 text-sm text-body">
                {[location, zipCode].filter(Boolean).join(" ")}
              </p>
            </div>
          )}

          {phoneNumber && (
            <div className={location || zipCode ? "shrink-0 text-right" : ""}>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Phone
              </p>
              <p className="mt-1 text-sm text-body">{phoneNumber}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
