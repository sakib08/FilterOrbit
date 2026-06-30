import { adminConfig } from "../api";

export default function AdminLayout({ page, children }) {
  const { i18n = {}, designerUrl, settingsUrl, aiSettingsUrl, languageSettingsUrl } = adminConfig;

  const tabs = [
    { id: "designer", label: i18n.filterDesigner || "Filter Designer", href: designerUrl },
    { id: "settings", label: i18n.settings || "Settings", href: settingsUrl },
    { id: "ai", label: i18n.aiSettings || "AI Settings", href: aiSettingsUrl },
    { id: "language", label: i18n.languageSettings || "Language", href: languageSettingsUrl },
  ];

  return (
    <div className="filter-orbit-app fo-relative fo-min-h-screen fo-bg-slate-50">
      <header className="filter-orbit-app__header fo-border-b fo-border-slate-200 fo-bg-white">
        <div className="fo-mx-auto fo-flex fo-max-w-7xl fo-items-center fo-justify-between fo-gap-4 fo-px-6 fo-py-4">
          <div className="fo-flex fo-items-center fo-gap-3">
            <span className="fo-flex fo-h-10 fo-w-10 fo-items-center fo-justify-center fo-rounded-xl fo-bg-gradient-to-br fo-from-brand-500 fo-to-brand-700 fo-text-white fo-shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
            </span>
            <div>
              <h1 className="fo-m-0 fo-text-lg fo-font-bold fo-text-slate-900">
                {i18n.pluginName || "FilterOrbit"}
              </h1>
              <p className="fo-m-0 fo-mt-0.5 fo-text-xs fo-text-slate-500">
                Advanced WooCommerce Product Filters
              </p>
            </div>
          </div>

          <nav className="fo-flex fo-gap-1 fo-rounded-xl fo-bg-slate-100 fo-p-1">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                className={`fo-rounded-lg fo-px-4 fo-py-2 fo-text-sm fo-font-semibold fo-no-underline fo-transition ${
                  page === tab.id
                    ? "fo-bg-white fo-text-brand-700 fo-shadow-sm"
                    : "fo-text-slate-600 hover:fo-text-slate-900"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="fo-mx-auto fo-max-w-7xl fo-px-6 fo-py-6">{children}</main>
    </div>
  );
}
