import { useCallback, useEffect, useMemo, useState } from "react";
import { api, adminConfig } from "../api";
import { Switch } from "../components/FormFields";
import AdminToast from "../components/AdminToast";
import ColumnWidthControls, { LayoutPreviewModal } from "../components/LayoutPreviewModal";
import UiColorSettings from "../components/UiColorSettings";
import PageLayoutBuilder from "../components/PageLayoutBuilder";
import {
  defaultPageLayout,
  flattenColumnGroups,
  groupFiltersByColumn,
  insertBlockAt,
  insertFilterAt,
  migrateBlocksToColumns,
  parseSelectionId,
  LAYOUT_BLOCK_META,
  getDefaultUiColorsForBlock,
  getDefaultUiColorsForFilter,
} from "../utils/pageLayoutHelpers";

const FILTER_TYPES = [
  { value: "checkbox", label: "Checkbox / Pills" },
  { value: "range", label: "Range Slider" },
  { value: "visual", label: "Visual Discovery" },
];

const emptyFilter = (source) => {
  const type = source?.type || "checkbox";
  const colors = getDefaultUiColorsForFilter(type);
  return {
    id: source?.field ? `${source.field}_${Date.now()}` : `filter_${Date.now()}`,
    label: source?.label || "New Filter",
    type,
    field: source?.field || "category",
    enabled: true,
    order: 0,
    column: 0,
    ...colors,
    options: Array.isArray(source?.options) ? source.options : [],
    variant: !!source?.variant,
    ...(type === "range" ? { min: 0, max: 1000, step: 5, unit: "USD" } : {}),
  };
};

