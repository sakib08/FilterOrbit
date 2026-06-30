import { useCallback, useEffect, useState } from "react";
import { api, adminConfig } from "../api";
import { Field, Toggle, inputClass, Checkbox } from "../components/FormFields";
import AdminToast from "../components/AdminToast";

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models and text-embedding-3 for chat and vector search.",
    color: "fo-from-emerald-500 fo-to-teal-600",
    chatModels: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    embedModels: ["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Gemini Flash/Pro models and embedding APIs for RAG.",
    color: "fo-from-blue-500 fo-to-indigo-600",
    chatModels: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    embedModels: ["text-embedding-004", "embedding-001"],
  },
];

const INDEX_FIELDS = [
  { id: "title", label: "Product title" },
  { id: "description", label: "Short description" },
  { id: "long_description", label: "Full description" },
  { id: "category", label: "Categories" },
  { id: "tags", label: "Tags" },
  { id: "attributes", label: "Attributes" },
  { id: "sku", label: "SKU" },
];

function ProviderCard({ provider, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(provider.id)}
      className={`fo-w-full fo-rounded-2xl fo-border fo-p-5 fo-text-left fo-transition ${
        selected
          ? "fo-border-brand-400 fo-bg-brand-50 fo-ring-2 fo-ring-brand-200"
          : "fo-border-slate-200 fo-bg-white hover:fo-border-slate-300"
      }`}
    >
      <div className="fo-flex fo-items-start fo-gap-4">
        <span
          className={`fo-flex fo-h-12 fo-w-12 fo-shrink-0 fo-items-center fo-justify-center fo-rounded-xl fo-bg-gradient-to-br ${provider.color} fo-text-sm fo-font-bold fo-text-white`}
        >
          {provider.id === "openai" ? "AI" : "G"}
        </span>
        <div className="fo-min-w-0 fo-flex-1">
          <div className="fo-flex fo-items-center fo-gap-2">
            <span className="fo-text-base fo-font-bold fo-text-slate-900">{provider.name}</span>
            {selected && (
              <span className="fo-rounded-full fo-bg-brand-600 fo-px-2 fo-py-0.5 fo-text-[10px] fo-font-bold fo-uppercase fo-text-white">
                Active
              </span>
            )}
          </div>
          <p className="fo-mt-1 fo-text-sm fo-text-slate-500">{provider.description}</p>
        </div>
        <span
          className={`fo-mt-1 fo-h-5 fo-w-5 fo-shrink-0 fo-rounded-full fo-border-2 ${
            selected ? "fo-border-brand-600 fo-bg-brand-600" : "fo-border-slate-300"
          }`}
        >
          {selected && (
            <span className="fo-flex fo-h-full fo-w-full fo-items-center fo-justify-center fo-text-[10px] fo-text-white">
              ✓
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

export default function AISettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    api
      .getAiSettings()
      .then(setSettings)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const update = useCallback((path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cursor[keys[i]] = cursor[keys[i]] ?? {};
        cursor = cursor[keys[i]];
      }
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const toggleIndexField = (fieldId) => {
    const current = settings?.rag?.index_fields ?? [];
    const next = current.includes(fieldId)
      ? current.filter((f) => f !== fieldId)
      : [...current, fieldId];
    update("rag.index_fields", next);
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await api.saveAiSettings(settings);
      setSettings(res.settings ?? settings);
      showToast(adminConfig.i18n?.saved || "Saved successfully.");
    } catch (err) {
      showToast(err.message || adminConfig.i18n?.saveError, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="fo-flex fo-h-64 fo-items-center fo-justify-center">
        <span className="fo-h-8 fo-w-8 fo-animate-spin fo-rounded-full fo-border-2 fo-border-brand-200 fo-border-t-brand-600" />
      </div>
    );
  }

  const activeProvider = PROVIDERS.find((p) => p.id === settings.provider) ?? PROVIDERS[0];
  const providerConfig = settings[settings.provider] ?? {};

  return (
    <>
      <div className="fo-mb-4 fo-flex fo-items-center fo-justify-between">
        <div>
          <h2 className="fo-text-xl fo-font-bold fo-text-slate-900">AI Settings</h2>
          <p className="fo-mt-1 fo-text-sm fo-text-slate-500">
            Configure AI providers, models, and RAG (Retrieval-Augmented Generation) for smart filtering.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="fo-rounded-xl fo-bg-brand-600 fo-px-5 fo-py-2.5 fo-text-sm fo-font-semibold fo-text-white hover:fo-bg-brand-700 disabled:fo-opacity-50"
        >
          {saving ? "Saving…" : "Save AI Settings"}
        </button>
      </div>

      {/* Provider selection */}
      <section className="fo-mb-6 fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm">
        <h3 className="fo-mb-1 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
          AI Provider
        </h3>
        <p className="fo-mb-4 fo-text-sm fo-text-slate-500">
          Choose which provider powers natural language filters and RAG embeddings.
        </p>
        <div className="fo-grid fo-gap-4 md:fo-grid-cols-2">
          {PROVIDERS.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              selected={settings.provider === provider.id}
              onSelect={(id) => update("provider", id)}
            />
          ))}
        </div>
      </section>

      <div className="fo-grid fo-gap-6 lg:fo-grid-cols-2">
        {/* Active provider credentials */}
        <section className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm">
          <h3 className="fo-mb-4 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
            {activeProvider.name} Configuration
          </h3>
          <div className="fo-space-y-4">
            <Field
              label="API Key"
              description={
                providerConfig.has_api_key
                  ? "A key is saved. Enter a new value to replace it."
                  : "Your API key is stored securely in WordPress."
              }
            >
              <input
                type="password"
                value={providerConfig.api_key || ""}
                onChange={(e) => update(`${settings.provider}.api_key`, e.target.value)}
                placeholder={providerConfig.has_api_key ? "••••••••••••••••" : "Enter API key"}
                className={inputClass}
                autoComplete="off"
              />
            </Field>

            {settings.provider === "openai" && (
              <Field label="Organization ID" description="Optional OpenAI organization ID.">
                <input
                  type="text"
                  value={providerConfig.organization_id || ""}
                  onChange={(e) => update("openai.organization_id", e.target.value)}
                  placeholder="org-..."
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Chat / Completion Model">
              <select
                value={providerConfig.chat_model || ""}
                onChange={(e) => update(`${settings.provider}.chat_model`, e.target.value)}
                className={inputClass}
              >
                {activeProvider.chatModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>

            <Field label="Embedding Model" description="Used for RAG vector search over products.">
              <select
                value={providerConfig.embedding_model || ""}
                onChange={(e) => update(`${settings.provider}.embedding_model`, e.target.value)}
                className={inputClass}
              >
                {activeProvider.embedModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* NL Filter */}
        <section className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm">
          <h3 className="fo-mb-4 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
            Natural Language Filter
          </h3>
          <div className="fo-space-y-4">
            <Toggle
              label="Enable NL filter"
              description="Parse shopper queries like “cordless tools under $200” into filter state."
              checked={!!settings.nl_filter?.enabled}
              onChange={(v) => update("nl_filter.enabled", v)}
            />
            <Field
              label="System prompt"
              description="Optional custom instructions for the AI when parsing filter queries."
            >
              <textarea
                rows={5}
                value={settings.nl_filter?.system_prompt || ""}
                onChange={(e) => update("nl_filter.system_prompt", e.target.value)}
                placeholder="You are a WooCommerce filter assistant. Convert user queries into structured filter JSON..."
                className={`${inputClass} fo-resize-y`}
              />
            </Field>
          </div>
        </section>

        {/* RAG Settings */}
        <section className="fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-p-6 fo-shadow-sm lg:fo-col-span-2">
          <h3 className="fo-mb-1 fo-text-sm fo-font-bold fo-uppercase fo-tracking-wide fo-text-slate-400">
            RAG Settings
          </h3>
          <p className="fo-mb-4 fo-text-sm fo-text-slate-500">
            Retrieval-Augmented Generation indexes your product catalog as embeddings so AI filters can match by meaning, not just keywords.
          </p>

          <div className="fo-grid fo-gap-6 lg:fo-grid-cols-2">
            <div className="fo-space-y-4">
              <Toggle
                label="Enable RAG"
                description="Use vector search to retrieve relevant products before AI responds."
                checked={!!settings.rag?.enabled}
                onChange={(v) => update("rag.enabled", v)}
              />
              <Toggle
                label="Auto-index products"
                description="Rebuild embeddings when products are created or updated."
                checked={!!settings.rag?.auto_index_products}
                onChange={(v) => update("rag.auto_index_products", v)}
              />

              <div className="fo-grid fo-grid-cols-2 fo-gap-3">
                <Field label="Chunk size (tokens)">
                  <input
                    type="number"
                    min={128}
                    max={8192}
                    value={settings.rag?.chunk_size ?? 512}
                    onChange={(e) => update("rag.chunk_size", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Chunk overlap (tokens)">
                  <input
                    type="number"
                    min={0}
                    max={1024}
                    value={settings.rag?.chunk_overlap ?? 50}
                    onChange={(e) => update("rag.chunk_overlap", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="fo-grid fo-grid-cols-2 fo-gap-3">
                <Field label="Top K results" description="Number of chunks retrieved per query.">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.rag?.top_k ?? 5}
                    onChange={(e) => update("rag.top_k", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Similarity threshold" description="Minimum score (0–1) to include a chunk.">
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.rag?.similarity_threshold ?? 0.7}
                    onChange={(e) => update("rag.similarity_threshold", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Max context tokens" description="Maximum tokens sent to the chat model from retrieved chunks.">
                <input
                  type="number"
                  min={500}
                  max={128000}
                  value={settings.rag?.context_max_tokens ?? 2000}
                  onChange={(e) => update("rag.context_max_tokens", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>

            <div>
              <p className="fo-mb-3 fo-text-sm fo-font-semibold fo-text-slate-800">Index fields</p>
              <p className="fo-mb-3 fo-text-xs fo-text-slate-500">
                Select which product data is chunked and embedded for retrieval.
              </p>
              <div className="fo-grid fo-gap-2 sm:fo-grid-cols-2">
                {INDEX_FIELDS.map((field) => {
                  const checked = (settings.rag?.index_fields ?? []).includes(field.id);
                  return (
                    <label
                      key={field.id}
                      className={`fo-flex fo-cursor-pointer fo-items-center fo-gap-2 fo-rounded-lg fo-border fo-px-3 fo-py-2 fo-text-sm fo-transition ${
                        checked
                          ? "fo-border-brand-300 fo-bg-brand-50 fo-text-brand-800"
                          : "fo-border-slate-200 fo-bg-slate-50 fo-text-slate-600"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleIndexField(field.id)}
                      />
                      {field.label}
                    </label>
                  );
                })}
              </div>

              <div className="fo-mt-4 fo-rounded-xl fo-bg-slate-50 fo-p-4">
                <p className="fo-text-xs fo-font-semibold fo-text-slate-600">Index status</p>
                <p className="fo-mt-1 fo-text-sm fo-text-slate-800">
                  {settings.rag?.indexed_products ?? 0} products indexed
                  {settings.rag?.last_indexed_at && (
                    <span className="fo-block fo-text-xs fo-text-slate-400 fo-mt-0.5">
                      Last indexed: {settings.rag.last_indexed_at}
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  disabled
                  title="Product indexing will be available in a future update"
                  className="fo-mt-3 fo-rounded-lg fo-border fo-border-slate-200 fo-bg-white fo-px-4 fo-py-2 fo-text-xs fo-font-semibold fo-text-slate-400 fo-cursor-not-allowed"
                >
                  Rebuild index (coming soon)
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AdminToast message={toast?.message} type={toast?.type} />
    </>
  );
}
