import { recordBrowseEvent } from "../utils/personalization";
import { ChevronDownIcon } from "./icons";
import { useState } from "react";

export function CheckboxFilterGroup({
  label,
  filterId,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const count = selected.length;

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
            <span className="ppros_ecom_filter-pill-group-badge">{count}</span>
          )}
          <ChevronDownIcon open={open} />
        </div>
      </button>
      {open && (
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
      )}
    </div>
  );
}
