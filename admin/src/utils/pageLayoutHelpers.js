/**
 * Page layout helpers — columns with % widths, filters + layout blocks.
 */

import { getDefaultUiColorsForBlock as libDefaultUiColorsForBlock } from "../../../src/lib/utils/blockColors.js";

export {
  getBlockColorTheme,
  getDefaultBlockColor,
  getDefaultFilterColor,
  getDefaultUiColorsForBlock,
  getDefaultUiColorsForFilter,
  normalizeHexColor,
} from "../../../src/lib/utils/blockColors.js";

export const FILTER_TYPE_META = {
  checkbox: { icon: "☑", color: "fo-bg-violet-50 fo-text-violet-700 fo-border-violet-200" },
  range: { icon: "↔", color: "fo-bg-indigo-50 fo-text-indigo-700 fo-border-indigo-200" },
  visual: { icon: "◉", color: "fo-bg-teal-50 fo-text-teal-700 fo-border-teal-200" },
};

export const LAYOUT_BLOCK_META = {
  nlp_search: {
    icon: "✦",
    label: "NLP Search",
    description: "AI natural-language product search",
    color: "fo-bg-violet-50 fo-text-violet-700 fo-border-violet-200",
  },
  personalized: {
    icon: "★",
    label: "Personalized Filters",
    description: "Quick picks based on browsing",
    color: "fo-bg-rose-50 fo-text-rose-700 fo-border-rose-200",
  },
  visual_upload: {
    icon: "📷",
    label: "Visual Upload",
    description: "Search by uploaded image",
    color: "fo-bg-teal-50 fo-text-teal-700 fo-border-teal-200",
  },
  results_bar: {
    icon: "≡",
    label: "Results Bar",
    description: "Product count & clear all",
    color: "fo-bg-slate-100 fo-text-slate-700 fo-border-slate-200",
  },
  products: {
    icon: "▦",
    label: "Product Grid",
    description: "Filtered product results",
    color: "fo-bg-amber-50 fo-text-amber-700 fo-border-amber-200",
  },
};

/** Singleton layout blocks available in the component palette. */
export const LAYOUT_BLOCK_DEFS = {
  nlp_search: { id: "nlp_search" },
  personalized: { id: "personalized_filters" },
  visual_upload: { id: "visual_upload" },
  results_bar: { id: "results_bar" },
  products: { id: "products_grid" },
};

export function createLayoutBlock(type) {
  const def = LAYOUT_BLOCK_DEFS[type];
  if (!def) return null;

  const block = {
    id: def.id,
    type,
    enabled: true,
    order: 0,
    column: 0,
    ...libDefaultUiColorsForBlock(type),
  };

  if (type === "products") {
    block.productGridColumns = 3;
  }

  return block;
}

export function getAvailableLayoutPalette(blocks = []) {
  return Object.keys(LAYOUT_BLOCK_DEFS)
    .filter((type) => !blocks.some((b) => b.type === type))
    .map((type) => ({
      label: LAYOUT_BLOCK_META[type]?.label ?? type,
      blockType: type,
      type,
      isLayout: true,
    }));
}

