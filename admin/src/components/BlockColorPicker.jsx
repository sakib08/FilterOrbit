import { normalizeHexColor } from "../../../src/lib/utils/blockColors.js";

export default function BlockColorPicker({ value, onChange, defaultColor = "#8b5cf6" }) {
  const color = normalizeHexColor(value, defaultColor);

  const handleTextChange = (raw) => {
    const next = normalizeHexColor(raw, "");
    if (next) {
      onChange(next);
    }
  };

  return (
    <div className="fo-flex fo-items-center fo-gap-3">
      <label className="fo-relative fo-shrink-0">
        <span className="fo-sr-only">Pick a color</span>
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(normalizeHexColor(e.target.value, defaultColor))}
          className="fo-h-10 fo-w-14 fo-cursor-pointer fo-appearance-none fo-rounded-lg fo-border fo-border-slate-200 fo-bg-white fo-p-1"
        />
      </label>
      <input
        type="text"
        value={color}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={(e) => onChange(normalizeHexColor(e.target.value, color))}
        placeholder={defaultColor}
        spellCheck={false}
        className="fo-min-w-0 fo-flex-1 fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-font-mono fo-text-sm fo-uppercase focus:fo-border-brand-400 focus:fo-outline-none focus:fo-ring-2 focus:fo-ring-brand-100"
      />
      <span
        aria-hidden
        className="fo-h-10 fo-w-10 fo-shrink-0 fo-rounded-lg fo-border fo-border-slate-200"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
