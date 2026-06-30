import { useMemo } from "react";
import { buildHistogram } from "../utils/filterEngine";
import { RangeSliderHistogram } from "./RangeSliderHistogram";
import { GradientIconBadge } from "./icons";

export function RangeFiltersPanel({
  filters,
  products,
  filterState,
  onRangeChange,
  itemCount,
}) {
  const rangeFilters = filters.filter((f) => f.type === "range");

  const histograms = useMemo(() => {
    const map = {};
    for (const def of rangeFilters) {
      const min = def.min ?? 0;
      const max = def.max ?? 100;
      map[def.id] = buildHistogram(products, def.field, min, max, 28);
    }
    return map;
  }, [rangeFilters, products]);

  if (rangeFilters.length === 0) return null;

  return (
    <section>
      <div className="ppros_ecom_filter-panel">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-items-start ppros_ecom_filter-justify-between ppros_ecom_filter-gap-3 ppros_ecom_filter-mb-5">
          <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3">
            <GradientIconBadge from="from-violet-500" to="to-purple-600">
              <SliderIcon />
            </GradientIconBadge>
            <div>
              <h3 className="ppros_ecom_filter-text-base ppros_ecom_filter-font-bold">
                Range Sliders + Histogram
              </h3>
              <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-500">
                Visualize product distribution across filter ranges
              </p>
            </div>
          </div>
          <span className="ppros_ecom_filter-badge ppros_ecom_filter-shrink-0">
            <ChartIcon />
            {itemCount.toLocaleString()} items
          </span>
        </div>

        <div className="ppros_ecom_filter-space-y-6">
          {rangeFilters.map((def, idx) => {
            const min = def.min ?? 0;
            const max = def.max ?? 100;
            const range = filterState[def.id] ?? [min, max];
            const accent = def.accent ?? (idx % 2 === 0 ? "violet" : "teal");
            const formatValue =
              def.id === "price"
                ? (n) => `$${n}`
                : def.id === "rating"
                  ? (n) => `${n}★`
                  : (n) => `${n}g`;

            return (
              <div
                key={def.id}
                className={
                  idx < rangeFilters.length - 1
                    ? "ppros_ecom_filter-pb-6 ppros_ecom_filter-border-b ppros_ecom_filter-border-gray-100"
                    : ""
                }
              >
                <RangeSliderHistogram
                  label={def.label}
                  unit={def.unit}
                  min={min}
                  max={max}
                  value={[Number(range[0]), Number(range[1])]}
                  histogram={histograms[def.id] ?? []}
                  step={def.step ?? 1}
                  accent={accent}
                  formatValue={formatValue}
                  onChange={(lo, hi) => onRangeChange(def.id, lo, hi)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SliderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 14h16M4 10h16" />
      <circle cx="8" cy="10" r="2" fill="currentColor" />
      <circle cx="16" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="4" width="4" height="17" rx="1" />
    </svg>
  );
}
