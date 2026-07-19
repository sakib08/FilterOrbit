import { recordBrowseEvent } from "../utils/personalization";
import { useLanguage } from "../language/LanguageContext";

function inferDisplayMode(filterId, field) {
  const key = `${filterId || ""} ${field || ""}`.toLowerCase();
  if (key.includes("gender") || key.includes("sex")) return "pills";
  if (key.includes("size")) return "size";
  return "checkbox";
}

export function PillFilterGroup({
  label,
  filterId,
  field,
  options,
  selected,
  onToggle,
  displayMode,
  variant,
}) {
  const lang = useLanguage();
  const count = selected.length;
  const mode = displayMode || variant || inferDisplayMode(filterId, field);

  const renderCheckboxOptions = () => (
    <ul className="ppros_ecom_filter-checkbox-list" role="group" aria-label={label}>
      {options.map((opt) => {
        const checked = selected.some(
          (v) => String(v).toLowerCase() === String(opt.value).toLowerCase()
        );
        return (
          <li key={opt.value}>
            <label className="ppros_ecom_filter-checkbox-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  onToggle(opt.value);
                  recordBrowseEvent(filterId, opt.value);
                }}
              />
              <span className="ppros_ecom_filter-checkbox-row-label">{opt.label}</span>
              {opt.count != null && (
                <span className="ppros_ecom_filter-checkbox-row-count">{opt.count}</span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );

  const renderPillOptions = () => (
    <div className="ppros_ecom_filter-pill-group-body" role="group" aria-label={label}>
      {options.map((opt) => {
        const active = selected.some(
          (v) => String(v).toLowerCase() === String(opt.value).toLowerCase()
        );
        const pillClass = [
          "ppros_ecom_filter-pill",
          mode === "size" ? "ppros_ecom_filter-pill-size" : "",
          active ? "ppros_ecom_filter-pill-active" : "ppros_ecom_filter-pill-inactive",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onToggle(opt.value);
              recordBrowseEvent(filterId, opt.value);
            }}
            className={pillClass}
            aria-pressed={active}
          >
            {opt.label}
            {opt.count != null && opt.count > 0 && mode !== "size" && (
              <span className="ppros_ecom_filter-pill-count">{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const body =
    options.length === 0 ? (
      <p className="ppros_ecom_filter-pill-group-empty ppros_ecom_filter-pt-3">
        No options available
      </p>
    ) : mode === "checkbox" ? (
      renderCheckboxOptions()
    ) : (
      renderPillOptions()
    );

  return (
    <div className="ppros_ecom_filter-filter-section">
      <div className="ppros_ecom_filter-filter-section-header ppros_ecom_filter-cursor-default">
        <h3 className="ppros_ecom_filter-pill-group-label">{label}</h3>
        {count > 0 && (
          <span className="ppros_ecom_filter-pill-group-badge">{count}</span>
        )}
      </div>
      <div className="ppros_ecom_filter-filter-section-body">{body}</div>
    </div>
  );
}
