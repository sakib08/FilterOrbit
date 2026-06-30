import { recordBrowseEvent } from "../utils/personalization";

export function CheckboxFilterGroup({
  label,
  filterId,
  options,
  selected,
  onToggle,
}) {
  return (
    <div>
      <h3 className="ppros_ecom_filter-section-title">{label}</h3>
      <ul className="ppros_ecom_filter-space-y-1.5">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <li key={opt.value}>
              <label className="ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-2 ppros_ecom_filter-cursor-pointer ppros_ecom_filter-text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onToggle(opt.value);
                    recordBrowseEvent(filterId, opt.value);
                  }}
                  className="ppros_ecom_filter-rounded ppros_ecom_filter-border-slate-300 ppros_ecom_filter-text-violet-600"
                />
                <span className="ppros_ecom_filter-flex-1">{opt.label}</span>
                {opt.count !== undefined && (
                  <span className="ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
                    {opt.count}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
