# ppros_ecom_filter

Modern React e-commerce filter library with **zero-request** client-side filtering. All Tailwind classes use the `ppros_ecom_filter-` prefix to avoid style collisions.

## Features

| Feature | Component / Hook |
|--------|------------------|
| **Generative AI natural language** | `SearchWithAI` — AI button to the right of search opens a second field |
| **Visual discovery** | `VisualDiscoveryFilter` — image swatch grid for color/style |
| **Predictive personalization** | `PersonalizedFilters` + session browse scoring reorders/hides filters |
| **Range + histogram** | `RangeSliderHistogram` — price slider with distribution bars |
| **Multi-store / semantic** | `GlobalSemanticFilter` — store/locale + vector similarity search |
| **Instant loading** | `useZeroRequestFilter` — filters run on pre-cached `products` JSON in memory |

## Quick start

```bash
npm install
npm run dev      # demo at http://localhost:5173
npm run build    # library bundle in dist/
```

## Usage

```tsx
import { EcomFilterPanel } from "ppros-ecom-filter";
import "ppros-ecom-filter/styles.css";

<EcomFilterPanel
  products={cachedProducts}
  filters={filterDefinitions}
  stores={storeOptions}
  hideIrrelevantFilters
  onResultsChange={(result) => setGrid(result.products)}
/>
```

### Filter definitions

```ts
{
  id: "color",
  label: "Color",
  type: "visual",
  field: "color",
  visualOptions: [
    { id: "blue", label: "Blue", imageUrl: "/swatches/blue.png" },
  ],
}
```

### Plug in real AI / embeddings

```ts
<EcomFilterPanel
  onNaturalLanguageQuery={async (q) => {
    const res = await fetch("/api/ai-parse-filter", { method: "POST", body: JSON.stringify({ q }) });
    return res.json();
  }}
  onEmbedQuery={async (text) => {
    const res = await fetch("/api/embed", { method: "POST", body: JSON.stringify({ text }) });
    return res.json().vector;
  }}
/>
```

Offline/demo mode uses local phrase parsing and bag-of-words embeddings.

### Headless hook

```ts
const {
  result,
  toggleFilter,
  applyNaturalLanguage,
  applySemanticStyle,
} = useZeroRequestFilter({ products, filters });
```

## Architecture

```
User toggles filter
       ↓
filterState (React state)
       ↓
filterProducts() — pure JS on cached array
       ↓
UI updates instantly (no HTTP)
```

Personalization reads `sessionStorage` key `ppros_ecom_filter_browse` and boosts filters the user has used recently.

## CSS prefix

All library UI uses Tailwind with `prefix: 'ppros_ecom_filter-'` in `tailwind.config.js`. Utility classes look like `ppros_ecom_filter-flex`, `ppros_ecom_filter-btn-primary`.

## License

MIT
