import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./preview.css";

const rootEl = document.getElementById("filter-orbit-admin-root");

if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App page={rootEl.dataset.page || "designer"} />
    </StrictMode>
  );
}
