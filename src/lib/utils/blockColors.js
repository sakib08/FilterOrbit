const PRESET_HEX = {
  violet: "#8b5cf6",
  indigo: "#6366f1",
  teal: "#14b8a6",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  sky: "#0ea5e9",
  slate: "#64748b",
};

export const DEFAULT_BLOCK_COLORS = {
  nlp_search: "#8b5cf6",
  personalized: "#f43f5e",
  visual_upload: "#14b8a6",
  results_bar: "#64748b",
  products: "#f59e0b",
};

export const DEFAULT_FILTER_COLORS = {
  checkbox: "#8b5cf6",
  range: "#6366f1",
  visual: "#14b8a6",
};

export function normalizeHexColor(value, fallback = "#8b5cf6") {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim().toLowerCase();

  if (PRESET_HEX[trimmed]) {
    return PRESET_HEX[trimmed];
  }

  let hex = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return fallback;
  }

  return `#${hex}`;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function getBlockColorTheme(color, fallback = "#8b5cf6") {
  const hex = normalizeHexColor(color, fallback);

  return {
    hex,
    border: mixWithWhite(hex, 0.55),
    background: mixWithWhite(hex, 0.88),
    text: hex,
  };
}

export function getDefaultBlockColor(blockType) {
  return DEFAULT_BLOCK_COLORS[blockType] ?? "#8b5cf6";
}

export function getDefaultFilterColor(filterType) {
  return DEFAULT_FILTER_COLORS[filterType] ?? "#8b5cf6";
}

export function resolveUiColors(item, defaults = {}) {
  const base = normalizeHexColor(
    defaults.color ?? defaults.background ?? "#8b5cf6",
    "#8b5cf6"
  );

  const color = normalizeHexColor(item?.color, base);
  const buttonColor = normalizeHexColor(item?.buttonColor, defaults.buttonColor ?? color);
  const barColor = normalizeHexColor(item?.barColor, defaults.barColor ?? buttonColor);
  const accentColor = normalizeHexColor(item?.accentColor, defaults.accentColor ?? buttonColor);

  return {
    color,
    buttonColor,
    barColor,
    accentColor,
    shell: getBlockColorTheme(color),
    button: {
      hex: buttonColor,
      border: buttonColor,
      text: buttonColor,
      background: mixWithWhite(buttonColor, 0.88),
    },
    bar: {
      hex: barColor,
      active: barColor,
      inactive: mixWithWhite(barColor, 0.82),
      text: barColor,
    },
    accent: {
      hex: accentColor,
      text: accentColor,
    },
  };
}

export function getDefaultUiColorsForBlock(blockType) {
  const color = getDefaultBlockColor(blockType);
  return {
    color,
    buttonColor: color,
    barColor: color,
    accentColor: color,
  };
}

export function getDefaultUiColorsForFilter(filterType) {
  const color = getDefaultFilterColor(filterType);
  return {
    color,
    buttonColor: color,
    barColor: filterType === "range" ? color : color,
    accentColor: color,
  };
}

export function sanitizeUiColorFields(source = {}, defaults = {}) {
  const resolved = resolveUiColors(source, defaults);
  return {
    color: resolved.color,
    buttonColor: resolved.buttonColor,
    barColor: resolved.barColor,
    accentColor: resolved.accentColor,
  };
}

export function getBarColorTheme(barColor, fallback = "#8b5cf6") {
  return resolveUiColors({ barColor }, { barColor: fallback }).bar;
}

export function getButtonColorTheme(buttonColor, fallback = "#8b5cf6") {
  return resolveUiColors({ buttonColor }, { buttonColor: fallback }).button;
}
