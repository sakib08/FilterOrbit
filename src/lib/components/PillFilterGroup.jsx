import { recordBrowseEvent } from "../utils/personalization";
import { useLanguage } from "../language/LanguageContext";
import { getButtonColorTheme } from "../utils/blockColors";

export function PillFilterGroup({
  label,
  filterId,
  options,
  selected,
  onToggle,
  buttonColor,
}) {
  const lang = useLanguage();
  const count = selected.length;
  const buttonTheme = getButtonColorTheme(buttonColor);

  return (
    <div className="ppros_ecom_filter-panel">
      <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-center ppros_ecom_filter-mb-3">
        <h3 className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800">
          {label}
        </h3>
        {count > 0 && (
          <span className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-bold ppros_ecom_filter-tracking-widest ppros_ecom_filter-text-slate-500">
            {count} {lang.selected_label}
          </span>
        )}
      </div>
      <div className="ppros_ecom_filter-flex ppros_ecom_filter-flex-wrap ppros_ecom_filter-gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onToggle(opt.value);
                recordBrowseEvent(filterId, opt.value);
              }}
              className={[
                "ppros_ecom_filter-pill",
                active ? "ppros_ecom_filter-pill-active" : "ppros_ecom_filter-pill-inactive",
              ].join(" ")}
              style={
                active
                  ? {
                      borderColor: buttonTheme.border,
                      color: buttonTheme.text,
                      backgroundColor: buttonTheme.background,
                    }
                  : undefined
              }
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
