import { useEffect, useMemo } from "react";
import { useZeroRequestFilter } from "../hooks/useZeroRequestFilter";
import { buildHistogram, getRangeBounds, getFilterOptions } from "../utils/filterEngine";
import { SearchWithAI } from "./SearchWithAI";
import { VisualDiscoveryFilter } from "./VisualDiscoveryFilter";
import { VisualDiscoveryUpload } from "./VisualDiscoveryUpload";
import { PersonalizedFilters } from "./PersonalizedFilters";
import { RangeSliderHistogram } from "./RangeSliderHistogram";
import { GlobalSemanticFilter } from "./GlobalSemanticFilter";
import { PillFilterGroup } from "./PillFilterGroup";
import {
  getDefaultUiColorsForBlock,
  getDefaultUiColorsForFilter,
  resolveUiColors,
} from "../utils/blockColors";
import "../styles.css";

const COLUMN_CLASS = {
  1: "ppros_ecom_filter-grid-cols-1",
  2: "ppros_ecom_filter-grid-cols-2",
  3: "ppros_ecom_filter-grid-cols-3",
};

function groupByColumn(items, columnCount) {
  const cols = Array.from({ length: columnCount }, () => []);
  items.forEach((item) => {
    const col = Math.min(Math.max(item.column ?? 0, 0), columnCount - 1);
    cols[col].push(item);
  });
  cols.forEach((col) => col.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  return cols;
}

export function EcomFilterPanel({
  onResultsChange,
  showGlobalFilters = true,
  showVisualUpload = true,
  layoutColumns = 1,
  className = "",
  ...config
}) {
  const engine = useZeroRequestFilter(config);
  const {
    filters,
    products,
    filterState,
    textQuery,
    setTextQuery,
    result,
    toggleFilter,
    setRangeFilter,
    clearFilters,
    applyNaturalLanguage,
    applySemanticStyle,
    clearSemantic,
    semanticActive,
    aiLoading,
    filterResetKey,
  } = engine;

  useEffect(() => {
    onResultsChange?.(result);
  }, [result, onResultsChange]);

  const visibleFilters = filters.filter((f) => !f.hidden);
  const columns = Math.min(Math.max(layoutColumns, 1), 3);
  const useLayout = columns > 1;

  const histograms = useMemo(() => {
    const map = {};
    for (const def of visibleFilters.filter((f) => f.type === "range")) {
      const { min, max } = getRangeBounds(def, products);
      map[def.id] = buildHistogram(products, def.field, min, max, 28);
    }
    return map;
  }, [visibleFilters, products]);

  const renderFilterBlock = (def, idx = 0) => {
    const defaults = getDefaultUiColorsForFilter(def.type);
    const ui = resolveUiColors(def, defaults);

    if (def.type === "range") {
      const { min, max } = getRangeBounds(def, products);
      const range = filterState[def.id] ?? [min, max];
      const formatValue =
        def.field === "price"
          ? (n) => `$${n}`
          : def.field === "rating"
            ? (n) => `${n}★`
            : (n) => `${n}`;

      return (
        <div key={def.id} className="ppros_ecom_filter-panel">
          <RangeSliderHistogram
            key={`${def.id}-${filterResetKey}`}
            label={def.label}
            unit={def.unit}
            min={min}
            max={max}
            value={[Number(range[0]), Number(range[1])]}
            histogram={histograms[def.id] ?? []}
            step={def.step ?? 1}
            barColor={ui.barColor}
            formatValue={formatValue}
            onChange={(lo, hi) => setRangeFilter(def.id, lo, hi)}
          />
        </div>
      );
    }

    if (def.type === "visual" && def.visualOptions) {
      return (
        <VisualDiscoveryFilter
          key={def.id}
          label={def.label}
          options={def.visualOptions}
          selected={filterState[def.id] ?? []}
          onToggle={(id) => toggleFilter(def.id, id)}
          accentColor={ui.accentColor}
        />
      );
    }

    if (def.options || def.type === "checkbox") {
      const opts = getFilterOptions(def, products);
      return (
        <PillFilterGroup
          key={def.id}
          label={def.label}
          filterId={def.id}
          options={opts}
          selected={filterState[def.id] ?? []}
          onToggle={(v) => toggleFilter(def.id, v)}
          buttonColor={ui.buttonColor}
        />
      );
    }

    return null;
  };

  const searchUi = resolveUiColors(
    {},
    getDefaultUiColorsForBlock("nlp_search")
  );
  const personalizedUi = resolveUiColors(
    {},
    getDefaultUiColorsForBlock("personalized")
  );
  const uploadUi = resolveUiColors(
    {},
    getDefaultUiColorsForBlock("visual_upload")
  );
  const resultsUi = resolveUiColors(
    {},
    getDefaultUiColorsForBlock("results_bar")
  );

  const rangeFilters = visibleFilters.filter((f) => f.type === "range");
  const pillFilters = visibleFilters.filter(
    (f) => f.options && f.type !== "visual" && f.type !== "range"
  );
  const visualFilters = visibleFilters.filter((f) => f.type === "visual");
  const columnGroups = useMemo(
    () => groupByColumn(visibleFilters, columns),
    [visibleFilters, columns]
  );

  return (
    <aside
      className={`ppros_ecom_filter-root ppros_ecom_filter-w-full ${columns === 1 ? "ppros_ecom_filter-max-w-md" : ""} ${className}`}
      aria-label="Product filters"
    >
      <div className="ppros_ecom_filter-space-y-5">
        <SearchWithAI
          textQuery={textQuery}
          onTextChange={setTextQuery}
          onAISubmit={applyNaturalLanguage}
          aiLoading={aiLoading}
          buttonColor={searchUi.buttonColor}
          accentColor={searchUi.accentColor}
        />

        {showGlobalFilters && config.stores && (
          <GlobalSemanticFilter
            stores={config.stores}
            selectedStore={filterState.storeId ?? []}
            selectedLocale={filterState.locale ?? []}
            onStoreChange={(id) => toggleFilter("storeId", id, false)}
            onLocaleChange={(loc) => toggleFilter("locale", loc, false)}
            onSemanticSearch={applySemanticStyle}
            onClearSemantic={clearSemantic}
            semanticActive={semanticActive}
            sampleProducts={products.slice(0, 5)}
          />
        )}

        <PersonalizedFilters
          filters={filters}
          products={products}
          filterState={filterState}
          onQuickFilter={(id, v) => toggleFilter(id, v)}
          buttonColor={personalizedUi.buttonColor}
          barColor={personalizedUi.barColor}
          accentColor={personalizedUi.accentColor}
        />

        {showVisualUpload && (
          <VisualDiscoveryUpload
            onImageSelect={() => {
              applySemanticStyle("visual style match from uploaded image");
            }}
            buttonColor={uploadUi.buttonColor}
            accentColor={uploadUi.accentColor}
          />
        )}

        {useLayout ? (
          <div className={`ppros_ecom_filter-grid ppros_ecom_filter-gap-4 ${COLUMN_CLASS[columns]}`}>
            {columnGroups.map((colFilters, colIndex) => (
              <div key={colIndex} className="ppros_ecom_filter-space-y-4">
                {colFilters.map((def, idx) => renderFilterBlock(def, idx))}
              </div>
            ))}
          </div>
        ) : (
          <>
            {rangeFilters.length > 0 &&
              rangeFilters.map((def, idx) => renderFilterBlock(def, idx))}

            {visualFilters.map((def) =>
              def.visualOptions ? renderFilterBlock(def) : null
            )}

            {pillFilters.map((def) => renderFilterBlock(def))}
          </>
        )}

        <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-center ppros_ecom_filter-px-1 ppros_ecom_filter-py-2">
          <span className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800">
            {result.total.toLocaleString()} products
          </span>
          <button
            type="button"
            className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium hover:ppros_ecom_filter-underline"
            style={{ color: resultsUi.accentColor }}
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      </div>
    </aside>
  );
}
