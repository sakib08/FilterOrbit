import { countByOption, resolveProductField } from "./filterEngine";

const SESSION_KEY = "ppros_ecom_filter_browse";
const BROWSE_EVENT_NAME = "ppros_ecom_filter_browse";

function readBrowseEvents() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function subscribeBrowseEvents(onStoreChange) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onStoreChange();
  window.addEventListener(BROWSE_EVENT_NAME, handler);
  return () => window.removeEventListener(BROWSE_EVENT_NAME, handler);
}

export function recordBrowseEvent(filterId, value) {
  try {
    const events = readBrowseEvents();
    events.push({ filterId, value, timestamp: Date.now() });
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(events.slice(-100)));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(BROWSE_EVENT_NAME));
    }
  } catch {
    /* sessionStorage unavailable */
  }
}

export function recordProductView(productId) {
  recordBrowseEvent("__product__", productId);
}

function weightedScore(events) {
  const now = Date.now();
  let total = 0;
  for (const event of events) {
    const ageHours = (now - event.timestamp) / 3600000;
    total += Math.max(0.1, 1 - ageHours / 48);
  }
  return total;
}

export function getBrowseScores() {
  const scores = new Map();
  const now = Date.now();

  for (const event of readBrowseEvents()) {
    const ageHours = (now - event.timestamp) / 3600000;
    const weight = Math.max(0.1, 1 - ageHours / 48);
    scores.set(event.filterId, (scores.get(event.filterId) ?? 0) + weight);
  }

  return scores;
}

export function getBrowseValueScores() {
  const scores = new Map();
  const now = Date.now();

  for (const event of readBrowseEvents()) {
    if (event.filterId === "__product__") {
      continue;
    }
    const ageHours = (now - event.timestamp) / 3600000;
    const weight = Math.max(0.1, 1 - ageHours / 48);
    const key = `${event.filterId}::${String(event.value)}`;
    scores.set(key, (scores.get(key) ?? 0) + weight);
  }

  return scores;
}

function productMatchesValue(product, field, value) {
  const raw = resolveProductField(product, field);
  if (raw === undefined || raw === null) {
    return false;
  }

  const needle = String(value).toLowerCase();
  const values = Array.isArray(raw) ? raw : [raw];
  return values.some((entry) => String(entry).toLowerCase() === needle);
}

function scoreProduct(product, filters, valueScores, filterState) {
  let score = 0;

  for (const [key, weight] of valueScores) {
    const sep = key.indexOf("::");
    if (sep === -1) {
      continue;
    }
    const filterId = key.slice(0, sep);
    const value = key.slice(sep + 2);
    const def = filters.find((f) => f.id === filterId);
    const field = def?.field ?? filterId;
    if (productMatchesValue(product, field, value)) {
      score += weight * 12;
    }
  }

  for (const [filterId, values] of Object.entries(filterState)) {
    const def = filters.find((f) => f.id === filterId);
    const field = def?.field ?? filterId;
    for (const value of values) {
      if (productMatchesValue(product, field, value)) {
        score += 8;
      }
    }
  }

  const viewedProducts = readBrowseEvents().filter(
    (event) => event.filterId === "__product__"
  );
  if (viewedProducts.some((event) => String(event.value) === product.id)) {
    score += 6;
  }

  score += (Number(product.rating) || 0) * 2;

  return score;
}

function topEntries(map, limit) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function findFilter(filters, matcher) {
  return filters.find(matcher);
}

function formatPriceRange(min, max, currency) {
  const prefix = currency ? `${currency} ` : "$";
  return `${prefix}${Math.round(min)} – ${prefix}${Math.round(max)}`;
}

