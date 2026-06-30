import { useCallback, useEffect, useState } from "react";
import { api, adminConfig } from "../api";
import { inputClass } from "../components/FormFields";
import AdminToast from "../components/AdminToast";
import {
  DEFAULT_LANGUAGE_STRINGS,
  LANGUAGE_STRING_GROUPS,
} from "../../../src/lib/language/defaults";

export default function LanguageSettings() {
  const [strings, setStrings] = useState({ ...DEFAULT_LANGUAGE_STRINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    api
      .getLanguageSettings()
      .then((data) => setStrings({ ...DEFAULT_LANGUAGE_STRINGS, ...data }))
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const update = (key, value) => {
    setStrings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setStrings({ ...DEFAULT_LANGUAGE_STRINGS });
    showToast("Reset to defaults. Save to apply.");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.saveLanguageSettings(strings);
      setStrings({ ...DEFAULT_LANGUAGE_STRINGS, ...(res.strings ?? strings) });
      showToast(adminConfig.i18n?.saved || "Saved successfully.");
    } catch (err) {
      showToast(err.message || adminConfig.i18n?.saveError, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fo-flex fo-h-64 fo-items-center fo-justify-center">
        <span className="fo-h-8 fo-w-8 fo-animate-spin fo-rounded-full fo-border-2 fo-border-brand-200 fo-border-t-brand-600" />
      </div>
    );
  }

  return (
    <>
      <div className="fo-mb-4 fo-flex fo-flex-wrap fo-items-center fo-justify-between fo-gap-3">
        <div>
          <h2 className="fo-text-xl fo-font-bold fo-text-slate-900">Language Settings</h2>
          <p className="fo-mt-1 fo-text-sm fo-text-slate-500">
            Customize all text shown on the storefront filter widget.
          </p>
        </div>
        <div className="fo-flex fo-gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="fo-rounded-xl fo-border fo-border-slate-200 fo-bg-white fo-px-4 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-slate-700 hover:fo-bg-slate-50"
          >
            Reset defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="fo-rounded-xl fo-bg-brand-600 fo-px-5 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-white hover:fo-bg-brand-700 disabled:fo-opacity-50"
          >
            {saving ? "Saving…" : "Save Language"}
          </button>
        </div>
      </div>

      <div className="fo-grid fo-gap-6 lg:fo-grid-cols-2">
        {LANGUAGE_STRING_GROUPS.map((group) => (
          <section
            key={group.id}
            className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm"
          >
            <h3 className="fo-mb-4 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
              {group.title}
            </h3>
            <div className="fo-space-y-3">
              {group.fields.map((field) => (
                <label key={field.key} className="fo-block">
                  <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">
                    {field.label}
                  </span>
                  <input
                    type="text"
                    value={strings[field.key] ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AdminToast message={toast?.message} type={toast?.type} />
    </>
  );
}
