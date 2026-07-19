import { useState } from "react";
import { useLanguage } from "../language/LanguageContext";
import { HeartIcon, StarRating } from "./icons";

const GRID_COL_CLASS = {
  1: "ppros_ecom_filter-grid-cols-1",
  2: "ppros_ecom_filter-grid-cols-2",
  3: "ppros_ecom_filter-grid-cols-3",
  4: "ppros_ecom_filter-grid-cols-4",
  5: "ppros_ecom_filter-grid-cols-2 md:ppros_ecom_filter-grid-cols-5",
  6: "ppros_ecom_filter-grid-cols-2 md:ppros_ecom_filter-grid-cols-3 lg:ppros_ecom_filter-grid-cols-6",
};

function formatCurrency(amount, currency) {
  if (!currency) return Number(amount).toFixed(2);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

function getBrandName(product) {
  const { brand } = product;
  if (!brand) return null;
  if (Array.isArray(brand)) return brand[0] || null;
  return String(brand);
}

function getReviewCount(product) {
  if (product.reviewCount != null) return Number(product.reviewCount);
  if (product.rating && product.rating > 0) return Math.max(1, Math.round(product.rating * 12));
  return 0;
}

function isOnSale(product) {
  if (product.onSale != null) return Boolean(product.onSale);
  const regular = product.regularPrice ?? product.originalPrice;
  return regular != null && Number(regular) > Number(product.price);
}

function isInStock(product) {
  if (product.inStock != null) return Boolean(product.inStock);
  if (product.stockStatus) return product.stockStatus === "instock";
  return true;
}

function isNewProduct(product) {
  if (product.isNew != null) return Boolean(product.isNew);
  if (product.tags && Array.isArray(product.tags)) {
    return product.tags.some((t) => String(t).toLowerCase() === "new");
  }
  return false;
}

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const brand = getBrandName(product);
  const rating = product.rating ?? 0;
  const reviewCount = getReviewCount(product);
  const onSale = isOnSale(product);
  const inStock = isInStock(product);
  const isNew = isNewProduct(product);
  const regularPrice = product.regularPrice ?? product.originalPrice;
  const showSalePrice = onSale && regularPrice != null && Number(regularPrice) > Number(product.price);

  return (
    <article className="ppros_ecom_filter-product-card">
      <div className="ppros_ecom_filter-product-card-media">
        <div className="ppros_ecom_filter-product-card-media-inner">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} loading="lazy" />
          ) : (
            <div className="ppros_ecom_filter-product-card-placeholder">📦</div>
          )}
        </div>

        {isNew && (
          <span className="ppros_ecom_filter-product-badge ppros_ecom_filter-product-badge-new">
            New
          </span>
        )}
        {onSale && !isNew && (
          <span className="ppros_ecom_filter-product-badge ppros_ecom_filter-product-badge-sale">
            Sale
          </span>
        )}
        {onSale && isNew && (
          <span
            className="ppros_ecom_filter-product-badge ppros_ecom_filter-product-badge-sale"
            style={{ top: "2rem" }}
          >
            Sale
          </span>
        )}

        <button
          type="button"
          className={[
            "ppros_ecom_filter-product-wishlist",
            wishlisted ? "ppros_ecom_filter-product-wishlist-active" : "",
          ].join(" ")}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((v) => !v)}
        >
          <HeartIcon filled={wishlisted} size={16} />
        </button>

        {!inStock && (
          <div className="ppros_ecom_filter-product-oos-overlay">
            <span className="ppros_ecom_filter-product-oos-text">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="ppros_ecom_filter-product-card-body">
        {brand && <p className="ppros_ecom_filter-product-brand">{brand}</p>}
        <h3 className="ppros_ecom_filter-product-name ppros_ecom_filter-line-clamp-2">
          {product.title}
        </h3>

        {rating > 0 && (
          <div className="ppros_ecom_filter-product-rating">
            <StarRating rating={rating} size={12} />
            {reviewCount > 0 && (
              <span className="ppros_ecom_filter-product-review-count">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        <div className="ppros_ecom_filter-product-price-row">
          <span className="ppros_ecom_filter-product-price">
            {formatCurrency(product.price, product.currency)}
          </span>
          {showSalePrice && (
            <span className="ppros_ecom_filter-product-price-original">
              {formatCurrency(regularPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, columns = 3 }) {
  const lang = useLanguage();
  const colClass = GRID_COL_CLASS[columns] ?? GRID_COL_CLASS[3];

  if (!products.length) {
    return (
      <div className="ppros_ecom_filter-rounded-2xl ppros_ecom_filter-border ppros_ecom_filter-border-dashed ppros_ecom_filter-border-violet-200 ppros_ecom_filter-bg-white ppros_ecom_filter-p-8 ppros_ecom_filter-text-center ppros_ecom_filter-shadow-card">
        <p className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-medium ppros_ecom_filter-text-slate-600">
          {lang.no_products}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`ppros_ecom_filter-grid ppros_ecom_filter-gap-5 ppros_ecom_filter-w-full ${colClass}`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
