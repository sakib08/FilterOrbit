import { useEffect, useMemo } from "react";
import { useZeroRequestFilter } from "../hooks/useZeroRequestFilter";
import { buildHistogram, getRangeBounds, getFilterOptions } from "../utils/filterEngine";
import { SearchWithAI } from "./SearchWithAI";
import { VisualDiscoveryFilter } from "./VisualDiscoveryFilter";
import { VisualDiscoveryUpload } from "./VisualDiscoveryUpload";
import { PersonalizedFilters } from "./PersonalizedFilters";
import { RangeSliderHistogram } from "./RangeSliderHistogram";
import { PillFilterGroup } from "./PillFilterGroup";
import { ProductGrid } from "./ProductGrid";
import { BlockColorShell } from "./BlockColorShell";
import {
  getDefaultUiColorsForBlock,
  getDefaultUiColorsForFilter,
  resolveUiColors,
} from "../utils/blockColors";
import { LanguageProvider } from "../language/LanguageContext";
import { useLanguage } from "../language/LanguageContext";

function getColumnItems(filters, blocks, colIndex) {
  const items = [
    ...filters
      .filter((f) => (f.column ?? 0) === colIndex && f.enabled !== false)
      .map((f) => ({ kind: "filter", id: f.id, order: f.order ?? 0, data: f })),
    ...blocks
      .filter((b) => (b.column ?? 0) === colIndex && b.enabled !== false)
      .map((b) => ({ kind: "block", id: b.id, order: b.order ?? 0, data: b })),
  ];
  return items.sort((a, b) => a.order - b.order);
}

function gridTemplateColumns(columns) {
  const total = columns.reduce((sum, c) => sum + (c.width || 0), 0) || 100;
  return columns.map((c) => `${((c.width / total) * 100).toFixed(4)}%`).join(" ");
}

function defaultPageLayout() {
  return {
    columns: [
      { id: "col_0", width: 30 },
      { id: "col_1", width: 70 },
    ],
    blocks: [
      { id: "nlp_search", type: "nlp_search", column: 0, order: 0, enabled: true, color: "#8b5cf6" },
      { id: "personalized_filters", type: "personalized", column: 0, order: 1, enabled: true, color: "#f43f5e" },
      { id: "results_bar", type: "results_bar", column: 0, order: 99, enabled: true, color: "#64748b" },
      {
        id: "products_grid",
        type: "products",
        column: 1,
        order: 0,
        enabled: true,
        productGridColumns: 3,
        color: "#f59e0b",
      },
    ],
  };
}

function ResultsBar({ total, onClear, accentColor = "#8b5cf6" }) {
  const lang = useLanguage();
  return (
    <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-center ppros_ecom_filter-px-1 ppros_ecom_filter-py-2">
      <span className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800">
        {total.toLocaleString()} {lang.products_label}
      </span>
      <button
        type="button"
        className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium hover:ppros_ecom_filter-underline"
        style={{ color: accentColor }}
        onClick={onClear}
      >
        {lang.clear_all}
      </button>
    </div>
  );
}

