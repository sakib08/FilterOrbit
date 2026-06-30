export function Switch({ checked, onChange, className = "", ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`fo-switch fo-relative fo-h-6 fo-w-11 fo-shrink-0 fo-rounded-full fo-border-0 fo-p-0 fo-transition ${
        checked ? "fo-bg-brand-600" : "fo-bg-slate-300"
      } ${className}`.trim()}
      {...props}
    >
      <span
        className={`fo-pointer-events-none fo-absolute fo-top-0.5 fo-h-5 fo-w-5 fo-rounded-full fo-bg-white fo-shadow fo-transition ${
          checked ? "fo-left-5" : "fo-left-0.5"
        }`}
      />
    </button>
  );
}

export function Checkbox({ checked, onChange, className = "", ...props }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`fo-checkbox ${className}`.trim()}
      {...props}
    />
  );
}

export function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="fo-flex fo-cursor-pointer fo-items-center fo-justify-between fo-gap-4 fo-rounded-xl fo-border fo-border-slate-100 fo-bg-slate-50 fo-p-4">
      <div className="fo-min-w-0 fo-flex-1">
        <span className="fo-block fo-text-sm fo-font-semibold fo-text-slate-800">{label}</span>
        {description && (
          <span className="fo-mt-0.5 fo-block fo-text-xs fo-text-slate-500">{description}</span>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} />
    </label>
  );
}

export function Field({ label, description, children }) {
  return (
    <label className="fo-block">
      <span className="fo-mb-1 fo-block fo-text-sm fo-font-semibold fo-text-slate-800">{label}</span>
      {description && (
        <span className="fo-mb-2 fo-block fo-text-xs fo-text-slate-500">{description}</span>
      )}
      {children}
    </label>
  );
}

export const inputClass =
  "fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm focus:fo-border-brand-400 focus:fo-outline-none focus:fo-ring-2 focus:fo-ring-brand-100";
