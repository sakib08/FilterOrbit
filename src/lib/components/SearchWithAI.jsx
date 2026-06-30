import { useEffect, useState } from "react";
import { useLanguage } from "../language/LanguageContext";
import { GradientIconBadge, SectionLabel, SparkleIcon } from "./icons";

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
              className="ppros_ecom_filter-flex ppros_ecom_filter-h-9 ppros_ecom_filter-w-9 ppros_ecom_filter-shrink-0 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full ppros_ecom_filter-bg-gray-100 ppros_ecom_filter-text-gray-500"
              aria-label="Voice input"
              title="Voice input"
            >
              <MicIcon />
            </button>
            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              className="ppros_ecom_filter-flex ppros_ecom_filter-h-9 ppros_ecom_filter-w-9 ppros_ecom_filter-shrink-0 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full ppros_ecom_filter-text-white disabled:ppros_ecom_filter-opacity-50"
              style={{ backgroundColor: buttonColor }}
              aria-label={lang.search_title}
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v4M8 22h8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.4 20.4l17.45-7.2c.8-.33.8-1.45 0-1.78L3.4 4.6c-.77-.32-1.6.41-1.4 1.2l2.05 6.72c.1.33.1.67 0 1l-2.05 6.72c-.2.79.63 1.52 1.4 1.2z" />
    </svg>
  );
}
