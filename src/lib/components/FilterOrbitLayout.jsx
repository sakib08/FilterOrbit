import { useEffect, useMemo } from "react";
import { useZeroRequestFilter } from "../hooks/useZeroRequestFilter";
import { buildHistogram, getRangeBounds, getFilterOptions } from "../utils/filterEngine";
import { SearchWithAI } from "./SearchWithAI";
import { VisualDiscoveryFilter } from "./VisualDiscoveryFilter";
import { VisualDiscoveryUpload } from "./VisualDiscoveryUpload";
import { PersonalizedFilters } from "./PersonalizedFilters";
import { RangeSliderHistogram } from "./RangeSliderHistogram";
import { PillFilterGroup } from "./PillFilterGroup";
import { CheckboxFilterGroup } from "./CheckboxFilterGroup";
import { ProductGrid } from "./ProductGrid";
import {
  getDefaultUiColorsForBlock,
  getDefaultUiColorsForFilter,
  resolveUiColors,
} from "../utils/blockColors";
import { LanguageProvider } from "../language/LanguageContext";
import { useLanguage } from "../language/LanguageContext";
import { SlidersIcon } from "./icons";

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

function ResultsBar({ total, onClear, accentColor = "#7c3aed" }) {
  const lang = useLanguage();
  return (
    <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-center ppros_ecom_filter-px-1 ppros_ecom_filter-py-2">
      <span className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-600">
        <span className="ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800">
          {total.toLocaleString()}
        </span>{" "}
        {lang.products_label}
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

    const opts = getFilterOptions(def, products);
    const displayMode = def.displayMode;

    if (displayMode === "checkbox" || displayMode === "toggle") {
      return (
        <CheckboxFilterGroup
          key={def.id}
          label={def.label}
          filterId={def.id}
          options={opts}
          selected={filterState[def.id] ?? []}
          onToggle={(v) => toggleFilter(def.id, v)}
          variant={displayMode}
        />
      );
    }

    return (
      <PillFilterGroup
        key={def.id}
        label={def.label}
        filterId={def.id}
        field={def.field}
        options={opts}
        selected={filterState[def.id] ?? []}
        onToggle={(v) => toggleFilter(def.id, v)}
        buttonColor={ui.buttonColor}
        accentColor={ui.accentColor}
        variant={displayMode === "size" ? "size" : "pill"}
      />
    );
  };

  const renderLayoutBlock = (block) => {
    const defaults = getDefaultUiColorsForBlock(block.type);
    const ui = resolveUiColors(block, defaults);

    switch (block.type) {
      case "nlp_search":
        if (settings.enable_ai_filter === false) return null;
        return (
          <div key={block.id}>
            <SearchWithAI
              textQuery={textQuery}
              onTextChange={setTextQuery}
              onAISubmit={applyNaturalLanguage}
              aiLoading={aiLoading}
              buttonColor={ui.buttonColor}
              accentColor={ui.accentColor}
            />
          </div>
        );

      case "personalized":
        if (settings.enable_personalization === false) return null;
        return (
          <div key={block.id}>
            <PersonalizedFilters
              filters={activeFilters}
              products={products}
              filterState={filterState}
              onQuickFilter={(id, v) => toggleFilter(id, v)}
              buttonColor={ui.buttonColor}
              barColor={ui.barColor}
              accentColor={ui.accentColor}
            />
          </div>
        );

      case "visual_upload": {
        const showUpload = showVisualUpload ?? settings.enable_visual_discovery;
        if (!showUpload) return null;
        return (
          <div key={block.id}>
            <VisualDiscoveryUpload
              onImageSelect={() => applySemanticStyle("visual style match from uploaded image")}
              buttonColor={ui.buttonColor}
              accentColor={ui.accentColor}
            />
          </div>
        );
      }

      case "results_bar":
        return (
          <ResultsBar
            key={block.id}
            total={result.total}
            onClear={clearFilters}
            accentColor={ui.accentColor}
          />
        );

      case "products":
        return (
          <div key={block.id} className="ppros_ecom_filter-w-full">
            <ProductGrid
              products={result.products}
              columns={block.productGridColumns ?? 3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LanguageProvider strings={language}>
      <div
        className={`ppros_ecom_filter-root filter-orbit-layout filter-orbit-root ppros_ecom_filter-w-full ${className}`}
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: gridTemplateColumns(columns),
          gap: "1.5rem",
          alignItems: "start",
          fontFamily: `"${settings?.google_font || "DM Sans"}", system-ui, sans-serif`,
          ["--font-sans"]: `"${settings?.google_font || "DM Sans"}", system-ui, sans-serif`,
          ["--font-display"]: '"Outfit", system-ui, sans-serif',
          ["--font-size"]: "16px",
          ["--fo-label-size"]: `${Number(settings?.label_font_size ?? 11)}px`,
          ["--fo-option-size"]: `${Number(settings?.option_font_size ?? 14)}px`,
          ["--fo-title-size"]: `${Number(settings?.product_title_font_size ?? 14)}px`,
          ["--fo-price-size"]: `${Number(settings?.product_price_font_size ?? 16)}px`,
        }}
      >
        {columns.map((col, colIndex) => {
          const items = getColumnItems(activeFilters, blocks, colIndex);
          const filterItems = items.filter((i) => i.kind === "filter");
          const blockItems = items.filter((i) => i.kind === "block");
          const isFilterColumn = colIndex === 0 && filterItems.length > 0;

          if (isFilterColumn) {
            const firstFilterOrder =
              filterItems.length > 0
                ? Math.min(...filterItems.map((i) => i.order))
                : Infinity;
            const lastFilterOrder =
              filterItems.length > 0
                ? Math.max(...filterItems.map((i) => i.order))
                : -Infinity;

            const blocksAbove = blockItems.filter((b) => b.order < firstFilterOrder);
            const blocksBelow = blockItems.filter((b) => b.order > lastFilterOrder);

            return (
              <div
                key={col.id}
                className="filter-orbit-column ppros_ecom_filter-min-w-0 ppros_ecom_filter-space-y-3"
              >
                {blocksAbove.map((item) => renderLayoutBlock(item.data))}

                <div>
                  <div className="ppros_ecom_filter-filters-heading">
                    <SlidersIcon size={15} />
                    <span>Filters</span>
                  </div>
                  <div className="ppros_ecom_filter-filter-sidebar">
                    {filterItems.map((item, idx) =>
                      renderFilter(item.data, idx)
                    )}
                  </div>
                </div>

                {blocksBelow.map((item) => renderLayoutBlock(item.data))}
              </div>
            );
          }

          /* Products / non-filter column */
          return (
            <div
              key={col.id}
              className="filter-orbit-column ppros_ecom_filter-min-w-0 ppros_ecom_filter-space-y-4"
            >
              {items.map((item) => {
                if (item.kind === "filter") return renderFilter(item.data);
                return renderLayoutBlock(item.data);
              })}
            </div>
          );
        })}
      </div>
    </LanguageProvider>
  );
}
