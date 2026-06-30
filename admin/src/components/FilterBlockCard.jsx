import { FILTER_TYPE_META } from "../utils/pageLayoutHelpers";
import { getBlockColorTheme, getDefaultFilterColor } from "../../../src/lib/utils/blockColors.js";

export default function FilterBlockCard({
  filter,
  selected,
  onSelect,
  onRemove,
  onDragStart,
  onDragEnd,
}) {
  const meta = FILTER_TYPE_META[filter.type] ?? FILTER_TYPE_META.checkbox;
  const colorTheme = getBlockColorTheme(
    filter.color,
    getDefaultFilterColor(filter.type)
  );

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/filter-orbit-block", filter.id);
        onDragStart?.(filter.id);
      }}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(filter.id);
      }}
      className={`fo-group fo-relative fo-cursor-grab fo-rounded-xl fo-border fo-p-3 fo-transition fo-active:cursor-grabbing ${
        selected
          ? "fo-border-brand-500 fo-bg-brand-50 fo-ring-2 fo-ring-brand-200 fo-shadow-md"
          : "fo-border-slate-200 fo-bg-white hover:fo-border-brand-300 hover:fo-shadow-sm"
      } ${!filter.enabled ? "fo-opacity-60" : ""}`}
    >
      <div className="fo-flex fo-items-start fo-gap-2.5">
        <span
          className="fo-mt-0.5 fo-flex fo-h-7 fo-w-7 fo-shrink-0 fo-cursor-grab fo-items-center fo-justify-center fo-rounded-lg fo-bg-slate-100 fo-text-slate-400 group-hover:fo-bg-slate-200"
          title="Drag to reorder"
          aria-hidden
        >
          ⠿
        </span>
        <div className="fo-min-w-0 fo-flex-1">
          <div className="fo-flex fo-items-center fo-gap-2">
            <span
              className="fo-inline-flex fo-h-5 fo-w-5 fo-items-center fo-justify-center fo-rounded fo-border fo-text-[10px]"
              style={{
                backgroundColor: colorTheme.background,
                borderColor: colorTheme.border,
                color: colorTheme.text,
              }}
            >
              {meta.icon}
            </span>
            <span className="fo-truncate fo-text-sm fo-font-semibold fo-text-slate-800">
              {filter.label}
            </span>
          </div>
          <p className="fo-mt-0.5 fo-truncate fo-text-xs fo-text-slate-400">
            {filter.type} · {filter.field}
            {!filter.enabled && " · disabled"}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(filter.id);
          }}
          className="fo-shrink-0 fo-rounded-lg fo-p-1 fo-text-slate-400 fo-opacity-0 fo-transition hover:fo-bg-red-50 hover:fo-text-red-600 group-hover:fo-opacity-100"
          title="Remove filter"
        >
          ×
        </button>
      </div>
    </div>
  );
}
