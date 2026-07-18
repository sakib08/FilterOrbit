import { recordBrowseEvent } from "../utils/personalization";

export function CheckboxFilterGroup({
  label,
  filterId,
  options,
  selected,
  onToggle,
}) {
  const count = selected.length;

  return (
    <div className="ppros_ecom_filter-filter-section">
      <div className="ppros_ecom_filter-filter-section-header ppros_ecom_filter-cursor-default">
        <h3 className="ppros_ecom_filter-section-title">{label}</h3>
        {count > 0 && (
          <span className="ppros_ecom_filter-pill-group-badge">{count}</span>
        )}
      </div>
      <div className="ppros_ecom_filter-filter-section-body">
        <ul className="ppros_ecom_filter-checkbox-list">
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
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
                  {opt.count !== undefined && (
                    <span className="ppros_ecom_filter-checkbox-row-count">{opt.count}</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
