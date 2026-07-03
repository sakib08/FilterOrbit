import { useEffect, useState } from "react";
import { useLanguage } from "../language/LanguageContext";
import { GradientIconBadge, LockIcon, SectionLabel, SparkleIcon } from "./icons";

/* ─── Pro feature flag ───────────────────────────────────────────────────
   Set to true once a real AI API is wired up. While false the component
   renders a locked "Coming Soon" preview instead of an active input.     */
const AI_ENABLED = false;

function ProBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        padding: "2px 7px",
        borderRadius: "999px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
        color: "#fff",
        flexShrink: 0,
      }}
    >
      <LockIcon />
      PRO
    </span>
  );
}

/* Basic keyword search — used when AI_ENABLED is false */
function BasicSearch({ textQuery, onTextChange, accentColor }) {
  const lang = useLanguage();

  return (
    <div>
      <div className="ppros_ecom_filter-ai-input">
        <svg
          className="ppros_ecom_filter-w-4 ppros_ecom_filter-h-4 ppros_ecom_filter-shrink-0"
          style={{ color: accentColor }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="ppros_ecom_filter-min-w-0 ppros_ecom_filter-flex-1 ppros_ecom_filter-border-0 ppros_ecom_filter-bg-transparent ppros_ecom_filter-text-sm focus:ppros_ecom_filter-outline-none"
          placeholder={lang.search_placeholder ?? "Search products…"}
          value={textQuery}
          onChange={(e) => onTextChange(e.target.value)}
          aria-label="Search products"
        />
        {textQuery && (
          <button
            type="button"
            className="ppros_ecom_filter-ai-btn-mic"
            aria-label="Clear search"
            onClick={() => onTextChange("")}
            style={{ color: "#94a3b8" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
}

export function SearchWithAI({
  textQuery,
  onTextChange,
  onAISubmit,
  aiLoading = false,
  aiPlaceholder,
  buttonColor = "#8b5cf6",
  accentColor = "#8b5cf6",
}) {
  const lang = useLanguage();
  const [aiQuery, setAiQuery] = useState(textQuery);
  const placeholder = aiPlaceholder ?? lang.search_placeholder;

  useEffect(() => {
    setAiQuery(textQuery);
  }, [textQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    onAISubmit(aiQuery.trim());
    onTextChange(aiQuery.trim());
  };

  /* ── Free tier: show working basic search + Pro teaser ── */
  if (!AI_ENABLED) {
    return (
      <section>
        <SectionLabel
          icon={
            <svg className="ppros_ecom_filter-w-3.5 ppros_ecom_filter-h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          colorClass=""
          style={{ color: accentColor }}
        >
          {lang.search_section_label ?? "Search"}
        </SectionLabel>
        <div className="ppros_ecom_filter-panel">
          <BasicSearch textQuery={textQuery} onTextChange={onTextChange} accentColor={accentColor} />
        </div>
      </section>
    );
  }

  /* ── Pro / AI-enabled tier ── */
  return (
    <section>
      <SectionLabel
        icon={<SparkleIcon className="ppros_ecom_filter-w-3.5 ppros_ecom_filter-h-3.5" />}
        colorClass=""
        style={{ color: accentColor }}
      >
        {lang.search_section_label}
      </SectionLabel>

      <div className="ppros_ecom_filter-panel">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3 ppros_ecom_filter-mb-4">
          <GradientIconBadge style={{ background: buttonColor }}>
            <SparkleIcon className="ppros_ecom_filter-w-5 ppros_ecom_filter-h-5" />
          </GradientIconBadge>
          <div>
            <h3 className="ppros_ecom_filter-text-base ppros_ecom_filter-font-bold ppros_ecom_filter-text-slate-800">
              {lang.search_title}
            </h3>
            <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-500">
              {lang.search_description}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ppros_ecom_filter-ai-input">
            <SparkleIcon
              className="ppros_ecom_filter-w-4 ppros_ecom_filter-h-4 ppros_ecom_filter-shrink-0"
              style={{ color: accentColor }}
            />
            <input
              type="text"
              className="ppros_ecom_filter-min-w-0 ppros_ecom_filter-flex-1 ppros_ecom_filter-border-0 ppros_ecom_filter-bg-transparent ppros_ecom_filter-text-sm focus:ppros_ecom_filter-outline-none"
              placeholder={placeholder}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              disabled={aiLoading}
              aria-label={lang.search_title}
            />
            <button
              type="button"
              className="ppros_ecom_filter-ai-btn-mic"
              aria-label="Voice input"
              title="Voice input"
            >
              <MicIcon />
            </button>
            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              className="ppros_ecom_filter-ai-btn-send"
              style={{ backgroundColor: buttonColor }}
              aria-label={lang.search_title}
            >
              {aiLoading ? <SpinnerIcon /> : <SendIcon />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function MicIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden
      style={{ animation: "ppros-spin 0.7s linear infinite" }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
