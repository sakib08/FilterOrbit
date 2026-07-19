import { useCallback, useEffect, useMemo, useState } from "react";
import { api, adminConfig } from "../api";
import { Field, Toggle, inputClass } from "../components/FormFields";
import AdminToast from "../components/AdminToast";

const FALLBACK_GOOGLE_FONTS = {
  "": "Theme / System default",
  "DM Sans": "DM Sans",
  Outfit: "Outfit",
  Inter: "Inter",
  Roboto: "Roboto",
  "Open Sans": "Open Sans",
  Lato: "Lato",
  Montserrat: "Montserrat",
  Poppins: "Poppins",
  Nunito: "Nunito",
  "Plus Jakarta Sans": "Plus Jakarta Sans",
};

const FALLBACK_FONT_SIZES = {
  10: "10px",
  11: "11px",
  12: "12px",
  13: "13px",
  14: "14px",
  15: "15px",
  16: "16px",
  18: "18px",
  20: "20px",
  22: "22px",
  24: "24px",
};

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const googleFonts = useMemo(() => {
    const fonts = adminConfig.googleFonts;
    if (fonts && typeof fonts === "object") {
      return fonts;
    }
    return FALLBACK_GOOGLE_FONTS;
  }, []);

  const fontSizeOptions = useMemo(() => {
    const sizes = adminConfig.fontSizeOptions;
    if (sizes && typeof sizes === "object") {
      return sizes;
    }
    return FALLBACK_FONT_SIZES;
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    const family = settings?.google_font;
    if (!family) return undefined;

    const id = "filter-orbit-settings-google-font";
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const encoded = String(family).replace(/ /g, "+");
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;
    return undefined;
  }, [settings?.google_font]);

  const update = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await api.saveSettings(settings);
      setSettings(res.settings ?? settings);
      showToast(adminConfig.i18n?.saved || "Saved successfully.");
    } catch (err) {
      showToast(err.message || adminConfig.i18n?.saveError, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="fo-flex fo-h-64 fo-items-center fo-justify-center">
        <span className="fo-h-8 fo-w-8 fo-animate-spin fo-rounded-full fo-border-2 fo-border-brand-200 fo-border-t-brand-600" />
      </div>
    );
  }

  const selectedFont = settings.google_font ?? "DM Sans";
  const labelFontSize = Number(settings.label_font_size ?? 11);
  const optionFontSize = Number(settings.option_font_size ?? 14);
  const titleFontSize = Number(settings.product_title_font_size ?? 14);
  const priceFontSize = Number(settings.product_price_font_size ?? 16);
  const previewStack = selectedFont
    ? `"${selectedFont}", system-ui, sans-serif`
    : "system-ui, -apple-system, sans-serif";

  return (
    <>
      <div className="fo-mb-4 fo-flex fo-items-center fo-justify-between">
        <div>
          <h2 className="fo-text-xl fo-font-bold fo-text-slate-900">Settings</h2>
          <p className="fo-mt-1 fo-text-sm fo-text-slate-500">
            Configure FilterOrbit behavior on your WooCommerce store.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="fo-rounded-xl fo-bg-brand-600 fo-px-5 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-white hover:fo-bg-brand-700 disabled:fo-opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      <div className="fo-grid fo-gap-6 lg:fo-grid-cols-2">
        <section className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm">
          <h3 className="fo-mb-4 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
            Features
          </h3>
          <div className="fo-space-y-3">
            <Toggle
              label="AI Natural Language Filter"
              description="Let shoppers describe what they want in plain English."
              checked={!!settings.enable_ai_filter}
              onChange={(v) => update("enable_ai_filter", v)}
            />
            <Toggle
              label="Visual Discovery"
              description="Enable image/color swatch filters for style and color."
              checked={!!settings.enable_visual_discovery}
              onChange={(v) => update("enable_visual_discovery", v)}
            />
            <Toggle
              label="Personalization"
              description="Reorder filters based on shopper browsing behavior."
              checked={!!settings.enable_personalization}
              onChange={(v) => update("enable_personalization", v)}
            />
            <Toggle
              label="Hide irrelevant filters"
              description="Hide filter groups with zero matching products."
              checked={!!settings.hide_irrelevant_filters}
              onChange={(v) => update("hide_irrelevant_filters", v)}
            />
            <Toggle
              label="Show product counts"
              description="Display product counts next to filter options."
              checked={!!settings.show_product_counts}
              onChange={(v) => update("show_product_counts", v)}
            />
            <Toggle
              label="Cache products client-side"
              description="Pre-load products for instant zero-request filtering."
              checked={!!settings.cache_products}
              onChange={(v) => update("cache_products", v)}
            />
          </div>

          {adminConfig.aiSettingsUrl && (
            <div className="fo-mt-4 fo-rounded-xl fo-bg-brand-50 fo-p-4">
              <p className="fo-text-sm fo-font-semibold fo-text-brand-800">AI &amp; RAG configuration</p>
              <p className="fo-mt-1 fo-text-xs fo-text-brand-600">
                Provider keys, models, and RAG indexing are managed on the{" "}
                <a href={adminConfig.aiSettingsUrl} className="fo-font-semibold fo-underline">
                  AI Settings
                </a>{" "}
                page.
              </p>
            </div>
          )}
        </section>

        <section className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm lg:fo-col-span-1">
          <h3 className="fo-mb-4 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
            Typography
          </h3>
          <div className="fo-space-y-4">
            <Field
              label="Body / UI font"
              description="DM Sans by default for body, options, product cards, and inputs. Headings stay on Outfit (display)."
            >
              <select
                value={selectedFont}
                onChange={(e) => update("google_font", e.target.value)}
                className={inputClass}
                style={{ fontFamily: previewStack }}
              >
                {Object.entries(googleFonts).map(([value, label]) => (
                  <option key={value || "__system"} value={value} style={{ fontFamily: value ? `"${value}", sans-serif` : "system-ui, sans-serif" }}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Label font size"
              description="Section headers — design default 11px (0.7rem), Outfit, uppercase."
            >
              <select
                value={labelFontSize}
                onChange={(e) => update("label_font_size", Number(e.target.value))}
                className={inputClass}
              >
                {Object.entries(fontSizeOptions).map(([value, label]) => (
                  <option key={value} value={Number(value)}>{label}</option>
                ))}
              </select>
            </Field>

            <Field
              label="Option font size"
              description="Checkbox / toggle / pill labels — design default 14px (text-sm). Size pills stay 12px."
            >
              <select
                value={optionFontSize}
                onChange={(e) => update("option_font_size", Number(e.target.value))}
                className={inputClass}
              >
                {Object.entries(fontSizeOptions).map(([value, label]) => (
                  <option key={value} value={Number(value)}>{label}</option>
                ))}
              </select>
            </Field>

            <Field
              label="Product title font size"
              description="Product card titles — design default 14px (text-sm)."
            >
              <select
                value={titleFontSize}
                onChange={(e) => update("product_title_font_size", Number(e.target.value))}
                className={inputClass}
              >
                {Object.entries(fontSizeOptions).map(([value, label]) => (
                  <option key={value} value={Number(value)}>{label}</option>
                ))}
              </select>
            </Field>

            <Field
              label="Product price font size"
              description="Product card prices — design default 16px (text-base). Original price scales to ~14px."
            >
              <select
                value={priceFontSize}
                onChange={(e) => update("product_price_font_size", Number(e.target.value))}
                className={inputClass}
              >
                {Object.entries(fontSizeOptions).map(([value, label]) => (
                  <option key={value} value={Number(value)}>{label}</option>
                ))}
              </select>
            </Field>

            <div
              className="fo-rounded-xl fo-border fo-border-slate-200 fo-bg-slate-50 fo-p-4"
              style={{ fontFamily: previewStack }}
            >
              <p className="fo-text-xs fo-font-semibold fo-uppercase fo-tracking-wide fo-text-slate-400 fo-mb-2">
                Preview
              </p>
              <p
                className="fo-font-semibold fo-uppercase fo-tracking-widest fo-text-slate-500"
                style={{ fontSize: `${labelFontSize}px` }}
              >
                Category
              </p>
              <div className="fo-mt-3 fo-flex fo-flex-wrap fo-gap-2">
                <span
                  className="fo-rounded-full fo-border fo-border-brand-300 fo-bg-brand-50 fo-px-3 fo-py-1 fo-font-medium fo-text-brand-700"
                  style={{ fontSize: `${optionFontSize}px` }}
                >
                  Pill option
                </span>
                <span
                  className="fo-rounded fo-border fo-border-slate-200 fo-bg-white fo-px-2 fo-py-1 fo-text-slate-700"
                  style={{ fontSize: `${optionFontSize}px` }}
                >
                  Size
                </span>
              </div>
              <label
                className="fo-mt-3 fo-flex fo-items-center fo-gap-2 fo-text-slate-700"
                style={{ fontSize: `${optionFontSize}px` }}
              >
                <input type="checkbox" defaultChecked readOnly />
                Listed checkbox
              </label>
              <div className="fo-mt-4 fo-border-t fo-border-slate-200 fo-pt-3">
                <p
                  className="fo-font-semibold fo-text-slate-800"
                  style={{ fontSize: `${titleFontSize}px` }}
                >
                  Product title
                </p>
                <p
                  className="fo-mt-1 fo-font-bold fo-text-slate-800"
                  style={{ fontSize: `${priceFontSize}px` }}
                >
                  $49.00
                </p>
              </div>
            </div>
          </div>

          <div className="fo-mt-6 fo-rounded-xl fo-bg-brand-50 fo-p-4">
            <p className="fo-text-sm fo-font-semibold fo-text-brand-800">Shortcode</p>
            <p className="fo-mt-1 fo-text-xs fo-text-brand-600">
              Place filters anywhere with: <code className="fo-rounded fo-bg-white fo-px-2 fo-py-0.5">[filter_orbit]</code>
            </p>
          </div>
        </section>
      </div>

      <AdminToast message={toast?.message} type={toast?.type} />
    </>
  );
}
