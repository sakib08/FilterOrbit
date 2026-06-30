import { useRef, useState } from "react";
import { useLanguage } from "../language/LanguageContext";
import { GradientIconBadge, SectionLabel } from "./icons";
import { getButtonColorTheme } from "../utils/blockColors";

export function VisualDiscoveryUpload({
  onImageSelect,
  buttonColor = "#14b8a6",
  accentColor = "#14b8a6",
}) {
  const lang = useLanguage();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const buttonTheme = getButtonColorTheme(buttonColor);

  const handleFile = (file) => {
    onImageSelect?.(file);
  };

  return (
    <section>
      <SectionLabel
        colorClass=""
        style={{ color: accentColor }}
        icon={
          <svg className="ppros_ecom_filter-w-3.5 ppros_ecom_filter-h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 4C7 4 3 7.5 3 12s4 8 9 8 9-3.5 9-8-4-8-9-8zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          </svg>
        }
      >
        {lang.visual_section_label}
      </SectionLabel>

      <div className="ppros_ecom_filter-panel">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-gap-3 ppros_ecom_filter-mb-4">
          <GradientIconBadge style={{ background: buttonColor }}>
            <EyeIcon />
          </GradientIconBadge>
          <div>
            <h3 className="ppros_ecom_filter-text-base ppros_ecom_filter-font-bold">{lang.visual_title}</h3>
            <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-text-slate-500">
              {lang.visual_description}
            </p>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={[
            "ppros_ecom_filter-flex ppros_ecom_filter-flex-col ppros_ecom_filter-items-center ppros_ecom_filter-rounded-2xl",
            "ppros_ecom_filter-border-2 ppros_ecom_filter-border-dashed ppros_ecom_filter-px-6 ppros_ecom_filter-py-10 ppros_ecom_filter-text-center ppros_ecom_filter-transition-colors",
          ].join(" ")}
          style={{
            borderColor: dragOver ? buttonColor : buttonTheme.border,
            backgroundColor: dragOver ? buttonTheme.background : `${buttonTheme.background}66`,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="ppros_ecom_filter-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <span
            className="ppros_ecom_filter-mb-3 ppros_ecom_filter-flex ppros_ecom_filter-h-12 ppros_ecom_filter-w-12 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full"
            style={{ backgroundColor: buttonTheme.background, color: buttonTheme.text }}
          >
            <UploadIcon />
          </span>
          <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-bold ppros_ecom_filter-text-indigo-900">
            {lang.visual_drop_text}
          </p>
          <p className="ppros_ecom_filter-mt-1 ppros_ecom_filter-text-xs ppros_ecom_filter-text-slate-500">
            {lang.visual_file_types}
          </p>
          <div className="ppros_ecom_filter-mt-5 ppros_ecom_filter-flex ppros_ecom_filter-gap-3">
            <button
              type="button"
              className="ppros_ecom_filter-rounded-full ppros_ecom_filter-border ppros_ecom_filter-px-4 ppros_ecom_filter-py-2 ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium"
              style={{
                borderColor: buttonTheme.border,
                backgroundColor: buttonTheme.background,
                color: buttonTheme.text,
              }}
            >
              📷 {lang.visual_camera_button}
            </button>
            <button
              type="button"
              className="ppros_ecom_filter-rounded-full ppros_ecom_filter-border ppros_ecom_filter-px-4 ppros_ecom_filter-py-2 ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium"
              style={{ borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}14` }}
            >
              🔍 {lang.visual_url_button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 20h16" />
    </svg>
  );
}
