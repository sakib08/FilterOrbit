export type FilterValue = string | number | boolean;

export interface VisualFilterOption {
  id: string;
  label: string;
  imageUrl?: string;
  /** Solid color circle swatch (hex without #) */
  hexColor?: string;
  alt?: string;
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "visual" | "range" | "store" | "language";
  field: string;
  options?: { value: string; label: string; count?: number }[];
  visualOptions?: VisualFilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  accent?: "violet" | "teal";
  hidden?: boolean;
  priority?: number;
  variant?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  storeId?: string;
  locale?: string;
  category?: string;
  brand?: string;
  powerSource?: string;
  color?: string;
  style?: string;
  tags?: string[];
  rating?: number;
  weight?: number;
  /** Pre-computed embedding vector for semantic similarity */
  embedding?: number[];
  [key: string]: unknown;
}

export interface StoreOption {
  id: string;
  label: string;
  currency: string;
  locale: string;
}

export interface BrowseEvent {
  filterId: string;
  value: FilterValue;
  timestamp: number;
}

export interface EcomFilterConfig {
  products: Product[];
  filters: FilterDefinition[];
  stores?: StoreOption[];
  /** Simulated AI: maps natural language phrases to filter state */
  onNaturalLanguageQuery?: (query: string) => Promise<Record<string, FilterValue[]>>;
  /** Optional: real embedding API for semantic search */
  onEmbedQuery?: (text: string) => Promise<number[]>;
  hideIrrelevantFilters?: boolean;
  histogramBins?: number;
  className?: string;
}

export interface FilterState {
  [filterId: string]: FilterValue[];
}

export interface EcomFilterResult {
  products: Product[];
  total: number;
  activeFilters: FilterState;
  semanticMatchId?: string;
}
