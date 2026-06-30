import { useCallback, useEffect, useState } from "react";
import { api, adminConfig } from "../api";
import { Field, Toggle, inputClass } from "../components/FormFields";
import AdminToast from "../components/AdminToast";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

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
            Display
          </h3>
          <div className="fo-grid fo-gap-4">
            <Field label="Products per page">
              <input
                type="number"
                min={1}
                max={100}
                value={settings.products_per_page ?? 12}
                onChange={(e) => update("products_per_page", Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Sidebar position">
              <select
                value={settings.sidebar_position || "left"}
                onChange={(e) => update("sidebar_position", e.target.value)}
                className={inputClass}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </Field>
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
