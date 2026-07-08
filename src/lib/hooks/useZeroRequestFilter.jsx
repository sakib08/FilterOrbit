import { useCallback, useMemo, useState } from "react";
import { filterProducts, buildHistogram, getRangeBounds } from "../utils/filterEngine";
import {
  ensureProductEmbeddings,
  findSimilarProducts,
  textToEmbedding,
} from "../utils/vectorSearch";
import { parseNaturalLanguageLocally } from "../utils/naturalLanguage";
import { personalizeFilterOrder } from "../utils/personalization";

export function useZeroRequestFilter(config) {
  const {
    products: rawProducts,
    filters: rawFilters,
    hideIrrelevantFilters = true,
    histogramBins = 24,
    onNaturalLanguageQuery,
    onEmbedQuery,
  } = config;

  const safeProducts = Array.isArray(rawProducts) ? rawProducts : [];
  const safeFilters = Array.isArray(rawFilters) ? rawFilters : [];

  const products = useMemo(
    () => ensureProductEmbeddings(safeProducts),
    [safeProducts]
  );

  const filters = useMemo(
    () => personalizeFilterOrder(safeFilters, hideIrrelevantFilters),
    [safeFilters, hideIrrelevantFilters]
  );

  const [filterState, setFilterState] = useState({});
  const [textQuery, setTextQuery] = useState("");
  const [semanticIds, setSemanticIds] = useState();
  const [aiLoading, setAiLoading] = useState(false);
  const [filterResetKey, setFilterResetKey] = useState(0);

  const priceFilter = filters.find((f) => f.type === "range" && f.field === "price");
  const priceMin = priceFilter?.min ?? 0;
  const priceMax =
    priceFilter?.max ??
    (products.length > 0 ? Math.max(...products.map((p) => Number(p.price) || 0)) : 100);

  const histogram = useMemo(
    () => buildHistogram(products, "price", priceMin, priceMax, histogramBins),
    [products, priceMin, priceMax, histogramBins]
  );

  const filteredProducts = useMemo(
    () => filterProducts(products, filterState, textQuery, semanticIds, filters),
    [products, filterState, textQuery, semanticIds, filters]
  );

  const result = useMemo(
    () => ({
      products: filteredProducts,
      total: filteredProducts.length,
      activeFilters: filterState,
    }),
    [filteredProducts, filterState]
  );

  const toggleFilter = useCallback((filterId, value, multi = true) => {
    setFilterState((prev) => {
      const current = prev[filterId] ?? [];
      const exists = current.some((v) => v === value);
      let next;
      if (multi) {
        next = exists
          ? current.filter((v) => v !== value)
          : [...current, value];
      } else {
        next = exists ? [] : [value];
      }
      return { ...prev, [filterId]: next };
    });
  }, []);

  const setRangeFilter = useCallback(
    (filterId, minVal, maxVal) => {
      setFilterState((prev) => {
        const def = filters.find((f) => f.id === filterId);
        if (def?.type === "range") {
          const bounds = getRangeBounds(def, products);
          if (
            Number(minVal) === bounds.min &&
            Number(maxVal) === bounds.max
          ) {
            if (!(filterId in prev)) {
              return prev;
            }
            const next = { ...prev };
            delete next[filterId];
            return next;
          }
        }
        return { ...prev, [filterId]: [minVal, maxVal] };
      });
    },
    [filters, products]
  );

  const clearFilters = useCallback(() => {
    setFilterState({});
    setTextQuery("");
    setSemanticIds(undefined);
    setFilterResetKey((key) => key + 1);
  }, []);

  const applyNaturalLanguage = useCallback(
    async (query) => {
      setAiLoading(true);
      try {
        let next;
        if (onNaturalLanguageQuery) {
          next = await onNaturalLanguageQuery(query);
        } else {
          next = parseNaturalLanguageLocally(query, products);
        }
        setFilterState((prev) => ({ ...prev, ...next }));
        setTextQuery(query);
      } finally {
        setAiLoading(false);
      }
    },
    [onNaturalLanguageQuery, products]
  );

  const applySemanticStyle = useCallback(
    async (styleDescription, sourceProduct) => {
      let embedding;
      if (onEmbedQuery) {
        embedding = await onEmbedQuery(styleDescription);
      } else if (sourceProduct?.embedding) {
        embedding = sourceProduct.embedding;
      } else {
        embedding = textToEmbedding(styleDescription);
      }
      const matches = findSimilarProducts(products, embedding);
      setSemanticIds(new Set(matches.map((m) => m.id)));
    },
    [onEmbedQuery, products]
  );

  const clearSemantic = useCallback(() => setSemanticIds(undefined), []);

  return {
    filters,
    products,
    filterState,
    textQuery,
    setTextQuery,
    result,
    histogram,
    priceMin,
    priceMax,
    toggleFilter,
    setRangeFilter,
    clearFilters,
    applyNaturalLanguage,
    applySemanticStyle,
    clearSemantic,
    semanticActive: Boolean(semanticIds?.size),
    aiLoading,
    filterResetKey,
  };
}
