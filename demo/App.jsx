import { useState, useEffect, useMemo } from "react";
import {
  useZeroRequestFilter,
  RangeSliderHistogram,
  PillFilterGroup,
  VisualDiscoveryFilter,
  buildHistogram,
} from "../src/lib";
import { sampleFilters, VENDORS } from "./data/sampleProducts";
import { fetchProducts } from "./api/mockApi";
import { VendorFilter } from "../src/lib/components/VendorFilter";

/* ─── Tiny icon components ──────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
  </svg>
);
const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2zM5 17l.8 2.7 2.7.8-2.7.8L5 24l-.8-2.7L1.5 20.5l2.7-.8L5 17z" />
  </svg>
);
const MicIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 11a7 7 0 0 1-14 0M12 18v4M8 22h8" />
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3.4 20.4 20.85 13.2c.8-.33.8-1.45 0-1.78L3.4 4.6c-.77-.32-1.6.41-1.4 1.2l2.05 6.72c.1.33.1.67 0 1L2 20.4c-.2.79.63 1.52 1.4 1.2z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M3 6h18M7 12h10M11 18h2" />
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

/* ─── ProductCard ───────────────────────────────────────────────────────── */
function ProductCard({ p, layout }) {
  const img = p.imageUrl;
  const stars = Math.min(5, Math.max(0, Math.round(Number(p.rating ?? 4))));

  const categoryColor = {
    "power tools": "bg-blue-100 text-blue-700",
    gardening:     "bg-green-100 text-green-700",
    watches:       "bg-amber-100 text-amber-700",
    furniture:     "bg-orange-100 text-orange-700",
  };
  const catClass = categoryColor[String(p.category)] ?? "bg-gray-100 text-gray-600";

  if (layout === "list") {
    return (
      <article className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 to-indigo-100">
          {img
            ? <img src={img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
            : <div className="flex h-full w-full items-center justify-center text-2xl">📦</div>}
        </div>
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${catClass}`}>{String(p.category)}</span>
            <h3 className="mt-0.5 text-sm font-semibold text-slate-800 truncate">{p.title}</h3>
            <p className="text-xs text-slate-400">
              {String(p.brand ?? "")}
              {p.vendor && (() => {
                const vKey = String(p.vendor);
                const vm = VENDORS[vKey];
                return vm ? (
                  <span className="ml-2 font-medium" style={{ color: vm.color }}>
                    · {vm.emoji} {vKey}
                  </span>
                ) : null;
              })()}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 shrink-0">
            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
            <span className="text-slate-400 ml-1">{Number(p.rating ?? 4).toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg font-bold text-violet-600">${p.price}</span>
            <button className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-700 transition-colors">
              Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-100">
        {img
          ? <img src={img} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          : <div className="flex h-full w-full items-center justify-center text-5xl">📦</div>}
        <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${catClass}`}>
          {String(p.category ?? "")}
        </span>
        {(() => {
          const vKey = p.vendor ? String(p.vendor) : null;
          const vm = vKey ? VENDORS[vKey] : null;
          return vm && vKey ? (
            <span
              className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm"
              style={{ background: vm.bg, color: vm.color }}
            >
              {vm.emoji} {vKey}
            </span>
          ) : null;
        })()}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-violet-400">{String(p.brand ?? "")}</p>
        <h3 className="mt-0.5 flex-1 text-sm font-semibold leading-snug text-slate-800 line-clamp-2">{p.title}</h3>
        {p.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">{p.description}</p>
        )}
        <div className="mt-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < stars ? "text-amber-400" : "text-gray-200"}`}>★</span>
          ))}
          <span className="ml-1.5 text-xs text-slate-400">{Number(p.rating ?? 4).toFixed(1)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-violet-600">${p.price}</span>
          <button className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-700 active:scale-95 transition-all">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── SkeletonCard ──────────────────────────────────────────────────────── */
function SkeletonCard({ layout }) {
  if (layout === "list") {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-3 animate-pulse">
        <div className="h-20 w-24 shrink-0 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/4 rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
          <div className="h-3 w-1/3 rounded bg-gray-100" />
        </div>
        <div className="h-8 w-20 rounded-xl bg-gray-100 shrink-0" />
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-1/4 rounded bg-gray-100" />
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="mt-4 flex justify-between gap-2">
          <div className="h-6 w-14 rounded bg-gray-100" />
          <div className="h-8 w-24 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

/* ─── FilterSection ─────────────────────────────────────────────────────── */
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700"
      >
        {title}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────────── */
export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [layout, setLayout] = useState("grid");

  /* ── Fetch products on mount ── */
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setAllProducts(list);
      })
      .catch((err) => {
        console.error(err);
        setAllProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Zero-request filter engine ── */
  const engine = useZeroRequestFilter({
    products: allProducts,
    filters: sampleFilters,
    hideIrrelevantFilters: false,
  });

  const {
    filterState,
    textQuery,
    setTextQuery,
    result,
    toggleFilter,
    setRangeFilter,
    clearFilters,
    applyNaturalLanguage,
    aiLoading,
    priceMin,
    priceMax,
    histogram: priceHistogram,
  } = engine;

  /* ── Extra histograms for rating & weight ── */
  const ratingHistogram = useMemo(
    () => buildHistogram(allProducts, "rating", 1, 5, 24),
    [allProducts]
  );
  const weightHistogram = useMemo(
    () => buildHistogram(allProducts, "weight", 0, 5000, 24),
    [allProducts]
  );

  /* ── Sorted products ── */
  const sortedProducts = useMemo(() => {
    const arr = [...result.products];
    if (sortBy === "price-asc")  arr.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") arr.sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     arr.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    return arr;
  }, [result.products, sortBy]);

  /* ── Active filter count ── */
  const activeCount = Object.values(filterState)
    .flat()
    .filter(v => v !== undefined).length;

  /* ── Range values (guarded) ── */
  const priceRange  = filterState.price  ?? [priceMin, priceMax];
  const ratingRange = filterState.rating ?? [1, 5];
  const weightRange = filterState.weight ?? [0, 5000];

  /* ── AI submit ── */
  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    applyNaturalLanguage(aiQuery.trim());
    setAiOpen(false);
  };

  /* ── Derived filter groups ── */
  const pillFilters = sampleFilters.filter(
    f => f.options && f.type !== "visual" && f.type !== "range"
  );
  const visualFilters = sampleFilters.filter(f => f.type === "visual");
  const vendorFilterDef = sampleFilters.find(f => f.id === "vendor");

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="demo-root flex h-screen flex-col overflow-hidden bg-[#f5f3ff] font-sans text-slate-900">

      {/* ══════════ HEADER ══════════ */}
      <header className="z-30 shrink-0 border-b border-gray-200 bg-white shadow-sm">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-5 py-3">

          {/* Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Toggle filters sidebar"
            >
              <MenuIcon />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                <GridIcon />
              </span>
              <span className="hidden text-base font-bold text-slate-900 sm:block tracking-tight">
                FilterOS
              </span>
            </div>
          </div>

          {/* Search + AI button */}
          <div className="flex flex-1 items-center gap-2.5 min-w-0">
            <div className="relative flex-1 max-w-2xl">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={textQuery}
                onChange={e => setTextQuery(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <button
              onClick={() => setAiOpen(o => !o)}
              aria-expanded={aiOpen}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                aiOpen
                  ? "bg-violet-600 text-white ring-2 ring-violet-200 shadow-lg"
                  : "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md hover:opacity-90"
              }`}
            >
              <SparkleIcon />
              <span className="hidden sm:inline">AI Filter</span>
            </button>
          </div>

          {/* Clear badge */}
          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
            >
              {activeCount} filters active
              <CloseIcon />
            </button>
          )}
        </div>

        {/* AI Panel — slides in below the search bar */}
        {aiOpen && (
          <div className="border-t border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-violet-50 px-5 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md">
                  <SparkleIcon size={18} />
                </span>
                <div>
                  <p className="font-bold text-slate-900">AI Natural Language Filter</p>
                  <p className="text-xs text-slate-500">Describe what you&apos;re looking for in plain English</p>
                </div>
              </div>
              <form
                onSubmit={handleAiSubmit}
                className="flex items-center gap-2 rounded-full border border-violet-200 bg-white py-2 pl-4 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-violet-200"
              >
                <span className="text-violet-400 shrink-0"><SparkleIcon /></span>
                <input
                  autoFocus
                  type="text"
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  placeholder="e.g. Show me cordless power tools under $200…"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  disabled={aiLoading}
                />
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  title="Voice input"
                >
                  <MicIcon />
                </button>
                <button
                  type="submit"
                  disabled={aiLoading || !aiQuery.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm disabled:opacity-40"
                >
                  {aiLoading
                    ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <SendIcon />}
                </button>
              </form>
              <p className="mt-2 text-xs text-slate-400">
                Try: &nbsp;
                {["cordless tools under $200", "modern wooden furniture", "watches between $200 and $400"].map(hint => (
                  <button
                    key={hint}
                    type="button"
                    className="mr-2 rounded-full border border-violet-200 bg-white px-2 py-0.5 text-violet-600 hover:bg-violet-50 transition-colors"
                    onClick={() => { setAiQuery(hint); }}
                  >
                    {hint}
                  </button>
                ))}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* ══════════ BODY (Sidebar + Main) ══════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══════════ LEFT SIDEBAR ══════════ */}
        <aside
          className={`shrink-0 overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-0 overflow-hidden border-0"
          }`}
          aria-label="Filters sidebar"
        >
          {/* Sidebar header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Filters</span>
              {activeCount > 0 && (
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-violet-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* ── Price Range ── */}
          <FilterSection title="Price Range">
            <RangeSliderHistogram
              label=""
              unit="USD"
              min={priceMin}
              max={priceMax}
              value={[Number(priceRange[0]), Number(priceRange[1])]}
              histogram={priceHistogram}
              step={5}
              accent="violet"
              formatValue={n => `$${n}`}
              onChange={(lo, hi) => setRangeFilter("price", lo, hi)}
            />
          </FilterSection>

          {/* ── Customer Rating ── */}
          <FilterSection title="Customer Rating">
            <RangeSliderHistogram
              label=""
              unit="STARS"
              min={1}
              max={5}
              value={[Number(ratingRange[0]), Number(ratingRange[1])]}
              histogram={ratingHistogram}
              step={0.5}
              accent="violet"
              formatValue={n => `${n}★`}
              onChange={(lo, hi) => setRangeFilter("rating", lo, hi)}
            />
          </FilterSection>

          {/* ── Weight ── */}
          <FilterSection title="Weight">
            <RangeSliderHistogram
              label=""
              unit="GRAMS"
              min={0}
              max={5000}
              value={[Number(weightRange[0]), Number(weightRange[1])]}
              histogram={weightHistogram}
              step={50}
              accent="teal"
              formatValue={n => `${n}g`}
              onChange={(lo, hi) => setRangeFilter("weight", lo, hi)}
            />
          </FilterSection>

          {/* ── Vendors ── */}
          {vendorFilterDef && (
            <FilterSection title="Vendors">
              <VendorFilter
                options={vendorFilterDef.options ?? []}
                selectedVendors={filterState.vendor ?? []}
                allProducts={allProducts}
                vendors={VENDORS}
                onToggle={(v) => toggleFilter("vendor", v)}
              />
            </FilterSection>
          )}

          {/* ── Other pill filters (Brand, Category, Power Source) ── */}
          {pillFilters
            .filter(def => def.id !== "vendor")
            .map(def => (
              <FilterSection key={def.id} title={def.label}>
                <PillFilterGroup
                  label=""
                  filterId={def.id}
                  options={def.options ?? []}
                  selected={filterState[def.id] ?? []}
                  onToggle={v => toggleFilter(def.id, v)}
                />
              </FilterSection>
            ))}

          {/* ── Visual filters (Color, Style) ── */}
          {visualFilters.map(def => (
            <FilterSection key={def.id} title={def.label}>
              <VisualDiscoveryFilter
                label=""
                options={def.visualOptions ?? []}
                selected={filterState[def.id] ?? []}
                onToggle={id => toggleFilter(def.id, id)}
              />
            </FilterSection>
          ))}

          <div className="h-6" />
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="flex flex-1 flex-col overflow-y-auto">

          {/* Toolbar */}
          <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">{loading ? "…" : result.total}</span>
              {" "}products{activeCount > 0 && <span className="text-violet-600"> · {activeCount} filters active</span>}
            </p>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm">
                <SortIcon />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border-0 bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              {/* Layout toggle */}
              <div className="flex rounded-full border border-gray-200 bg-white overflow-hidden">
                {["grid", "list"].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLayout(v)}
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      layout === v
                        ? "bg-violet-600 text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-pressed={layout === v}
                    aria-label={`${v} view`}
                  >
                    {v === "grid" ? <GridIcon /> : <ListIcon />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid / list */}
          <div className="flex-1 p-6">
            {loading ? (
              <div className={layout === "grid"
                ? "grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
              }>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} layout={layout} />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={layout === "grid"
                ? "grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
              }>
                {sortedProducts.map(p => (
                  <ProductCard key={p.id} p={p} layout={layout} />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-violet-200 bg-white/60">
                <span className="text-5xl">🔍</span>
                <div className="text-center">
                  <p className="font-semibold text-slate-700">No products match</p>
                  <p className="mt-1 text-sm text-slate-400">Try the AI filter or clear some filters</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
