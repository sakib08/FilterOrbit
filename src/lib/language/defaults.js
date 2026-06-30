/** Default storefront copy — keys match PHP `default_language_strings()`. */
export const DEFAULT_LANGUAGE_STRINGS = {
  search_section_label: "AI Language",
  search_title: "AI Natural Language Filter",
  search_description: "Describe what you're looking for in plain English",
  search_placeholder:
    "e.g. Show me wireless headphones under $150 with noise cancellation…",

  visual_section_label: "Visual Search",
  visual_title: "Visual Discovery",
  visual_description: "Upload or drop an image to find visually similar products",
  visual_drop_text: "Drop image here or click to upload",
  visual_file_types: "PNG, JPG, WEBP — up to 20MB",
  visual_camera_button: "Camera",
  visual_url_button: "URL",

  personalized_title: "Predictive Personalization",
  personalized_description: "AI-modeled from your browsing, purchases & taste profile",
  personalized_predicted_title: "Predicted For You",
  personalized_model_confidence: "Model Confidence",
  personalized_active_badge: "ACTIVE",
  personalized_prioritized_prefix: "Prioritized filters:",
  chip_next_buy: "Your Next Buy",
  chip_trending: "Trending Near You",
  chip_eco: "Eco-friendly only",
  chip_sale: "On sale",
  chip_new: "New arrivals",
  chip_local: "Local brands",

  products_label: "products",
  clear_all: "Clear all",
  no_products: "No products match your filters.",
  selected_label: "SELECTED",
  fit_label: "fit",
};

/** Admin UI field groups for the Language Settings page. */
export const LANGUAGE_STRING_GROUPS = [
  {
    id: "search",
    title: "NLP / AI Search",
    fields: [
      { key: "search_section_label", label: "Section label" },
      { key: "search_title", label: "Title" },
      { key: "search_description", label: "Description" },
      { key: "search_placeholder", label: "Input placeholder" },
    ],
  },
  {
    id: "visual",
    title: "Visual Discovery",
    fields: [
      { key: "visual_section_label", label: "Section label" },
      { key: "visual_title", label: "Title" },
      { key: "visual_description", label: "Description" },
      { key: "visual_drop_text", label: "Upload area text" },
      { key: "visual_file_types", label: "File types hint" },
      { key: "visual_camera_button", label: "Camera button" },
      { key: "visual_url_button", label: "URL button" },
    ],
  },
  {
    id: "personalized",
    title: "Personalization",
    fields: [
      { key: "personalized_title", label: "Title" },
      { key: "personalized_description", label: "Description" },
      { key: "personalized_predicted_title", label: "Predicted section title" },
      { key: "personalized_model_confidence", label: "Model confidence label" },
      { key: "personalized_active_badge", label: "Active badge" },
      { key: "personalized_prioritized_prefix", label: "Prioritized filters prefix" },
      { key: "chip_next_buy", label: "Chip: Your Next Buy" },
      { key: "chip_trending", label: "Chip: Trending" },
      { key: "chip_eco", label: "Chip: Eco-friendly" },
      { key: "chip_sale", label: "Chip: On sale" },
      { key: "chip_new", label: "Chip: New arrivals" },
      { key: "chip_local", label: "Chip: Local brands" },
    ],
  },
  {
    id: "general",
    title: "General",
    fields: [
      { key: "products_label", label: "Products count word (e.g. “12 products”)" },
      { key: "clear_all", label: "Clear all button" },
      { key: "no_products", label: "Empty results message" },
      { key: "selected_label", label: "Selected count label (e.g. “2 SELECTED”)" },
      { key: "fit_label", label: "Fit percentage label (e.g. “94% fit”)" },
    ],
  },
];

export function resolveLanguageStrings(custom = {}) {
  return { ...DEFAULT_LANGUAGE_STRINGS, ...custom };
}
