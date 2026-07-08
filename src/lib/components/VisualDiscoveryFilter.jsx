import { useState } from "react";
import { useLanguage } from "../language/LanguageContext";
import { ChevronDownIcon } from "./icons";

export function VisualDiscoveryFilter({
  label,
  options,
  selected,
  onToggle,
  accentColor = "#7c3aed",
}) {
  const lang = useLanguage();
  const count = selected.length;
  const [open, setOpen] = useState(true);
  const activeRingStyle = {
    boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${accentColor}`,
  };

  return (
    <div className="ppros_ecom_filter-filter-section">
      <button
        type="button"
        className="ppros_ecom_filter-filter-section-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h3 className="ppros_ecom_filter-section-title">{label}</h3>
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-2">
          {count > 0 && (
            <span className="ppros_ecom_filter-text-micro ppros_ecom_filter-font-bold ppros_ecom_filter-text-slate-400">
              {count} {lang.selected_label}
            </span>
          )}
          <ChevronDownIcon open={open} />
        </div>
      </button>

      {open && (
        <div className="ppros_ecom_filter-filter-section-body">
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
                      "ppros_ecom_filter-relative ppros_ecom_filter-h-12 ppros_ecom_filter-w-12 ppros_ecom_filter-overflow-hidden ppros_ecom_filter-rounded-full",
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
                      "ppros_ecom_filter-block ppros_ecom_filter-h-9 ppros_ecom_filter-w-9 ppros_ecom_filter-rounded-full",
                      active ? "" : "ppros_ecom_filter-ring-1 ppros_ecom_filter-ring-gray-200",
                    ].join(" ")}
                    style={{
                      backgroundColor: `#${hex}`,
                      ...(active ? activeRingStyle : {}),
                    }}
                  />
                  <span className="ppros_ecom_filter-text-micro ppros_ecom_filter-text-slate-500">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
