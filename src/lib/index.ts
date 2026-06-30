import "./styles.css";

export { EcomFilterPanel } from "./components/EcomFilterPanel";
export { FilterOrbitLayout } from "./components/FilterOrbitLayout";
export { ProductGrid } from "./components/ProductGrid";
export { LanguageProvider, useLanguage } from "./language/LanguageContext";
export { DEFAULT_LANGUAGE_STRINGS, resolveLanguageStrings } from "./language/defaults";
export { SearchWithAI } from "./components/SearchWithAI";
export { VisualDiscoveryFilter } from "./components/VisualDiscoveryFilter";
export { VisualDiscoveryUpload } from "./components/VisualDiscoveryUpload";
export { PersonalizedFilters } from "./components/PersonalizedFilters";
export { RangeSliderHistogram } from "./components/RangeSliderHistogram";
export { RangeFiltersPanel } from "./components/RangeFiltersPanel";
export { GlobalSemanticFilter } from "./components/GlobalSemanticFilter";
export { CheckboxFilterGroup } from "./components/CheckboxFilterGroup";
export { PillFilterGroup } from "./components/PillFilterGroup";
export { VendorFilter } from "./components/VendorFilter";

export { useZeroRequestFilter } from "./hooks/useZeroRequestFilter";

export { filterProducts, buildHistogram, countByOption } from "./utils/filterEngine";
export {
  textToEmbedding,
  ensureProductEmbeddings,
  findSimilarProducts,
} from "./utils/vectorSearch";
export { parseNaturalLanguageLocally } from "./utils/naturalLanguage";
export {
  recordBrowseEvent,
  recordProductView,
  personalizeFilterOrder,
  getRecommendedFilterIds,
  buildPersonalizationProfile,
} from "./utils/personalization";

export type {
  Product,
  FilterDefinition,
  FilterState,
  FilterValue,
  VisualFilterOption,
  StoreOption,
  EcomFilterConfig,
  EcomFilterResult,
  BrowseEvent,
} from "./types";
