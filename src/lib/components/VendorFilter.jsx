/**
 * VendorFilter — rich card-grid for filtering by vendor / marketplace.
 *
 * Props:
 *   options        – array of { value, label } filter options
 *   selectedVendors – array of currently-selected vendor values
 *   allProducts    – full product list (used to compute per-vendor counts)
 *   vendors        – metadata map: { [vendorName]: { color, bg, emoji } }
 *   onToggle       – (vendorValue: string) => void
 */
export function VendorFilter({
  options,
  selectedVendors,
  allProducts,
  vendors,
  onToggle,
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const meta = vendors[opt.value];
        const active = selectedVendors.includes(opt.value);
        const count = allProducts.filter((p) => p.vendor === opt.value).length;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all"
            style={
              active
                ? { borderColor: meta?.color ?? "#8b5cf6", background: meta?.bg ?? "#f5f3ff" }
                : { borderColor: "#e5e7eb", background: "#fafafa" }
            }
            aria-pressed={active}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ background: meta?.bg ?? "#f3f4f6" }}
            >
              {meta?.emoji ?? "🏪"}
            </span>

            <span className="flex-1 min-w-0">
              <span
                className="block text-sm font-semibold truncate"
                style={{ color: active ? (meta?.color ?? "#8b5cf6") : "#1e293b" }}
              >
                {opt.label}
              </span>
              <span className="text-xs text-slate-400">{count} products</span>
            </span>

            {active && (
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-[10px]"
                style={{ background: meta?.color ?? "#8b5cf6" }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
