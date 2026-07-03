import type { FilterDefinition, FilterState, Product } from "../types";

export function resolveProductField(
  product: Product,
  field: string
): unknown {
  const direct = product[field];
  if (direct !== undefined && direct !== null) {
    return direct;
  }

  if (field.startsWith("pa_")) {
    const short = field.slice(3);
    const legacy = product[short];
    if (legacy !== undefined && legacy !== null) {
      return legacy;
    }
  } else {
    const taxonomy = product[`pa_${field}`];
    if (taxonomy !== undefined && taxonomy !== null) {
      return taxonomy;
    }
  }

  return undefined;
}

function productFieldValues(product: Product, field: string): string[] {
  const raw = resolveProductField(product, field);
  if (raw === undefined || raw === null) {
    return [];
  }

  const values = Array.isArray(raw) ? raw : [raw];
  return values.map((value) => String(value).toLowerCase());
}

function matchesField(
  product: Product,
  field: string,
  values: (string | number | boolean)[]
): boolean {
  if (values.length === 0) return true;

  const productValues = productFieldValues(product, field);
  if (productValues.length === 0) return false;

  return values.some((value) =>
    productValues.includes(String(value).toLowerCase())
  );
}

function matchesRange(
  product: Product,
  field: string,
  range: (string | number | boolean)[]
): boolean {
  if (range.length < 2) return true;
  const value = Number(product[field]);
  if (Number.isNaN(value)) return false;
  const min = Number(range[0]);
  const max = Number(range[1]);
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
  return value >= min && value <= max;
}

function resolveRangeField(
  filterId: string,
  filterDefs?: FilterDefinition[]
): string | null {
  const def = filterDefs?.find((f) => f.id === filterId);
  if (def?.type === "range") {
    return def.field;
  }

  if (filterId === "price" || filterId === "rating" || filterId === "weight") {
    return filterId === "price" ? "price" : filterId;
  }

  return null;
}

function isDefaultRange(
  values: (string | number | boolean)[],
  filterId: string,
  filterDefs: FilterDefinition[] | undefined,
  products: Product[] | undefined | null
): boolean {
  if (values.length < 2) return true;
  const def = filterDefs?.find((f) => f.id === filterId);
  if (!def || def.type !== "range") return false;
  const bounds = getRangeBounds(def, Array.isArray(products) ? products : []);
  return (
    Number(values[0]) === bounds.min && Number(values[1]) === bounds.max
  );
}

function matchesSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    product.title,
    product.description,
    product.brand,
    product.category,
    product.color,
    product.style,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterProducts(
  products: Product[] | undefined | null,
  state: FilterState,
  textQuery = "",
  semanticProductIds?: Set<string>,
  filterDefs?: FilterDefinition[]
): Product[] {
  const catalog = Array.isArray(products) ? products : [];
  let result = catalog;

  if (textQuery) {
    result = result.filter((p) => matchesSearch(p, textQuery));
  }

  for (const [filterId, values] of Object.entries(state)) {
    if (!values?.length) continue;

    const rangeField = resolveRangeField(filterId, filterDefs);
    if (rangeField) {
      if (isDefaultRange(values, filterId, filterDefs, catalog)) {
        continue;
      }
      result = result.filter((p) => matchesRange(p, rangeField, values));
      continue;
    }

    if (filterId === "storeId" || filterId === "locale") {
      result = result.filter((p) => matchesField(p, filterId, values));
      continue;
    }

    const def = filterDefs?.find((f) => f.id === filterId);
    const field = def?.field ?? filterId;
    result = result.filter((p) => matchesField(p, field, values));
  }

  if (semanticProductIds && semanticProductIds.size > 0) {
    result = result.filter((p) => semanticProductIds.has(p.id));
  }

  return result;
}

export function getRangeBounds(
  def: FilterDefinition,
  products: Product[]
): { min: number; max: number } {
  const min = Number(def.min ?? 0);
  const configuredMax =
    def.max != null && !Number.isNaN(Number(def.max))
      ? Number(def.max)
      : undefined;

  const values = (Array.isArray(products) ? products : [])
    .map((p) => Number(p[def.field]))
    .filter((v) => !Number.isNaN(v));

  const productMax = values.length > 0 ? Math.max(...values) : 100;

  if (configuredMax != null && !Number.isNaN(configuredMax)) {
    return {
      min: Number.isNaN(min) ? 0 : min,
      max: Math.max(configuredMax, productMax),
    };
  }

  return {
    min: Number.isNaN(min) ? 0 : min,
    max: productMax,
  };
}

export function buildHistogram(
  products: Product[] | undefined | null,
  field: string,
  min: number,
  max: number,
  bins = 24
): number[] {
  const counts = new Array(bins).fill(0) as number[];
  const span = max - min || 1;
  for (const p of (Array.isArray(products) ? products : [])) {
    const v = Number(p[field]);
    if (Number.isNaN(v)) continue;
    const idx = Math.min(
      bins - 1,
      Math.max(0, Math.floor(((v - min) / span) * bins))
    );
    counts[idx]++;
  }
  const peak = Math.max(...counts, 1);
  return counts.map((c) => c / peak);
}

export function countByOption(
  products: Product[],
  field: string
): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of products) {
    const raw = resolveProductField(p, field);
    if (raw == null) continue;

    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = String(value).trim();
      if (key === "") continue;        // skip blank/empty entries
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return map;
}

export function getFilterOptions(
  def: FilterDefinition,
  products: Product[]
): { value: string; label: string; count?: number }[] {
  const counts = countByOption(products, def.field);

  if (def.options?.length) {
    return def.options.map((option) => ({
      ...option,
      count: counts.get(option.value) ?? 0,
    }));
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }));
}
