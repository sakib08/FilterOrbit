import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterOrbitLayout } from "../../src/lib";
import "./styles.css";

function FilterOrbitWidget({ config }) {
  const filters = config.filters ?? [];
  const products = config.products ?? [];
  const settings = config.settings ?? {};
  const pageLayout = settings.page_layout ?? null;
  const language = config.language ?? {};

  return (
    <FilterOrbitLayout
      pageLayout={pageLayout}
      filters={filters}
      products={products}
      settings={settings}
      language={language}
    />
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

  nodes.forEach((el) => {
    if (el.dataset.mounted === "true") {
      return;
    }
    el.dataset.mounted = "true";
    createRoot(el).render(
      <StrictMode>
        <FilterOrbitWidget config={config} />
      </StrictMode>
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}
