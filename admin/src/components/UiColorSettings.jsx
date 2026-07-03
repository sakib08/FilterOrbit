import BlockColorPicker from "./BlockColorPicker";
import { resolveUiColors, normalizeHexColor } from "../../../src/lib/utils/blockColors.js";

/* ─── Field schemas per filter / block type ─────────────────────────────── */

const SCHEMAS = {
  /* Range slider: only the bar/slider track colour matters for filters.
     The outer shell colour is a secondary option.                          */
  range: {
    title: "Slider colours",
    fields: [
      {
        key: "barColor",
        label: "Slider & histogram colour",
        hint: "Histogram bars, slider track fill, and thumb accent",
        preview: "bar",
      },
      {
        key: "color",
        label: "Card border tint",
        hint: "Subtle tint on the outer card border and background",
        preview: "shell",
      },
    ],
  },

  /* Checkbox / pill filter (category, brand, attributes):
     Three colours drive the full pill-group UI.                            */
  checkbox: {
    title: "Pill filter colours",
    fields: [
      {
        key: "buttonColor",
        label: "Pill & header colour",
        hint: "Header background tint, active pill background & border",
        preview: "pill",
      },
      {
        key: "accentColor",
        label: "Label & text colour",
        hint: "Header label text and count badge fill",
        preview: "text",
      },
      {
        key: "color",
        label: "Card border tint",
        hint: "Subtle tint on the outer card border",
        preview: "shell",
      },
    ],
  },

  /* Visual discovery: accent for icon + button tint */
  visual: {
    title: "Visual filter colours",
    fields: [
      {
        key: "buttonColor",
        label: "Swatch border & active colour",
        hint: "Selected swatch ring and active state highlight",
        preview: "pill",
      },
      {
        key: "accentColor",
        label: "Accent / label colour",
        hint: "Icon tints and section label text",
        preview: "text",
      },
    ],
  },

  /* Layout blocks (NLP search, personalized, results bar, products grid) */
  block: {
    title: "Component colours",
    fields: [
      {
        key: "buttonColor",
        label: "Button colour",
        hint: "Primary action buttons, chips, submit",
        preview: "pill",
      },
      {
        key: "barColor",
        label: "Bar / progress colour",
        hint: "Confidence bars and histogram bars",
        preview: "bar",
      },
      {
        key: "accentColor",
        label: "Accent / link colour",
        hint: "Icons, prices, labels and text links",
        preview: "text",
      },
      {
        key: "color",
        label: "Card border tint",
        hint: "Outer card border background tint",
        preview: "shell",
      },
    ],
  },
};

function schemaFor(filterType, isBlock) {
  if (isBlock) return SCHEMAS.block;
  return SCHEMAS[filterType] ?? SCHEMAS.checkbox;
}

/* ─── Tiny inline preview swatch ────────────────────────────────────────── */

function PreviewSwatch({ type, color }) {
  const hex = normalizeHexColor(color, "#8b5cf6");

  // mix with white utility (inline so no import needed here)
  function mix(hex, amount) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const m = (c) => Math.round(c + (255 - c) * amount);
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }

  if (type === "bar") {
    return (
      <div className="fo-flex fo-items-end fo-gap-0.5 fo-h-7 fo-w-24 fo-rounded fo-overflow-hidden fo-bg-slate-100 fo-px-1.5 fo-pt-1">
        {[0.4, 0.7, 1, 0.85, 0.6, 0.3, 0.5, 0.9].map((h, i) => (
          <div
            key={i}
            className="fo-flex-1 fo-rounded-t-sm"
            style={{ height: `${h * 100}%`, backgroundColor: i % 2 === 0 ? hex : mix(hex, 0.3) }}
          />
        ))}
      </div>
    );
  }

  if (type === "pill") {
    return (
      <div className="fo-flex fo-gap-1.5 fo-items-center">
        <span
          className="fo-rounded-full fo-px-3 fo-py-1 fo-text-[11px] fo-font-semibold"
          style={{ backgroundColor: mix(hex, 0.85), color: hex, border: `1.5px solid ${mix(hex, 0.55)}` }}
        >
          Active
        </span>
        <span
          className="fo-rounded-full fo-px-3 fo-py-1 fo-text-[11px] fo-font-medium fo-text-slate-500"
          style={{ border: "1.5px solid #e2e8f0", backgroundColor: "#fff" }}
        >
          Inactive
        </span>
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="fo-flex fo-items-center fo-gap-2">
        <span className="fo-text-[13px] fo-font-bold" style={{ color: hex }}>Label text</span>
        <span
          className="fo-rounded-full fo-px-2 fo-py-0.5 fo-text-[10px] fo-font-bold fo-text-white"
          style={{ backgroundColor: hex }}
        >
          3 SELECTED
        </span>
      </div>
    );
  }

  if (type === "shell") {
    return (
      <div
        className="fo-h-7 fo-w-24 fo-rounded-lg fo-border-2"
        style={{ borderColor: mix(hex, 0.55), backgroundColor: mix(hex, 0.92) }}
      />
    );
  }

  return (
    <div className="fo-h-7 fo-w-7 fo-rounded-full fo-border fo-border-slate-200" style={{ backgroundColor: hex }} />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function UiColorSettings({ item, defaults, onChange, filterType, isBlock = false }) {
  const ui = resolveUiColors(item, defaults);
  const schema = schemaFor(filterType, isBlock);

  return (
    <div className="fo-space-y-1">
      <p className="fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-widest fo-text-slate-400 fo-mb-3">
        {schema.title}
      </p>

      <div className="fo-space-y-4">
        {schema.fields.map((field) => {
          const current = normalizeHexColor(item?.[field.key] ?? ui[field.key], "#8b5cf6");

          return (
            <div
              key={field.key}
              className="fo-rounded-xl fo-border fo-border-slate-100 fo-bg-slate-50 fo-p-3 fo-space-y-2"
            >
              {/* Label + hint */}
              <div className="fo-flex fo-items-start fo-justify-between fo-gap-2">
                <div>
                  <span className="fo-block fo-text-xs fo-font-semibold fo-text-slate-700">
                    {field.label}
                  </span>
                  <span className="fo-block fo-text-[11px] fo-text-slate-400 fo-mt-0.5">
                    {field.hint}
                  </span>
                </div>
              </div>

              {/* Live preview */}
              <div className="fo-flex fo-items-center fo-justify-start fo-rounded-lg fo-bg-white fo-border fo-border-slate-100 fo-px-3 fo-py-2">
                <PreviewSwatch type={field.preview} color={current} />
              </div>

              {/* Colour picker */}
              <BlockColorPicker
                value={current}
                defaultColor={defaults[field.key] ?? current}
                onChange={(value) => onChange({ [field.key]: value })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
