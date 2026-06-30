import { useState } from "react";
import { GradientIconBadge, SectionLabel } from "./icons";

const STORE_STYLES = {
  us: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  eu: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  uk: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  walmart: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-500" },
  ebay: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-500" },
};

export function GlobalSemanticFilter({
  stores = [],
  selectedStore,
  selectedLocale,
  onStoreChange,
  onLocaleChange,
  onSemanticSearch,
  onClearSemantic,
  semanticActive,
  sampleProducts = [],
}) {
  const [query, setQuery] = useState("");
  const locale = selectedLocale[0] ?? "en";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSemanticSearch(query.trim(), sampleProducts[0]);
  };

  return (
    <section>
      <SectionLabel
        colorClass="ppros_ecom_filter-text-indigo-600"
        icon={
          <svg className="ppros_ecom_filter-w-3.5 ppros_ecom_filter-h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" />
          </svg>
        }
      >
        Global Search
      </SectionLabel>

      <div className="ppros_ecom_filter-panel">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3 ppros_ecom_filter-mb-4">
          <GradientIconBadge from="from-blue-500" to="to-violet-500">
            <GlobeIcon />
          </GradientIconBadge>
          <div>
            <h3 className="ppros_ecom_filter-text-base ppros_ecom_filter-font-bold">
              Multi-Store Semantic Search
            </h3>
            <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-500">
              Search across stores &amp; languages with unified semantic ranking
            </p>
          </div>
        </div>

        <div className="ppros_ecom_filter-mb-4 ppros_ecom_filter-flex ppros_ecom_filter-flex-wrap ppros_ecom_filter-gap-2">
          <button
            type="button"
            className="ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-1.5 ppros_ecom_filter-rounded-full ppros_ecom_filter-border ppros_ecom_filter-border-gray-200 ppros_ecom_filter-bg-gray-50 ppros_ecom_filter-px-3 ppros_ecom_filter-py-1.5 ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium"
            onClick={() => onLocaleChange(locale === "en" ? "de" : "en")}
          >
            🌐 {String(locale).toUpperCase()} ▾
          </button>

          {stores.map((s) => {
            const active = selectedStore.includes(s.id);
            const style = STORE_STYLES[s.id] ?? STORE_STYLES.walmart;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStoreChange(s.id)}
                className={[
                  "ppros_ecom_filter-rounded-full ppros_ecom_filter-border ppros_ecom_filter-px-3 ppros_ecom_filter-py-1.5 ppros_ecom_filter-text-left ppros_ecom_filter-text-xs",
                  active
                    ? `${style.bg} ${style.border} ${style.text} ppros_ecom_filter-font-semibold`
                    : "ppros_ecom_filter-border-gray-200 ppros_ecom_filter-bg-gray-50 ppros_ecom_filter-text-gray-400",
                ].join(" ")}
              >
                <span className="ppros_ecom_filter-block ppros_ecom_filter-font-bold">{s.label}</span>
                <span className="ppros_ecom_filter-opacity-70">{s.currency} · {s.locale.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="ppros_ecom_filter-flex ppros_ecom_filter-gap-2">
          <div className="ppros_ecom_filter-flex ppros_ecom_filter-min-w-0 ppros_ecom_filter-flex-1 ppros_ecom_filter-items-center ppros_ecom_filter-gap-2 ppros_ecom_filter-rounded-xl ppros_ecom_filter-border ppros_ecom_filter-border-gray-200 ppros_ecom_filter-px-3 ppros_ecom_filter-py-2">
            <GlobeIcon className="ppros_ecom_filter-text-violet-500" />
            <input
              type="text"
              className="ppros_ecom_filter-min-w-0 ppros_ecom_filter-flex-1 ppros_ecom_filter-border-0 ppros_ecom_filter-bg-transparent ppros_ecom_filter-text-sm focus:ppros_ecom_filter-outline-none"
              placeholder="Search across all stores…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="ppros_ecom_filter-gradient-btn">
            <SearchIcon />
            Search
          </button>
        </form>

        {semanticActive && (
          <button
            type="button"
            className="ppros_ecom_filter-mt-3 ppros_ecom_filter-text-xs ppros_ecom_filter-font-medium ppros_ecom_filter-text-violet-600 hover:ppros_ecom_filter-underline"
            onClick={onClearSemantic}
          >
            Clear semantic match
          </button>
        )}

        <p className="ppros_ecom_filter-mt-4 ppros_ecom_filter-text-center ppros_ecom_filter-font-mono ppros_ecom_filter-text-[10px] ppros_ecom_filter-text-slate-500">
          ppros_ecom_filter v1.0 · Powered by semantic vectors
        </p>
      </div>
    </section>
  );
}

function GlobeIcon({ className = "ppros_ecom_filter-w-4 ppros_ecom_filter-h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}
