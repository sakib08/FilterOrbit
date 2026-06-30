import { useLanguage } from "../language/LanguageContext";

export function VisualDiscoveryFilter({
  label,
  options,
  selected,
  onToggle,
  accentColor = "#14b8a6",
}) {
  const lang = useLanguage();
  const count = selected.length;
  const activeRingStyle = {
    boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${accentColor}`,
  };

  return (
    <div className="ppros_ecom_filter-panel">
      <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-center ppros_ecom_filter-mb-4">
        <h3 className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold">{label}</h3>
        {count > 0 && (
          <span className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-bold ppros_ecom_filter-tracking-widest ppros_ecom_filter-text-slate-500">
            {count} {lang.selected_label}
          </span>
        )}
      </div>
      <div
        className="ppros_ecom_filter-flex ppros_ecom_filter-flex-wrap ppros_ecom_filter-gap-3"
        role="group"
        aria-label={label}
      >
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          const hex = opt.hexColor ?? "94A3B8";

          if (opt.imageUrl && !opt.hexColor) {
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onToggle(opt.id)}
                className={[
                  "ppros_ecom_filter-relative ppros_ecom_filter-h-14 ppros_ecom_filter-w-14 ppros_ecom_filter-overflow-hidden ppros_ecom_filter-rounded-xl",
                  active ? "" : "ppros_ecom_filter-ring-1 ppros_ecom_filter-ring-gray-200",
                ].join(" ")}
                style={active ? activeRingStyle : undefined}
                aria-pressed={active}
                title={opt.label}
              >
                <img
                  src={opt.imageUrl}
                  alt={opt.alt ?? opt.label}
                  className="ppros_ecom_filter-h-full ppros_ecom_filter-w-full ppros_ecom_filter-object-cover"
                />
              </button>
            );
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              className="ppros_ecom_filter-flex ppros_ecom_filter-flex-col ppros_ecom_filter-items-center ppros_ecom_filter-gap-1"
              aria-pressed={active}
              title={opt.label}
            >
              <span
                className={[
                  "ppros_ecom_filter-block ppros_ecom_filter-h-10 ppros_ecom_filter-w-10 ppros_ecom_filter-rounded-full",
                  active ? "" : "ppros_ecom_filter-ring-1 ppros_ecom_filter-ring-gray-200",
                ].join(" ")}
                style={{
                  backgroundColor: `#${hex}`,
                  ...(active ? activeRingStyle : {}),
                }}
              />
              <span className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-text-slate-500">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
