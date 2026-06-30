import { useEffect } from "react";
import { FilterOrbitLayout } from "../../../src/lib/components/FilterOrbitLayout";
import { balanceColumnWidths, setColumnWidth } from "../utils/pageLayoutHelpers";

export default function ColumnWidthControls({ columns, onChange }) {
  const widthTotal = columns.reduce((s, c) => s + c.width, 0);

  const handleChange = (index, value) => {
    onChange(setColumnWidth(columns, index, value));
  };

  const handleBalance = () => {
    onChange(balanceColumnWidths(columns));
  };

  return (
    <div className="fo-rounded-xl fo-border fo-border-slate-200 fo-bg-white fo-px-4 fo-py-3 fo-shadow-sm">
      <div className="fo-mb-3 fo-flex fo-flex-wrap fo-items-center fo-justify-between fo-gap-2">
        <div>
          <h3 className="fo-text-sm fo-font-bold fo-text-slate-800">Column widths</h3>
          <p className="fo-text-xs fo-text-slate-400">Applies to storefront &amp; live preview</p>
        </div>
        <div className="fo-flex fo-items-center fo-gap-2">
          <span
            className={`fo-text-xs fo-font-semibold ${widthTotal === 100 ? "fo-text-emerald-600" : "fo-text-amber-600"}`}
          >
            {widthTotal}% total
          </span>
          {widthTotal !== 100 && (
            <button
              type="button"
              onClick={handleBalance}
              className="fo-rounded-lg fo-border fo-border-slate-200 fo-bg-slate-50 fo-px-2.5 fo-py-1 fo-text-xs fo-font-medium fo-text-slate-600 hover:fo-bg-slate-100"
            >
              Scale to 100%
            </button>
          )}
        </div>
      </div>

      <div className="fo-flex fo-flex-wrap fo-items-end fo-gap-4">
        {columns.map((col, index) => (
          <label key={col.id} className="fo-block fo-min-w-[100px]">
            <span className="fo-mb-1 fo-block fo-text-[10px] fo-font-bold fo-uppercase fo-tracking-widest fo-text-slate-400">
              Column {index + 1}
            </span>
            <div className="fo-flex fo-items-center fo-gap-1">
              <input
                type="number"
                min={1}
                max={100}
                value={col.width}
                onChange={(e) => handleChange(index, e.target.value)}
                className="fo-w-16 fo-rounded-lg fo-border fo-border-slate-200 fo-px-2 fo-py-1.5 fo-text-sm fo-font-semibold focus:fo-border-brand-400 focus:fo-outline-none focus:fo-ring-2 focus:fo-ring-brand-100"
              />
              <span className="fo-text-sm fo-text-slate-500">%</span>
            </div>
          </label>
        ))}
      </div>

      <div className="fo-mt-3 fo-flex fo-h-2 fo-overflow-hidden fo-rounded-full fo-bg-slate-100">
        {columns.map((col) => {
          const share = widthTotal ? (col.width / widthTotal) * 100 : 0;
          return (
            <div
              key={col.id}
              className="fo-bg-brand-500 fo-transition-all"
              style={{ width: `${share}%` }}
              title={`${col.width}% (${share.toFixed(0)}% of row)`}
            />
          );
        })}
      </div>
    </div>
  );
}

export function LayoutPreviewModal({ open, onClose, pageLayout, filters, products, language }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fo-fixed fo-inset-0 fo-z-[100000] fo-flex fo-items-center fo-justify-center fo-bg-slate-900/60 fo-p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="fo-flex fo-h-[80vh] fo-w-[80vw] fo-max-w-[80vw] fo-flex-col fo-overflow-hidden fo-rounded-2xl fo-border fo-border-slate-200 fo-bg-white fo-shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Layout preview"
      >
        <div className="fo-flex fo-shrink-0 fo-items-center fo-justify-between fo-border-b fo-border-slate-100 fo-px-5 fo-py-4">
          <div>
            <h3 className="fo-text-base fo-font-bold fo-text-slate-900">Live Preview</h3>
            <p className="fo-mt-0.5 fo-text-xs fo-text-slate-400">
              {pageLayout.columns?.map((c) => `${c.width}%`).join(" · ")} · {products.length} products
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="fo-rounded-lg fo-border fo-border-slate-200 fo-px-3 fo-py-1.5 fo-text-sm fo-font-medium fo-text-slate-600 hover:fo-bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="fo-min-h-0 fo-flex-1 fo-overflow-y-auto fo-p-5">
          {products.length > 0 ? (
            <FilterOrbitLayout
              pageLayout={pageLayout}
              filters={filters}
              products={products}
              language={language}
              settings={{ enable_ai_filter: true, enable_personalization: true }}
              showVisualUpload={false}
            />
          ) : (
            <p className="fo-py-16 fo-text-center fo-text-sm fo-text-slate-400">
              No WooCommerce products found for preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
