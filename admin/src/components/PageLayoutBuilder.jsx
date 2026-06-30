import { useCallback, useMemo, useState } from "react";
import FilterBlockCard from "./FilterBlockCard";
import LayoutBlockCard from "./LayoutBlockCard";
import {
  FILTER_TYPE_META,
  LAYOUT_BLOCK_META,
  createColumns,
  createLayoutBlock,
  defaultPageLayout,
  getAvailableLayoutPalette,
  getColumnItems,
  migrateBlocksToColumns,
  migrateFiltersToColumns,
  moveItemInColumn,
  selectionId,
} from "../utils/pageLayoutHelpers";

function PaletteItem({ source, onDragStart, onDragEnd, onClick }) {
  const isLayout = source.isLayout || !!source.blockType;
  const blockType = source.blockType || source.type;
  const meta = isLayout
    ? (LAYOUT_BLOCK_META[blockType] ?? LAYOUT_BLOCK_META.products)
    : (FILTER_TYPE_META[source.type] ?? FILTER_TYPE_META.checkbox);

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData(
          "application/filter-orbit-palette",
          JSON.stringify(source)
        );
        onDragStart?.(source);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onClick(source)}
      className="fo-flex fo-w-full fo-items-center fo-gap-2.5 fo-rounded-xl fo-border fo-border-dashed fo-border-slate-300 fo-bg-slate-50 fo-px-3 fo-py-2.5 fo-text-left fo-transition hover:fo-border-brand-400 hover:fo-bg-brand-50 active:fo-cursor-grabbing"
    >
      <span
        className={`fo-inline-flex fo-h-6 fo-w-6 fo-shrink-0 fo-items-center fo-justify-center fo-rounded fo-border fo-text-xs ${meta.color}`}
      >
        {meta.icon}
      </span>
      <span className="fo-min-w-0 fo-flex-1">
        <span className="fo-block fo-truncate fo-text-sm fo-font-medium fo-text-slate-700">
          {source.label}
        </span>
        <span className="fo-text-[11px] fo-text-slate-400">
          {isLayout ? "component" : source.type}
        </span>
      </span>
      <span className="fo-text-slate-300">+</span>
    </button>
  );
}

function DropIndicator({ active }) {
  if (!active) return null;
  return (
    <div className="fo-my-1 fo-h-1 fo-rounded-full fo-bg-brand-500 fo-shadow-sm fo-shadow-brand-200" />
  );
}

