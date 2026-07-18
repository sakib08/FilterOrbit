import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterOrbitLayout } from "../../src/lib";
import "./styles.css";

const DISPLAY_FONT = "Outfit";
const BODY_FONT = "DM Sans";

function fontStack(family) {
  if (!family) {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }
  return `"${family}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
}

function ensureGoogleFontLink(bodyFamily) {
  const families = [];
  if (bodyFamily) families.push(bodyFamily);
  if (!families.includes(DISPLAY_FONT)) families.push(DISPLAY_FONT);
  if (!families.length) return;

  const id = "filter-orbit-runtime-google-font";
  let link = document.getElementById(id);
  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const params = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

function typographyTokens(settings = {}) {
  const bodyFamily = settings.google_font ?? BODY_FONT;
  const sansStack = fontStack(bodyFamily);
  const displayStack = fontStack(DISPLAY_FONT);
  return {
    bodyFamily,
    sansStack,
    displayStack,
    labelSize: Number(settings.label_font_size ?? 11),
    optionSize: Number(settings.option_font_size ?? 14),
    titleSize: Number(settings.product_title_font_size ?? 14),
    priceSize: Number(settings.product_price_font_size ?? 16),
  };
}

function injectTypographyCss(settings = {}) {
  const t = typographyTokens(settings);
  const id = "filter-orbit-runtime-typography";
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }

  style.textContent = `
.filter-orbit-root[data-filter-orbit],
.filter-orbit-root[data-filter-orbit] .filter-orbit-root,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-root,
.filter-orbit-root[data-filter-orbit] .filter-orbit-font-scope {
  --font-sans: ${t.sansStack};
  --font-display: ${t.displayStack};
  --font-size: 16px;
  --fo-label-size: ${t.labelSize}px;
  --fo-option-size: ${t.optionSize}px;
  --fo-title-size: ${t.titleSize}px;
  --fo-price-size: ${t.priceSize}px;
  font-family: ${t.sansStack} !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-section-title,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-section-label,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-pill-group-label {
  font-family: ${t.displayStack} !important;
  font-size: ${t.labelSize}px !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-filters-heading,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-filters-heading span {
  font-family: ${t.displayStack} !important;
  font-size: 2.5rem !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-pill,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-checkbox-row,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-checkbox-row-label,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-checkbox-label,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-toggle-row,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-toggle-row .ppros_ecom_filter-checkbox-label {
  font-family: ${t.sansStack} !important;
  font-size: ${t.optionSize}px !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-pill-size {
  font-family: ${t.sansStack} !important;
  font-size: 0.75rem !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-product-name,
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-product-title {
  font-family: ${t.sansStack} !important;
  font-size: ${t.titleSize}px !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-product-price {
  font-family: ${t.sansStack} !important;
  font-size: ${t.priceSize}px !important;
}
.filter-orbit-root[data-filter-orbit] .ppros_ecom_filter-product-price-original {
  font-family: ${t.sansStack} !important;
  font-size: calc(${t.priceSize}px * 0.875) !important;
}
`;
}

function applyTypography(el, settings = {}) {
  if (!el) return;
  const t = typographyTokens(settings);
  el.style.setProperty("--font-sans", t.sansStack);
  el.style.setProperty("--font-display", t.displayStack);
  el.style.setProperty("--font-size", "16px");
  el.style.setProperty("--fo-label-size", `${t.labelSize}px`);
  el.style.setProperty("--fo-option-size", `${t.optionSize}px`);
  el.style.setProperty("--fo-title-size", `${t.titleSize}px`);
  el.style.setProperty("--fo-price-size", `${t.priceSize}px`);
  el.style.fontFamily = t.sansStack;
  if (t.bodyFamily) {
    el.dataset.googleFont = t.bodyFamily;
  }
}

function FilterOrbitWidget({ config, rootEl }) {
  const filters = config.filters ?? [];
  const products = config.products ?? [];
  const settings = config.settings ?? {};
  const pageLayout = settings.page_layout ?? null;
  const language = config.language ?? {};
  const t = typographyTokens(settings);

  applyTypography(rootEl, settings);

  return (
    <div
      className="filter-orbit-font-scope"
      style={{
        fontFamily: t.sansStack,
        ["--font-sans"]: t.sansStack,
        ["--font-display"]: t.displayStack,
        ["--font-size"]: "16px",
        ["--fo-label-size"]: `${t.labelSize}px`,
        ["--fo-option-size"]: `${t.optionSize}px`,
        ["--fo-title-size"]: `${t.titleSize}px`,
        ["--fo-price-size"]: `${t.priceSize}px`,
      }}
    >
      <FilterOrbitLayout
        pageLayout={pageLayout}
        filters={filters}
        products={products}
        settings={settings}
        language={language}
      />
    </div>
  );
}

function mountAll() {
  const nodes = document.querySelectorAll("[data-filter-orbit]");

  if (!nodes.length) {
    return;
  }

  const config = window.filterOrbit;

  if (!config) {
    return;
  }

  const settings = config.settings ?? {};
  ensureGoogleFontLink(settings.google_font || BODY_FONT);
  injectTypographyCss(settings);

  nodes.forEach((el) => {
    if (el.dataset.mounted === "true") {
      return;
    }
    el.dataset.mounted = "true";
    applyTypography(el, settings);
    createRoot(el).render(
      <StrictMode>
        <FilterOrbitWidget config={config} rootEl={el} />
      </StrictMode>
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}
