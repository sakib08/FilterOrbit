import { useLanguage } from "../language/LanguageContext";

const GRID_COL_CLASS = {
  1: "ppros_ecom_filter-grid-cols-1",
  2: "ppros_ecom_filter-grid-cols-2",
  3: "ppros_ecom_filter-grid-cols-3",
  4: "ppros_ecom_filter-grid-cols-4",
  5: "ppros_ecom_filter-grid-cols-2 md:ppros_ecom_filter-grid-cols-5",
  6: "ppros_ecom_filter-grid-cols-2 md:ppros_ecom_filter-grid-cols-3 lg:ppros_ecom_filter-grid-cols-6",
};

export function ProductGrid({ products, columns = 3, accentColor = "#8b5cf6" }) {
  const lang = useLanguage();
  const colClass = GRID_COL_CLASS[columns] ?? GRID_COL_CLASS[3];

  if (!products.length) {
    return (
      <div className="ppros_ecom_filter-rounded-2xl ppros_ecom_filter-border ppros_ecom_filter-border-dashed ppros_ecom_filter-border-violet-200 ppros_ecom_filter-bg-white ppros_ecom_filter-p-8 ppros_ecom_filter-text-center">
        <p className="ppros_ecom_filter-text-slate-600 ppros_ecom_filter-font-medium">
          {lang.no_products}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`ppros_ecom_filter-grid ppros_ecom_filter-gap-4 ppros_ecom_filter-w-full ${colClass}`}
    >
      {products.map((p) => (
        <article
          key={p.id}
          className="ppros_ecom_filter-rounded-xl ppros_ecom_filter-border ppros_ecom_filter-border-gray-100 ppros_ecom_filter-bg-white ppros_ecom_filter-overflow-hidden ppros_ecom_filter-shadow-sm"
        >
          <div className="ppros_ecom_filter-h-40 ppros_ecom_filter-bg-slate-100 ppros_ecom_filter-overflow-hidden">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="ppros_ecom_filter-h-full ppros_ecom_filter-w-full ppros_ecom_filter-object-cover"
                loading="lazy"
              />
            ) : (
              <div className="ppros_ecom_filter-flex ppros_ecom_filter-h-full ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-text-3xl">
                📦
              </div>
            )}
          </div>
          <div className="ppros_ecom_filter-p-3">
            {p.category && (
              <span
                className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-semibold ppros_ecom_filter-uppercase"
                style={{ color: accentColor }}
              >
                {p.category}
              </span>
            )}
            <h3 className="ppros_ecom_filter-mt-0.5 ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800 ppros_ecom_filter-line-clamp-2">
              {p.title}
            </h3>
            <p
              className="ppros_ecom_filter-mt-2 ppros_ecom_filter-text-base ppros_ecom_filter-font-bold"
              style={{ color: accentColor }}
            >
              {p.currency ? `${p.currency} ` : ""}
              {Number(p.price).toFixed(2)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
