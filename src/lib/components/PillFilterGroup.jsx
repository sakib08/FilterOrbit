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
  accentColor,
}) {
  const lang = useLanguage();
  const count = selected.length;
  const buttonTheme = getButtonColorTheme(buttonColor);
  // accentColor overrides the header label / badge text; falls back to buttonColor
  const labelColor = accentColor || buttonTheme.text;

  return (
    <div className="ppros_ecom_filter-pill-group">
      {/* Coloured header strip */}
      <div
        className="ppros_ecom_filter-pill-group-header"
        style={{ backgroundColor: buttonTheme.background, borderBottomColor: buttonTheme.border }}
      >
        <h3
          className="ppros_ecom_filter-pill-group-label"
          style={{ color: labelColor }}
        >
          {label}
        </h3>
        {count > 0 && (
          <span
            className="ppros_ecom_filter-pill-group-badge"
            style={{ backgroundColor: labelColor, color: "#ffffff" }}
          >
            {count} {lang.selected_label}
          </span>
        )}
      </div>

      {/* Pills area */}
      <div
        className="ppros_ecom_filter-pill-group-body"
        role="group"
        aria-label={label}
      >
        {options.length === 0 ? (
          <p className="ppros_ecom_filter-pill-group-empty">No options available</p>
        ) : (
          options.map((opt) => {
            const active = selected.some(
              (v) => String(v).toLowerCase() === String(opt.value).toLowerCase()
            );
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
                        boxShadow: `0 0 0 3px ${buttonTheme.background}`,
                      }
                    : undefined
                }
                aria-pressed={active}
              >
                {opt.label}
                {opt.count != null && opt.count > 0 && (
                  <span className="ppros_ecom_filter-pill-count">{opt.count}</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