export default function PageLayoutBuilder({
  pageLayout,
  filters,
  selectedId,
  sources,
  wooActive,
  onPageLayoutChange,
  onSelect,
  onFiltersChange,
  onAddFilter,
  onAddBlock,
  onRemoveFilter,
  onRemoveBlock,
}) {
  const [dragging, setDragging] = useState(null);
  const [paletteSource, setPaletteSource] = useState(null);
  const [dropHint, setDropHint] = useState(null);

  const columns = pageLayout?.columns ?? defaultPageLayout().columns;
  const blocks = pageLayout?.blocks ?? [];
  const columnCount = columns.length;

  const clearDrag = useCallback(() => {
    setDragging(null);
    setPaletteSource(null);
    setDropHint(null);
  }, []);

  const paletteSources = useMemo(() => {
    const filterSources = (wooActive && sources.length
      ? sources
      : [
          { label: "Category", type: "checkbox", field: "category" },
          { label: "Price Range", type: "range", field: "price" },
          { label: "Brand", type: "checkbox", field: "brand" },
          { label: "Visual Discovery", type: "visual", field: "style" },
        ]
    ).map((s) => ({ ...s, isLayout: false }));

    const layoutSources = getAvailableLayoutPalette(blocks);

    return { filterSources, layoutSources };
  }, [wooActive, sources, blocks]);

  const handleColumnCountChange = (count) => {
    const newCols = createColumns(count);
    onPageLayoutChange({
      columns: newCols,
      blocks: migrateBlocksToColumns(blocks, count),
    });
    onFiltersChange(migrateFiltersToColumns(filters, count));
  };

  const handleDrop = (colIndex, insertIndex, e) => {
    const paletteData = e?.dataTransfer?.getData("application/filter-orbit-palette");
    const filterId = e?.dataTransfer?.getData("application/filter-orbit-block");
    const blockId = e?.dataTransfer?.getData("application/filter-orbit-layout-block");

    if (paletteData || paletteSource) {
      try {
        const src = paletteData ? JSON.parse(paletteData) : paletteSource;
        if (src.isLayout || src.blockType) {
          const block = createLayoutBlock(src.blockType || src.type);
          if (block) onAddBlock(block, colIndex, insertIndex);
        } else {
          onAddFilter(src, colIndex, insertIndex);
        }
      } catch {
        /* ignore */
      }
      clearDrag();
      return;
    }

    if (filterId || (dragging?.kind === "filter" && dragging.id)) {
      const id = filterId || dragging.id;
      const result = moveItemInColumn(filters, blocks, "filter", id, colIndex, insertIndex, columnCount);
      onFiltersChange(result.filters);
      onPageLayoutChange({ ...pageLayout, blocks: result.blocks });
    } else if (blockId || (dragging?.kind === "block" && dragging.id)) {
      const id = blockId || dragging.id;
      const result = moveItemInColumn(filters, blocks, "block", id, colIndex, insertIndex, columnCount);
      onFiltersChange(result.filters);
      onPageLayoutChange({ ...pageLayout, blocks: result.blocks });
    }
    clearDrag();
  };

  const handleDragOver = (e, colIndex, insertIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = paletteSource ? "copy" : "move";
    setDropHint({ colIndex, insertIndex });
  };

  return (
    <div className="fo-flex fo-h-full fo-min-h-[560px] fo-flex-col">
      <div className="fo-flex fo-flex-wrap fo-items-center fo-justify-between fo-gap-3 fo-border-b fo-border-slate-100 fo-px-4 fo-py-3">
        <div>
          <h3 className="fo-text-sm fo-font-bold fo-text-slate-800">Page Layout</h3>
          <p className="fo-text-xs fo-text-slate-400">
            100% shortcode width · drag filters &amp; products into columns
          </p>
        </div>
        <div className="fo-flex fo-flex-wrap fo-items-center fo-gap-3">
          <div className="fo-flex fo-items-center fo-gap-2">
            <span className="fo-text-xs fo-font-semibold fo-uppercase fo-tracking-wide fo-text-slate-400">
              Columns
            </span>
            <div className="fo-inline-flex fo-rounded-lg fo-border fo-border-slate-200 fo-bg-slate-50 fo-p-0.5">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleColumnCountChange(n)}
                  className={`fo-rounded-md fo-px-3 fo-py-1.5 fo-text-xs fo-font-semibold fo-transition ${
                    columnCount === n
                      ? "fo-bg-white fo-text-brand-700 fo-shadow-sm"
                      : "fo-text-slate-500 hover:fo-text-slate-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fo-flex fo-min-h-0 fo-flex-1">
        <aside className="fo-w-52 fo-shrink-0 fo-overflow-y-auto fo-border-r fo-border-slate-100 fo-bg-slate-50/50 fo-p-3">
          <p className="fo-mb-2 fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-widest fo-text-slate-400">
            Filters
          </p>
          <div className="fo-space-y-2">
            {paletteSources.filterSources.map((source) => (
              <PaletteItem
                key={source.id ?? source.field ?? source.label}
                source={source}
                onDragStart={setPaletteSource}
                onDragEnd={clearDrag}
                onClick={(src) => {
                  const col = 0;
                  const items = getColumnItems(filters, blocks, col);
                  onAddFilter(src, col, items.length);
                }}
              />
            ))}
          </div>

          <p className="fo-mb-2 fo-mt-5 fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-widest fo-text-slate-400">
            Components
          </p>
          <div className="fo-space-y-2">
            {paletteSources.layoutSources.length === 0 ? (
              <p className="fo-px-1 fo-text-[11px] fo-text-slate-400">All components added.</p>
            ) : (
              paletteSources.layoutSources.map((source) => (
                <PaletteItem
                  key={source.blockType}
                  source={source}
                  onDragStart={setPaletteSource}
                  onDragEnd={clearDrag}
                  onClick={(src) => {
                    const col = 0;
                    const items = getColumnItems(filters, blocks, col);
                    const block = createLayoutBlock(src.blockType || src.type);
                    if (block) onAddBlock(block, col, items.length);
                  }}
                />
              ))
            )}
          </div>
        </aside>

        <div
          className="fo-min-w-0 fo-flex-1 fo-overflow-y-auto fo-p-4"
          onClick={() => onSelect(null)}
        >
          <div
            className="fo-grid fo-min-h-[440px] fo-gap-3"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {columns.map((col, colIndex) => {
              const items = getColumnItems(filters, blocks, colIndex);
              return (
                <div
                  key={col.id}
                  className={`fo-flex fo-min-h-[420px] fo-flex-col fo-rounded-2xl fo-border-2 fo-border-dashed fo-p-3 fo-transition ${
                    dropHint?.colIndex === colIndex && (dragging || paletteSource)
                      ? "fo-border-brand-400 fo-bg-brand-50/40"
                      : "fo-border-slate-200 fo-bg-white/60"
                  }`}
                  onDragOver={(e) => handleDragOver(e, colIndex, items.length)}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(colIndex, items.length, e);
                  }}
                >
                  <div className="fo-mb-2">
                    <span className="fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-widest fo-text-slate-400">
                      Column {colIndex + 1}
                    </span>
                  </div>

                  <div className="fo-flex-1 fo-space-y-0">
                    {items.length === 0 && !dragging && !paletteSource && (
                      <div className="fo-flex fo-h-full fo-min-h-[320px] fo-flex-col fo-items-center fo-justify-center fo-rounded-xl fo-border fo-border-dashed fo-border-slate-200 fo-bg-slate-50 fo-p-4 fo-text-center">
                        <span className="fo-mb-2 fo-text-2xl fo-opacity-40">⊞</span>
                        <p className="fo-text-sm fo-font-medium fo-text-slate-400">Drop here</p>
                        <p className="fo-mt-1 fo-text-xs fo-text-slate-300">Filters or product grid</p>
                      </div>
                    )}

                    {items.map((item, index) => (
                      <div key={`${item.kind}:${item.id}`}>
                        <div
                          className="fo-py-0.5"
                          onDragOver={(e) => handleDragOver(e, colIndex, index)}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDrop(colIndex, index, e);
                          }}
                        >
                          <DropIndicator
                            active={
                              dropHint?.colIndex === colIndex &&
                              dropHint?.insertIndex === index
                            }
                          />
                        </div>
                        {item.kind === "filter" ? (
                          <FilterBlockCard
                            filter={item.data}
                            selected={selectedId === selectionId("filter", item.id)}
                            onSelect={(id) => onSelect(selectionId("filter", id))}
                            onRemove={onRemoveFilter}
                            onDragStart={(id) => setDragging({ kind: "filter", id })}
                            onDragEnd={clearDrag}
                          />
                        ) : (
                          <LayoutBlockCard
                            block={item.data}
                            selected={selectedId === selectionId("block", item.id)}
                            onSelect={(id) => onSelect(selectionId("block", id))}
                            onRemove={onRemoveBlock}
                            onDragStart={(id) => setDragging({ kind: "block", id })}
                            onDragEnd={clearDrag}
                          />
                        )}
                      </div>
                    ))}

                    {items.length > 0 && (
                      <div
                        className="fo-py-1"
                        onDragOver={(e) => handleDragOver(e, colIndex, items.length)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDrop(colIndex, items.length, e);
                        }}
                      >
                        <DropIndicator
                          active={
                            dropHint?.colIndex === colIndex &&
                            dropHint?.insertIndex === items.length
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