export function defaultPageLayout() {
  return {
    columns: [
      { id: "col_0", width: 30 },
      { id: "col_1", width: 70 },
    ],
    blocks: [
      {
        id: "nlp_search",
        type: "nlp_search",
        column: 0,
        order: 0,
        enabled: true,
        color: "#8b5cf6",
      },
      {
        id: "personalized_filters",
        type: "personalized",
        column: 0,
        order: 1,
        enabled: true,
        color: "#f43f5e",
      },
      {
        id: "results_bar",
        type: "results_bar",
        column: 0,
        order: 99,
        enabled: true,
        color: "#64748b",
      },
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

export function normalizeColumnWidths(columns) {
  if (!columns.length) return [{ id: "col_0", width: 100 }];
  const total = columns.reduce((sum, c) => sum + (c.width || 0), 0);
  if (total === 100) return columns;
  if (total === 0) {
    const even = Math.floor(100 / columns.length);
    return columns.map((c, i) => ({
      ...c,
      width: i === columns.length - 1 ? 100 - even * (columns.length - 1) : even,
    }));
  }
  return columns.map((c) => ({
    ...c,
    width: Math.round((c.width / total) * 100),
  }));
}

export function createColumns(count) {
  const presets = {
    1: [100],
    2: [30, 70],
    3: [25, 35, 40],
  };
  const widths = presets[count] ?? Array.from({ length: count }, () => Math.floor(100 / count));
  if (widths.reduce((a, b) => a + b, 0) !== 100) {
    widths[widths.length - 1] += 100 - widths.reduce((a, b) => a + b, 0);
  }
  return widths.map((width, i) => ({ id: `col_${i}`, width }));
}

export function groupFiltersByColumn(filters, columnCount = 1) {
  const cols = Array.from({ length: columnCount }, () => []);
  filters.forEach((filter) => {
    const col = Math.min(Math.max(filter.column ?? 0, 0), columnCount - 1);
    cols[col].push(filter);
  });
  cols.forEach((col) => col.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  return cols;
}

export function groupBlocksByColumn(blocks, columnCount = 1) {
  const cols = Array.from({ length: columnCount }, () => []);
  blocks.forEach((block) => {
    const col = Math.min(Math.max(block.column ?? 0, 0), columnCount - 1);
    cols[col].push(block);
  });
  cols.forEach((col) => col.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  return cols;
}

/** Merge filters + layout blocks in a column, sorted by order. */
export function getColumnItems(filters, blocks, colIndex) {
  const items = [
    ...filters
      .filter((f) => (f.column ?? 0) === colIndex)
      .map((f) => ({ kind: "filter", id: f.id, order: f.order ?? 0, data: f })),
    ...blocks
      .filter((b) => (b.column ?? 0) === colIndex)
      .map((b) => ({ kind: "block", id: b.id, order: b.order ?? 0, data: b })),
  ];
  return items.sort((a, b) => a.order - b.order);
}

export function flattenColumnGroups(columnGroups) {
  const result = [];
  columnGroups.forEach((colFilters, colIndex) => {
    colFilters.forEach((filter, order) => {
      result.push({ ...filter, column: colIndex, order });
    });
  });
  return result;
}

export function migrateFiltersToColumns(filters, columnCount) {
  return flattenColumnGroups(groupFiltersByColumn(filters, columnCount));
}

export function migrateBlocksToColumns(blocks, columnCount) {
  const groups = groupBlocksByColumn(blocks, columnCount);
  const result = [];
  groups.forEach((colBlocks, colIndex) => {
    colBlocks.forEach((block, order) => {
      result.push({ ...block, column: colIndex, order });
    });
  });
  return result;
}

/** Set a single column width without changing the others. */
export function setColumnWidth(columns, index, newWidth) {
  const clamped = Math.min(100, Math.max(1, Number(newWidth) || 1));
  return columns.map((col, i) =>
    i === index ? { ...col, width: clamped } : { ...col }
  );
}

/** Scale all columns proportionally so they sum to 100%. */
export function balanceColumnWidths(columns) {
  const total = columns.reduce((sum, c) => sum + (c.width || 0), 0);
  if (!total) return columns;
  if (total === 100) return columns;
  return columns.map((col) => ({
    ...col,
    width: Math.max(1, Math.round((col.width / total) * 100)),
  }));
}

/** @deprecated use setColumnWidth — kept for compatibility */
export function updateColumnWidth(columns, index, newWidth) {
  return setColumnWidth(columns, index, newWidth);
}

function applyColumnOrder(filters, blocks, colIndex, items) {
  const nextFilters = filters.map((f) => ({ ...f }));
  const nextBlocks = blocks.map((b) => ({ ...b }));
  items.forEach((item, order) => {
    if (item.kind === "filter") {
      const f = nextFilters.find((x) => x.id === item.id);
      if (f) {
        f.column = colIndex;
        f.order = order;
      }
    } else {
      const b = nextBlocks.find((x) => x.id === item.id);
      if (b) {
        b.column = colIndex;
        b.order = order;
      }
    }
  });
  return { filters: nextFilters, blocks: nextBlocks };
}

export function moveItemInColumn(filters, blocks, itemKind, itemId, toColumn, toIndex, columnCount) {
  const targetCol = Math.min(Math.max(toColumn, 0), columnCount - 1);
  const insertAt = Math.max(0, toIndex);

  if (itemKind === "filter") {
    const moving = filters.find((f) => f.id === itemId);
    if (!moving) return { filters, blocks };
    const fromCol = moving.column ?? 0;

    let nextFilters = filters.map((f) =>
      f.id === itemId ? { ...f, column: targetCol } : { ...f }
    );
    let nextBlocks = blocks.map((b) => ({ ...b }));

    const targetItems = getColumnItems(
      nextFilters.filter((f) => f.id !== itemId),
      nextBlocks,
      targetCol
    );
    targetItems.splice(insertAt, 0, { kind: "filter", id: itemId, order: insertAt, data: moving });

    let result = applyColumnOrder(nextFilters, nextBlocks, targetCol, targetItems);
    nextFilters = result.filters;
    nextBlocks = result.blocks;

    if (fromCol !== targetCol) {
      const fromItems = getColumnItems(nextFilters, nextBlocks, fromCol);
      result = applyColumnOrder(nextFilters, nextBlocks, fromCol, fromItems);
    }
    return result;
  }

  const moving = blocks.find((b) => b.id === itemId);
  if (!moving) return { filters, blocks };
  const fromCol = moving.column ?? 0;

  let nextFilters = filters.map((f) => ({ ...f }));
  let nextBlocks = blocks.map((b) =>
    b.id === itemId ? { ...b, column: targetCol } : { ...b }
  );

  const targetItems = getColumnItems(
    nextFilters,
    nextBlocks.filter((b) => b.id !== itemId),
    targetCol
  );
  targetItems.splice(insertAt, 0, { kind: "block", id: itemId, order: insertAt, data: moving });

  let result = applyColumnOrder(nextFilters, nextBlocks, targetCol, targetItems);

  if (fromCol !== targetCol) {
    const fromItems = getColumnItems(result.filters, result.blocks, fromCol);
    result = applyColumnOrder(result.filters, result.blocks, fromCol, fromItems);
  }
  return result;
}

export function insertFilterAt(filters, blocks, filter, column, insertIndex, columnCount) {
  const targetCol = Math.min(Math.max(column, 0), columnCount - 1);
  const nextFilters = [...filters, { ...filter, column: targetCol, order: insertIndex }];
  const colItems = getColumnItems(
    nextFilters.filter((f) => f.id !== filter.id),
    blocks,
    targetCol
  );
  colItems.splice(insertIndex, 0, { kind: "filter", id: filter.id, order: insertIndex, data: filter });
  return applyColumnOrder(nextFilters, blocks, targetCol, colItems);
}

export function insertBlockAt(filters, blocks, block, column, insertIndex, columnCount) {
  const targetCol = Math.min(Math.max(column, 0), columnCount - 1);
  const without = blocks.filter((b) => b.id !== block.id);
  const nextBlocks = [...without, { ...block, column: targetCol, order: insertIndex }];
  const colItems = getColumnItems(filters, without, targetCol);
  colItems.splice(insertIndex, 0, { kind: "block", id: block.id, order: insertIndex, data: block });
  return applyColumnOrder(filters, nextBlocks, targetCol, colItems);
}

export function gridTemplateColumns(columns) {
  const total = columns.reduce((sum, c) => sum + (c.width || 0), 0) || 100;
  return columns.map((c) => `${((c.width / total) * 100).toFixed(4)}%`).join(" ");
}

export function selectionId(kind, id) {
  return `${kind}:${id}`;
}

export function parseSelectionId(sel) {
  if (!sel) return null;
  const [kind, ...rest] = sel.split(":");
  return { kind, id: rest.join(":") };
}
