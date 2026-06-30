import BlockColorPicker from "./BlockColorPicker";
import { resolveUiColors } from "../../../src/lib/utils/blockColors.js";

const COLOR_FIELDS = [
  {
    key: "color",
    label: "Background",
    hint: "Panel background tint",
  },
  {
    key: "buttonColor",
    label: "Button color",
    hint: "Pills, chips, submit & action buttons",
  },
  {
    key: "barColor",
    label: "Bar / slider color",
    hint: "Price range histogram bars and slider track",
  },
  {
    key: "accentColor",
    label: "Accent / link color",
    hint: "Icons, labels, prices, and text links",
  },
];

export default function UiColorSettings({ item, defaults, onChange }) {
  const ui = resolveUiColors(item, defaults);

  return (
    <div className="fo-space-y-4">
      {COLOR_FIELDS.map((field) => (
        <div key={field.key}>
          <div className="fo-mb-2">
            <span className="fo-block fo-text-xs fo-font-semibold fo-text-slate-500">
              {field.label}
            </span>
            <span className="fo-block fo-text-[11px] fo-text-slate-400">{field.hint}</span>
          </div>
          <BlockColorPicker
            value={item?.[field.key] ?? ui[field.key]}
            defaultColor={defaults[field.key] ?? ui[field.key]}
            onChange={(value) => onChange({ [field.key]: value })}
          />
        </div>
      ))}
    </div>
  );
}
