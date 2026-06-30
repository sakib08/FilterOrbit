const config = window.filterOrbitAdmin ?? {
  apiUrl: "/wp-json/filter-orbit/v1/",
  nonce: "",
};

async function request(path, options = {}) {
  const res = await fetch(`${config.apiUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": config.nonce,
    },
    credentials: "same-origin",
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  getFilters: () => request("filters"),
  saveFilters: (filters) =>
    request("filters", { method: "POST", body: JSON.stringify(filters) }),
  getSettings: () => request("settings"),
  saveSettings: (settings) =>
    request("settings", { method: "POST", body: JSON.stringify(settings) }),
  getAiSettings: () => request("ai-settings"),
  saveAiSettings: (settings) =>
    request("ai-settings", { method: "POST", body: JSON.stringify(settings) }),
  getLanguageSettings: () => request("language-settings"),
  saveLanguageSettings: (strings) =>
    request("language-settings", { method: "POST", body: JSON.stringify(strings) }),
  getWooSources: () => request("woocommerce/sources"),
  getPreviewProducts: () => request("preview-products"),
};

export const adminConfig = config;
