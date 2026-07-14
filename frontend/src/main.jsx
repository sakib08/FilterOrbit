import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterOrbitLayout } from "../../src/lib";
import "./styles.css";

function fontStack(family) {
  if (!family) {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }
  return `"${family}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
}

function applyTypography(el, settings = {}) {
  if (!el) return;
  const family = settings.google_font ?? "";
  const stack = fontStack(family);
  const labelSize = Number(settings.label_font_size ?? 11);
  const optionSize = Number(settings.option_font_size ?? 14);

  el.style.setProperty("--font-sans", stack);
  el.style.setProperty("--font-display", stack);
  el.style.setProperty("--fo-label-size", `${labelSize}px`);
  el.style.setProperty("--fo-option-size", `${optionSize}px`);
  el.style.fontFamily = stack;
  if (family) {
    el.dataset.googleFont = family;
  }
}

function FilterOrbitWidget({ config, rootEl }) {
  const filters = config.filters ?? [];
  const products = config.products ?? [];
  const settings = config.settings ?? {};
  const pageLayout = settings.page_layout ?? null;
  const language = config.language ?? {};

  applyTypography(rootEl, settings);

  return (
    <div
      className="filter-orbit-font-scope"
      style={{
        fontFamily: fontStack(settings.google_font ?? ""),
        ["--font-sans"]: fontStack(settings.google_font ?? ""),
        ["--font-display"]: fontStack(settings.google_font ?? ""),
        ["--fo-label-size"]: `${Number(settings.label_font_size ?? 11)}px`,
        ["--fo-option-size"]: `${Number(settings.option_font_size ?? 14)}px`,
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
  const family = settings.google_font || "";
  if (family) {
    const id = "filter-orbit-runtime-google-font";
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`;
  }

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