export default function FilterDesigner() {
  const [filters, setFilters] = useState([]);
  const [pageLayout, setPageLayout] = useState(defaultPageLayout());
  const [products, setProducts] = useState([]);
  const [sources, setSources] = useState([]);
  const [wooActive, setWooActive] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [languageStrings, setLanguageStrings] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    Promise.all([
      api.getFilters(),
      api.getPreviewProducts(),
      api.getWooSources(),
      api.getSettings(),
      api.getLanguageSettings(),
    ])
      .then(([filterData, productData, sourceData, settingsData, languageData]) => {
        const list = Array.isArray(filterData) ? filterData : [];
        const normalized = list.map((f, i) => ({
          ...f,
          column: f.column ?? 0,
          order: f.order ?? i,
        }));
        setFilters(normalized);
        setProducts(Array.isArray(productData) ? productData : []);
        setWooActive(!!sourceData?.woocommerce_active);
        setSources(sourceData?.sources ?? []);
        setPageLayout(settingsData?.page_layout ?? defaultPageLayout());
        setLanguageStrings(languageData ?? {});
        setSelectedId(normalized[0] ? `filter:${normalized[0].id}` : null);
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const selection = useMemo(() => parseSelectionId(selectedId), [selectedId]);

  const selectedFilter = useMemo(
    () => (selection?.kind === "filter" ? filters.find((f) => f.id === selection.id) : null),
    [filters, selection]
  );

  const selectedBlock = useMemo(
    () => (selection?.kind === "block" ? pageLayout.blocks?.find((b) => b.id === selection.id) : null),
    [pageLayout, selection]
  );

  const columnCount = pageLayout.columns?.length ?? 1;

  const updateFilter = (id, patch) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const updateBlock = (id, patch) => {
    setPageLayout((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  };

  const addFilterAt = (source, column, insertIndex) => {
    const filter = emptyFilter(source);
    const result = insertFilterAt(filters, pageLayout.blocks ?? [], filter, column, insertIndex, columnCount);
    setFilters(result.filters);
    setPageLayout((prev) => ({ ...prev, blocks: result.blocks }));
    setSelectedId(`filter:${filter.id}`);
  };

  const addBlockAt = (block, column, insertIndex) => {
    const result = insertBlockAt(filters, pageLayout.blocks ?? [], block, column, insertIndex, columnCount);
    setFilters(result.filters);
    setPageLayout((prev) => ({ ...prev, blocks: result.blocks }));
    setSelectedId(`block:${block.id}`);
  };

  const removeFilter = (id) => {
    const groups = groupFiltersByColumn(
      filters.filter((f) => f.id !== id),
      columnCount
    );
    setFilters(flattenColumnGroups(groups));
    if (selectedId === `filter:${id}`) setSelectedId(null);
  };

  const removeBlock = (id) => {
    const remaining = (pageLayout.blocks ?? []).filter((b) => b.id !== id);
    setPageLayout((prev) => ({
      ...prev,
      blocks: migrateBlocksToColumns(remaining, columnCount),
    }));
    if (selectedId === `block:${id}`) setSelectedId(null);
  };

  const addOption = (id) => {
    updateFilter(id, {
      options: [...(selectedFilter?.options ?? []), { value: "", label: "" }],
    });
  };

  const updateOption = (filterId, index, patch) => {
    const filter = filters.find((f) => f.id === filterId);
    if (!filter) return;
    const options = [...(filter.options ?? [])];
    options[index] = { ...options[index], ...patch };
    updateFilter(filterId, { options });
  };

  const removeOption = (filterId, index) => {
    const filter = filters.find((f) => f.id === filterId);
    if (!filter) return;
    updateFilter(filterId, {
      options: (filter.options ?? []).filter((_, i) => i !== index),
    });
  };

  const handleColumnWidthsChange = (columns) => {
    setPageLayout((prev) => ({ ...prev, columns }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const groups = groupFiltersByColumn(filters, columnCount);
      const payload = flattenColumnGroups(groups);
      await Promise.all([
        api.saveFilters(payload),
        api.saveSettings({ page_layout: pageLayout }),
      ]);
      setFilters(payload);
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
          <h2 className="fo-text-xl fo-font-bold fo-text-slate-900">Filter Designer</h2>
          <p className="fo-mt-1 fo-text-sm fo-text-slate-500">
            Arrange blocks on the canvas · set column widths below · preview in modal.
          </p>
        </div>
        <div className="fo-flex fo-items-center fo-gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="fo-rounded-xl fo-border fo-border-slate-200 fo-bg-white fo-px-5 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-slate-700 hover:fo-bg-slate-50"
          >
            Live Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="fo-rounded-xl fo-bg-brand-600 fo-px-5 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-white hover:fo-bg-brand-700 disabled:fo-opacity-50"
          >
            {saving ? "Saving…" : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="fo-mb-6">
        <ColumnWidthControls
          columns={pageLayout.columns ?? []}
          onChange={handleColumnWidthsChange}
        />
      </div>

      <div className="fo-grid fo-gap-6 lg:fo-grid-cols-12">
        <div className="fo-overflow-hidden fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-shadow-sm lg:fo-col-span-8">
          <PageLayoutBuilder
            pageLayout={pageLayout}
            filters={filters}
            selectedId={selectedId}
            sources={sources}
            wooActive={wooActive}
            onPageLayoutChange={setPageLayout}
            onSelect={setSelectedId}
            onFiltersChange={setFilters}
            onAddFilter={addFilterAt}
            onAddBlock={addBlockAt}
            onRemoveFilter={removeFilter}
            onRemoveBlock={removeBlock}
          />
        </div>

        <div className="fo-space-y-6 lg:fo-col-span-4">
          <div className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-shadow-sm">
            <div className="fo-border-b fo-border-slate-100 fo-px-4 fo-py-3">
              <h3 className="fo-text-sm fo-font-bold fo-text-slate-800">
                {selectedFilter || selectedBlock ? "Block Settings" : "Inspector"}
              </h3>
              <p className="fo-text-xs fo-text-slate-400">
                {selectedFilter
                  ? `Filter: ${selectedFilter.label}`
                  : selectedBlock
                    ? (LAYOUT_BLOCK_META[selectedBlock.type]?.label ?? "Component")
                    : "Select a block on the canvas"}
              </p>
            </div>

            {!selectedFilter && !selectedBlock ? (
              <p className="fo-p-6 fo-text-sm fo-text-slate-400">
                Click any block on the canvas to edit its settings.
              </p>
            ) : selectedBlock ? (
              <div className="fo-space-y-4 fo-p-4">
                {LAYOUT_BLOCK_META[selectedBlock.type]?.description && (
                  <p className="fo-text-xs fo-leading-relaxed fo-text-slate-500">
                    {LAYOUT_BLOCK_META[selectedBlock.type].description}
                  </p>
                )}

                {selectedBlock.type === "nlp_search" && (
                  <div className="fo-rounded-xl fo-border fo-border-violet-200 fo-bg-gradient-to-br fo-from-violet-50 fo-to-purple-50 fo-p-4">
                    <div className="fo-flex fo-items-center fo-gap-2 fo-mb-2">
                      <span className="fo-text-lg">🔒</span>
                      <span className="fo-text-sm fo-font-bold fo-text-violet-800">
                        AI Natural Language Search
                      </span>
                      <span className="fo-ml-auto fo-rounded-full fo-bg-gradient-to-r fo-from-violet-600 fo-to-purple-500 fo-px-2.5 fo-py-0.5 fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-wide fo-text-white">
                        PRO
                      </span>
                    </div>
                    <p className="fo-text-xs fo-text-violet-700 fo-leading-relaxed">
                      Real AI-powered search (OpenAI / Gemini) is a Pro feature. On the free plan, the block shows a basic keyword search instead.
                    </p>
                    <div className="fo-mt-3 fo-rounded-lg fo-bg-white fo-border fo-border-violet-100 fo-px-3 fo-py-2 fo-text-[11px] fo-text-slate-500">
                      ✅ <strong>Currently active:</strong> Basic keyword search (title + description)
                    </div>
                  </div>
                )}

                <UiColorSettings
                  item={selectedBlock}
                  defaults={getDefaultUiColorsForBlock(selectedBlock.type)}
                  onChange={(patch) => updateBlock(selectedBlock.id, patch)}
                  isBlock
                />

                {selectedBlock.type === "products" && (
                  <label className="fo-block">
                    <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">
                      Products per row
                    </span>
                    <select
                      value={selectedBlock.productGridColumns ?? 3}
                      onChange={(e) =>
                        updateBlock(selectedBlock.id, {
                          productGridColumns: Number(e.target.value),
                        })
                      }
                      className="fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm"
                    >
                      {[2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} columns</option>
                      ))}
                    </select>
                  </label>
                )}

                <div className="fo-flex fo-items-center fo-justify-between fo-gap-3">
                  <span className="fo-text-sm fo-text-slate-700">Enabled on storefront</span>
                  <Switch
                    checked={!!selectedBlock.enabled}
                    onChange={(enabled) =>
                      updateBlock(selectedBlock.id, { enabled })
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeBlock(selectedBlock.id)}
                  className="fo-w-full fo-rounded-lg fo-border fo-border-red-200 fo-bg-red-50 fo-py-2 fo-text-sm fo-font-semibold fo-text-red-600 hover:fo-bg-red-100"
                >
                  Remove block
                </button>
              </div>
            ) : (
              <div className="fo-max-h-[360px] fo-space-y-4 fo-overflow-y-auto fo-p-4">
                <label className="fo-block">
                  <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">Label</span>
                  <input
                    type="text"
                    value={selectedFilter.label}
                    onChange={(e) => updateFilter(selectedFilter.id, { label: e.target.value })}
                    className="fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm focus:fo-border-brand-400 focus:fo-outline-none focus:fo-ring-2 focus:fo-ring-brand-100"
                  />
                </label>

                <label className="fo-block">
                  <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">Type</span>
                  <select
                    value={selectedFilter.type}
                    onChange={(e) => updateFilter(selectedFilter.id, { type: e.target.value })}
                    className="fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm"
                  >
                    {FILTER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </label>

                <label className="fo-block">
                  <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">Product field</span>
                  <input
                    type="text"
                    value={selectedFilter.field}
                    onChange={(e) => updateFilter(selectedFilter.id, { field: e.target.value })}
                    className="fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm"
                  />
                </label>

                <UiColorSettings
                  item={selectedFilter}
                  defaults={getDefaultUiColorsForFilter(selectedFilter.type)}
                  onChange={(patch) => updateFilter(selectedFilter.id, patch)}
                  filterType={selectedFilter.type}
                />

                <div className="fo-flex fo-items-center fo-justify-between fo-gap-3">
                  <span className="fo-text-sm fo-text-slate-700">Enabled on storefront</span>
                  <Switch
                    checked={!!selectedFilter.enabled}
                    onChange={(enabled) => updateFilter(selectedFilter.id, { enabled })}
                  />
                </div>

                {selectedFilter.type === "range" && (
                  <div className="fo-grid fo-grid-cols-2 fo-gap-3">
                    {["min", "max", "step"].map((key) => (
                      <label key={key} className="fo-block">
                        <span className="fo-mb-1 fo-block fo-text-xs fo-font-semibold fo-text-slate-500">{key}</span>
                        <input
                          type="number"
                          value={selectedFilter[key] ?? ""}
                          onChange={(e) =>
                            updateFilter(selectedFilter.id, { [key]: Number(e.target.value) })
                          }
                          className="fo-w-full fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-2 fo-text-sm"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {selectedFilter.type === "checkbox" && (
                  <div>
                    <div className="fo-mb-2 fo-flex fo-items-center fo-justify-between">
                      <span className="fo-text-xs fo-font-semibold fo-text-slate-500">Options</span>
                      <button
                        type="button"
                        onClick={() => addOption(selectedFilter.id)}
                        className="fo-text-xs fo-font-semibold fo-text-brand-600 hover:fo-underline"
                      >
                        + Add option
                      </button>
                    </div>
                    <div className="fo-space-y-2">
                      {(selectedFilter.options ?? []).map((opt, i) => (
                        <div key={i} className="fo-flex fo-gap-2">
                          <input
                            type="text"
                            placeholder="Value"
                            value={opt.value}
                            onChange={(e) => updateOption(selectedFilter.id, i, { value: e.target.value })}
                            className="fo-flex-1 fo-rounded-lg fo-border fo-border-slate-200 fo-px-2 fo-py-1.5 fo-text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Label"
                            value={opt.label}
                            onChange={(e) => updateOption(selectedFilter.id, i, { label: e.target.value })}
                            className="fo-flex-1 fo-rounded-lg fo-border fo-border-slate-200 fo-px-2 fo-py-1.5 fo-text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(selectedFilter.id, i)}
                            className="fo-rounded fo-px-2 fo-text-red-500 hover:fo-bg-red-50"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeFilter(selectedFilter.id)}
                  className="fo-w-full fo-rounded-lg fo-border fo-border-red-200 fo-bg-red-50 fo-py-2 fo-text-sm fo-font-semibold fo-text-red-600 hover:fo-bg-red-100"
                >
                  Remove block
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LayoutPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        pageLayout={pageLayout}
        filters={filters}
        products={products}
        language={languageStrings ?? {}}
      />

      <AdminToast message={toast?.message} type={toast?.type} />
    </>
  );
}