export function FilterOrbitLayout({
  pageLayout,
  filters = [],
  products = [],
  settings = {},
  language = {},
  onResultsChange,
  showVisualUpload,
  className = "",
}) {
  const layout = pageLayout ?? defaultPageLayout();
  const columns = layout.columns ?? defaultPageLayout().columns;
  const blocks = layout.blocks ?? [];

  const activeFilters = useMemo(
    () => filters.filter((f) => f.enabled !== false),
    [filters]
  );

  const engine = useZeroRequestFilter({
    filters: activeFilters,
    products,
    hideIrrelevantFilters: !!settings.hide_irrelevant_filters,
  });

  const {
    filterState,
    textQuery,
    setTextQuery,
    result,
    toggleFilter,
    setRangeFilter,
    clearFilters,
    applyNaturalLanguage,
    applySemanticStyle,
    aiLoading,
    filterResetKey,
  } = engine;

  useEffect(() => {
    onResultsChange?.(result);
  }, [result, onResultsChange]);

  const histograms = useMemo(() => {
    const map = {};
    for (const def of activeFilters.filter((f) => f.type === "range")) {
      const { min, max } = getRangeBounds(def, products);
      map[def.id] = buildHistogram(products, def.field, min, max, 28);
    }
    return map;
  }, [activeFilters, products]);

  const renderFilter = (def, idx = 0) => {
    const defaults = getDefaultUiColorsForFilter(def.type);
    const ui = resolveUiColors(def, defaults);
    let content = null;

    if (def.type === "range") {
      const { min, max } = getRangeBounds(def, products);
      const range = filterState[def.id] ?? [min, max];
      const formatValue =
        def.field === "price"
          ? (n) => `$${n}`
          : def.field === "rating"
            ? (n) => `${n}★`
            : (n) => `${n}`;

      content = (
        <div className="ppros_ecom_filter-panel">
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
    } else if (def.type === "visual" && def.visualOptions) {
      content = (
        <VisualDiscoveryFilter
          label={def.label}
          options={def.visualOptions}
          selected={filterState[def.id] ?? []}
          onToggle={(id) => toggleFilter(def.id, id)}
          accentColor={ui.accentColor}
        />
      );
    } else {
      const opts = getFilterOptions(def, products);

      content = (
        <PillFilterGroup
          label={def.label}
          filterId={def.id}
          options={opts}
          selected={filterState[def.id] ?? []}
          onToggle={(v) => toggleFilter(def.id, v)}
          buttonColor={ui.buttonColor}
          accentColor={ui.accentColor}
        />
      );
    }

    return (
      <BlockColorShell
        key={def.id}
        color={ui.color}
        fallback={defaults.color}
      >
        {content}
      </BlockColorShell>
    );
  };

  const renderLayoutBlock = (block) => {
    const defaults = getDefaultUiColorsForBlock(block.type);
    const ui = resolveUiColors(block, defaults);
    let content = null;

    switch (block.type) {
      case "nlp_search":
        if (settings.enable_ai_filter === false) return null;
        content = (
          <SearchWithAI
            textQuery={textQuery}
            onTextChange={setTextQuery}
            onAISubmit={applyNaturalLanguage}
            aiLoading={aiLoading}
            buttonColor={ui.buttonColor}
            accentColor={ui.accentColor}
          />
        );
        break;
      case "personalized":
        if (settings.enable_personalization === false) return null;
        content = (
          <PersonalizedFilters
            filters={activeFilters}
            products={products}
            filterState={filterState}
            onQuickFilter={(id, v) => toggleFilter(id, v)}
            buttonColor={ui.buttonColor}
            barColor={ui.barColor}
            accentColor={ui.accentColor}
          />
        );
        break;
      case "visual_upload": {
        const showUpload = showVisualUpload ?? settings.enable_visual_discovery;
        if (!showUpload) return null;
        content = (
          <VisualDiscoveryUpload
            onImageSelect={() => applySemanticStyle("visual style match from uploaded image")}
            buttonColor={ui.buttonColor}
            accentColor={ui.accentColor}
          />
        );
        break;
      }
      case "results_bar":
        content = (
          <ResultsBar
            total={result.total}
            onClear={clearFilters}
            accentColor={ui.accentColor}
          />
        );
        break;
      case "products":
        content = (
          <ProductGrid
            products={result.products}
            columns={block.productGridColumns ?? 3}
            accentColor={ui.accentColor}
          />
        );
        break;
      default:
        return null;
    }

    return (
      <BlockColorShell
        key={block.id}
        color={ui.color}
        fallback={defaults.color}
      >
        {content}
      </BlockColorShell>
    );
  };

  return (
    <LanguageProvider strings={language}>
      <div
        className={`ppros_ecom_filter-root filter-orbit-layout ppros_ecom_filter-w-full ${className}`}
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: gridTemplateColumns(columns),
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {columns.map((col, colIndex) => {
          const items = getColumnItems(activeFilters, blocks, colIndex);

          return (
            <div
              key={col.id}
              className="filter-orbit-column ppros_ecom_filter-min-w-0 ppros_ecom_filter-space-y-4"
            >
              {items.map((item, idx) => {
                if (item.kind === "filter") {
                  return renderFilter(item.data, idx);
                }
                return renderLayoutBlock(item.data);
              })}
            </div>
          );
        })}
      </div>
    </LanguageProvider>
  );
}