function initialsFromLabel(label) {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "YO";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildMetrics(products, filters, valueScores) {
  const metrics = [];
  const browsed = topEntries(valueScores, 6);

  const categoryFilter = findFilter(filters, (f) => f.field === "category");
  if (categoryFilter) {
    const categoryCounts = countByOption(products, categoryFilter.field);
    const topBrowsedCategory = browsed.find(([key]) => {
      const filterId = key.split("::")[0];
      return filterId === categoryFilter.id;
    });
    const topCatalog = topEntries(categoryCounts, 1)[0];

    if (topBrowsedCategory) {
      const value = topBrowsedCategory[0].split("::")[1] ?? "";
      metrics.push({
        label: "Top Interest",
        value,
        pct: Math.min(95, 55 + topBrowsedCategory[1] * 10),
      });
    } else if (topCatalog) {
      metrics.push({
        label: "Catalog Focus",
        value: topCatalog[0],
        pct: Math.min(85, 45 + topCatalog[1] * 3),
      });
    }
  }

  const prices = products
    .map((product) => Number(product.price))
    .filter((price) => !Number.isNaN(price) && price > 0);
  if (prices.length > 0) {
    prices.sort((a, b) => a - b);
    const q1 = prices[Math.floor(prices.length * 0.25)] ?? prices[0];
    const q3 = prices[Math.floor(prices.length * 0.75)] ?? prices[prices.length - 1];
    metrics.push({
      label: "Price Comfort",
      value: formatPriceRange(q1, q3, products[0]?.currency),
      pct: Math.min(90, 50 + Math.round((q3 - q1) / Math.max(q3, 1) * 40)),
    });
  }

  const brandFilter = findFilter(
    filters,
    (f) => f.field === "brand" || f.id === "brand"
  );
  if (brandFilter) {
    const brandCounts = countByOption(products, brandFilter.field);
    const browsedBrands = browsed
      .filter(([key]) => key.startsWith(`${brandFilter.id}::`))
      .map(([key, weight]) => [key.split("::")[1] ?? "", weight]);

    const brandNames =
      browsedBrands.length > 0
        ? browsedBrands.slice(0, 3).map(([name]) => name)
        : topEntries(brandCounts, 3).map(([name]) => name);

    if (brandNames.length > 0) {
      const totalWeight = browsedBrands.reduce((sum, [, weight]) => sum + weight, 0);
      metrics.push({
        label: "Brand Affinity",
        value: brandNames.join(", "),
        pct: Math.min(92, 40 + totalWeight * 12 + brandNames.length * 8),
      });
    }
  }

  const variantFilter = findFilter(
    filters,
    (f) => f.field.startsWith("pa_") || !!f.variant
  );
  if (variantFilter) {
    const variantCounts = countByOption(products, variantFilter.field);
    const topVariant = topEntries(variantCounts, 1)[0];
    const browsedVariant = browsed.find(([key]) =>
      key.startsWith(`${variantFilter.id}::`)
    );

    if (browsedVariant || topVariant) {
      const value = browsedVariant
        ? browsedVariant[0].split("::")[1] ?? ""
        : topVariant?.[0] ?? "";
      metrics.push({
        label: variantFilter.label,
        value,
        pct: Math.min(
          94,
          48 +
            (browsedVariant?.[1] ?? 0) * 12 +
            (topVariant?.[1] ?? 0) * 2
        ),
      });
    }
  }

  return metrics.slice(0, 4);
}

function buildQuickChips(products, filters, valueScores) {
  const chips = [];
  const used = new Set();

  const topBrowse = topEntries(valueScores, 1)[0];
  if (topBrowse) {
    const sep = topBrowse[0].indexOf("::");
    const filterId = topBrowse[0].slice(0, sep);
    const value = topBrowse[0].slice(sep + 2);
    chips.push({
      id: "next",
      label: value,
      count: Math.max(1, Math.round(topBrowse[1] * 10)),
      filterId,
      value,
    });
    used.add(`${filterId}::${value}`);
  }

  const categoryFilter = findFilter(filters, (f) => f.field === "category");
  if (categoryFilter) {
    const topCategory = topEntries(
      countByOption(products, categoryFilter.field),
      1
    )[0];
    if (topCategory) {
      const key = `${categoryFilter.id}::${topCategory[0]}`;
      if (!used.has(key)) {
        chips.push({
          id: "trending",
          label: topCategory[0],
          count: topCategory[1],
          filterId: categoryFilter.id,
          value: topCategory[0],
        });
        used.add(key);
      }
    }
  }

  for (const filter of filters) {
    if (filter.type === "range" || chips.length >= 6) {
      continue;
    }

    const counts = countByOption(products, filter.field);
    for (const [value, count] of topEntries(counts, 2)) {
      const key = `${filter.id}::${value}`;
      if (used.has(key) || chips.length >= 6) {
        continue;
      }
      chips.push({
        id: `${filter.id}-${value}`,
        label: value,
        count,
        filterId: filter.id,
        value,
        icon: filter.field.startsWith("pa_") ? "◆" : "♥",
      });
      used.add(key);
    }
  }

  return chips;
}

function predictionReason(product, filters, valueScores) {
  for (const [key, weight] of topEntries(valueScores, 3)) {
    const sep = key.indexOf("::");
    if (sep === -1) {
      continue;
    }
    const filterId = key.slice(0, sep);
    const value = key.slice(sep + 2);
    const def = filters.find((f) => f.id === filterId);
    const field = def?.field ?? filterId;
    if (productMatchesValue(product, field, value) && weight > 0) {
      return {
        tag: def?.label ?? "Match",
        reason: `Matches your recent ${def?.label?.toLowerCase() ?? "filter"}: ${value}`,
      };
    }
  }

  if (product.category) {
    return {
      tag: "Popular",
      reason: `Trending in ${product.category}`,
    };
  }

  if (product.brand) {
    return {
      tag: "Brand fit",
      reason: `Similar to ${product.brand} picks`,
    };
  }

  return {
    tag: "Recommended",
    reason: "Based on your session activity",
  };
}

function buildPredictions(products, filters, valueScores, filterState) {
  const scored = products
    .map((product) => ({
      product,
      score: scoreProduct(product, filters, valueScores, filterState),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const pool =
    scored.length > 0
      ? scored
      : products
          .map((product) => ({
            product,
            score:
              (Number(product.rating) || 0) * 2 +
              (Number(product.price) > 0 ? 1 : 0),
          }))
          .sort((a, b) => b.score - a.score);

  const maxScore = pool[0]?.score ?? 1;

  return pool.slice(0, 3).map(({ product, score }) => {
    const { tag, reason } = predictionReason(product, filters, valueScores);
    return {
      id: product.id,
      title: product.title,
      tag,
      reason,
      price: Number(product.price) || 0,
      currency: product.currency,
      fit: Math.min(99, Math.max(55, Math.round((score / maxScore) * 94))),
      imageUrl: typeof product.imageUrl === "string" ? product.imageUrl : "",
    };
  });
}

export function buildPersonalizationProfile(
  products,
  filters,
  filterState = {}
) {
  const events = readBrowseEvents().filter(
    (event) => event.filterId !== "__product__"
  );
  const valueScores = getBrowseValueScores();
  const eventWeight = weightedScore(events);
  const isLearning = events.length < 2;
  const confidence = Math.min(
    96,
    Math.max(32, Math.round(34 + eventWeight * 9 + events.length * 4))
  );

  const topBrowse = topEntries(valueScores, 1)[0];
  const sessionLabel = isLearning
    ? "Your Session"
    : topBrowse
      ? topBrowse[0].split("::")[1] ?? "Your Session"
      : products[0]?.category
        ? `${products[0].category} Shopper`
        : "Your Session";

  return {
    confidence,
    sessionLabel,
    sessionInitials: initialsFromLabel(sessionLabel),
    metrics: buildMetrics(products, filters, valueScores),
    quickChips: buildQuickChips(products, filters, valueScores),
    predictions: buildPredictions(products, filters, valueScores, filterState),
    isLearning,
  };
}

export function personalizeFilterOrder(filters, hideIrrelevant) {
  if (!Array.isArray(filters)) return [];
  const scores = getBrowseScores();
  const touched = new Set([...scores.keys()]);

  const ranked = [...filters].map((f) => ({
    ...f,
    priority: (scores.get(f.id) ?? 0) + (f.priority ?? 0),
  }));

  ranked.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  if (!hideIrrelevant || touched.size === 0) return ranked;

  return ranked.map((f) => {
    const hasActivity = touched.has(f.id) || (f.priority ?? 0) > 0;
    const isRecommended = (f.priority ?? 0) > 0.5;
    return {
      ...f,
      hidden: !hasActivity && !isRecommended && f.type !== "range",
    };
  });
}

export function getRecommendedFilterIds() {
  const scores = getBrowseScores();
  return [...scores.entries()]
    .filter(([id, score]) => id !== "__product__" && score >= 0.5)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, 4);
}
