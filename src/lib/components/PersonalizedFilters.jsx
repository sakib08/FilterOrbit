import { useMemo, useSyncExternalStore } from "react";
import {
  buildPersonalizationProfile,
  getRecommendedFilterIds,
  subscribeBrowseEvents,
} from "../utils/personalization";
import { useLanguage } from "../language/LanguageContext";
import { GradientIconBadge } from "./icons";
import { getBarColorTheme, getButtonColorTheme } from "../utils/blockColors";

export function PersonalizedFilters({
  filters = [],
  products = [],
  filterState = {},
  onQuickFilter,
  buttonColor = "#f43f5e",
  barColor = "#f43f5e",
  accentColor = "#f43f5e",
}) {
  const lang = useLanguage();
  const browseVersion = useSyncExternalStore(
    subscribeBrowseEvents,
    () => readBrowseSnapshot(),
    () => 0
  );

  const profile = useMemo(
    () => buildPersonalizationProfile(products, filters, filterState),
    [products, filters, filterState, browseVersion]
  );

  const recommendedIds = getRecommendedFilterIds();
  const recommended = filters.filter((f) => recommendedIds.includes(f.id));
  const buttonTheme = getButtonColorTheme(buttonColor);
  const barTheme = getBarColorTheme(barColor);

  const primaryChips = profile.quickChips.slice(0, 2);
  const secondaryChips = profile.quickChips.slice(2, 6);

  const handleChipClick = (chip) => {
    if (chip.filterId && chip.value !== undefined) {
      onQuickFilter?.(chip.filterId, chip.value);
    }
  };

  return (
    <section>
      <div className="ppros_ecom_filter-panel">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3 ppros_ecom_filter-mb-4">
          <GradientIconBadge style={{ background: buttonColor }}>
            <span className="ppros_ecom_filter-text-lg">✦</span>
          </GradientIconBadge>
          <div>
            <h3 className="ppros_ecom_filter-text-base ppros_ecom_filter-font-bold">
              {lang.personalized_title}
            </h3>
            <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-500">
              {profile.isLearning
                ? lang.personalized_description
                : `${lang.personalized_description} · ${profile.sessionLabel}`}
            </p>
          </div>
        </div>

        <div
          className="ppros_ecom_filter-mb-4 ppros_ecom_filter-rounded-2xl ppros_ecom_filter-border ppros_ecom_filter-p-4"
          style={{
            backgroundColor: buttonTheme.background,
            borderColor: buttonTheme.border,
          }}
        >
          <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-mb-4">
            <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3">
              <span
                className="ppros_ecom_filter-flex ppros_ecom_filter-h-10 ppros_ecom_filter-w-10 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full ppros_ecom_filter-text-sm ppros_ecom_filter-font-bold"
                style={{ backgroundColor: buttonTheme.background, color: buttonTheme.text }}
              >
                {profile.sessionInitials}
              </span>
              <div>
                <p className="ppros_ecom_filter-font-semibold">{profile.sessionLabel}</p>
                <p className="ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
                  {lang.personalized_model_confidence}{" "}
                  <span className="ppros_ecom_filter-font-bold" style={{ color: accentColor }}>
                    {profile.confidence}%
                  </span>
                </p>
              </div>
            </div>
            <span
              className="ppros_ecom_filter-rounded-full ppros_ecom_filter-px-2.5 ppros_ecom_filter-py-0.5 ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-bold ppros_ecom_filter-text-white"
              style={{ backgroundColor: buttonColor }}
            >
              ◆ {profile.isLearning ? "LEARNING" : lang.personalized_active_badge}
            </span>
          </div>

          {profile.metrics.length > 0 ? (
            <div className="ppros_ecom_filter-grid ppros_ecom_filter-grid-cols-2 ppros_ecom_filter-gap-3">
              {profile.metrics.map((metric) => (
                <Metric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  pct={metric.pct}
                  barTheme={barTheme}
                />
              ))}
            </div>
          ) : (
            <p className="ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
              Use filters to build your taste profile — recommendations update instantly.
            </p>
          )}
        </div>

        {recommended.length > 0 && (
          <p
            className="ppros_ecom_filter-mb-3 ppros_ecom_filter-text-xs"
            style={{ color: accentColor }}
          >
            {lang.personalized_prioritized_prefix}{" "}
            {recommended.map((f) => f.label).join(", ")}
          </p>
        )}

        {primaryChips.length > 0 && (
          <div className="ppros_ecom_filter-flex ppros_ecom_filter-flex-wrap ppros_ecom_filter-gap-2 ppros_ecom_filter-mb-3">
            {primaryChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="ppros_ecom_filter-rounded-full ppros_ecom_filter-px-4 ppros_ecom_filter-py-2 ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold"
                style={{
                  backgroundColor: buttonTheme.background,
                  color: buttonTheme.text,
                }}
              >
                {chip.label}{" "}
                {chip.count != null && (
                  <span className="ppros_ecom_filter-opacity-70">{chip.count}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {secondaryChips.length > 0 && (
          <div className="ppros_ecom_filter-flex ppros_ecom_filter-flex-wrap ppros_ecom_filter-gap-2 ppros_ecom_filter-mb-5">
            {secondaryChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="ppros_ecom_filter-rounded-full ppros_ecom_filter-border ppros_ecom_filter-bg-white ppros_ecom_filter-px-3 ppros_ecom_filter-py-1.5 ppros_ecom_filter-text-xs ppros_ecom_filter-font-medium"
                style={{ borderColor: buttonTheme.border, color: buttonTheme.text }}
              >
                {chip.icon ? `${chip.icon} ` : "♥ "}
                {chip.label}
              </button>
            ))}
          </div>
        )}

        <h4 className="ppros_ecom_filter-mb-3 ppros_ecom_filter-text-sm ppros_ecom_filter-font-bold">
          {lang.personalized_predicted_title}
        </h4>

        {profile.predictions.length > 0 ? (
          <ul className="ppros_ecom_filter-space-y-2">
            {profile.predictions.map((product) => (
              <li
                key={product.id}
                className="ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-3 ppros_ecom_filter-rounded-xl ppros_ecom_filter-border ppros_ecom_filter-border-gray-100 ppros_ecom_filter-p-3"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="ppros_ecom_filter-h-12 ppros_ecom_filter-w-12 ppros_ecom_filter-rounded-lg ppros_ecom_filter-object-cover"
                  />
                ) : (
                  <div className="ppros_ecom_filter-flex ppros_ecom_filter-h-12 ppros_ecom_filter-w-12 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-lg ppros_ecom_filter-bg-slate-100 ppros_ecom_filter-text-lg">
                    📦
                  </div>
                )}
                <div className="ppros_ecom_filter-min-w-0 ppros_ecom_filter-flex-1">
                  <p className="ppros_ecom_filter-truncate ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold">
                    {product.title}
                  </p>
                  <span
                    className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-medium"
                    style={{ color: accentColor }}
                  >
                    {product.tag}
                  </span>
                  <p className="ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
                    {product.reason}
                  </p>
                </div>
                <div className="ppros_ecom_filter-text-right">
                  <p className="ppros_ecom_filter-font-bold">
                    {product.currency ? `${product.currency} ` : "$"}
                    {product.price.toFixed(2)}
                  </p>
                  <p
                    className="ppros_ecom_filter-text-xs ppros_ecom_filter-font-semibold"
                    style={{ color: accentColor }}
                  >
                    {product.fit}% {lang.fit_label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
            No products available for recommendations yet.
          </p>
        )}
      </div>
    </section>
  );
}

function readBrowseSnapshot() {
  try {
    return sessionStorage.getItem("ppros_ecom_filter_browse") ?? "";
  } catch {
    return "";
  }
}

function Metric({ label, value, pct, barTheme }) {
  return (
    <div>
      <p className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-bold ppros_ecom_filter-text-slate-500">
        {label}
      </p>
      <p className="ppros_ecom_filter-text-xs ppros_ecom_filter-font-semibold ppros_ecom_filter-mb-1 ppros_ecom_filter-line-clamp-2">
        {value}
      </p>
      <div
        className="ppros_ecom_filter-h-1.5 ppros_ecom_filter-rounded-full"
        style={{ backgroundColor: barTheme.inactive }}
      >
        <div
          className="ppros_ecom_filter-h-full ppros_ecom_filter-rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barTheme.active }}
        />
      </div>
    </div>
  );
}
