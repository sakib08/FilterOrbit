export function SparkleIcon({ className = "ppros_ecom_filter-w-4 ppros_ecom_filter-h-4", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {/* 4-point star sparkle */}
      <path d="M12 3.5c-.3 0-.5.2-.6.5L10 8.5l-4.5 1.4c-.3.1-.5.4-.5.6 0 .3.2.5.5.6l4.5 1.4 1.4 4.5c.1.3.4.5.6.5.3 0 .5-.2.6-.5l1.4-4.5 4.5-1.4c.3-.1.5-.4.5-.6 0-.3-.2-.5-.5-.6L14 8.5 12.6 4c-.1-.3-.4-.5-.6-.5z" />
      <path d="M5.5 4c-.2 0-.4.1-.5.3l-.6 2-2 .6c-.2.1-.4.3-.4.5s.2.4.4.5l2 .6.6 2c.1.2.3.3.5.3s.4-.1.5-.3l.6-2 2-.6c.2-.1.4-.3.4-.5s-.2-.4-.4-.5l-2-.6-.6-2c-.1-.2-.3-.3-.5-.3z" />
    </svg>
  );
}

export function GradientIconBadge({ children, style }) {
  const defaultStyle = {
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
  };
  return (
    <span
      className="ppros_ecom_filter-flex ppros_ecom_filter-h-11 ppros_ecom_filter-w-11 ppros_ecom_filter-shrink-0 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full ppros_ecom_filter-text-white"
      style={{ ...defaultStyle, ...style }}
    >
      {children}
    </span>
  );
}

export function LockIcon({ size = 12, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function SectionLabel({
  icon,
  children,
  colorClass = "",
  style,
}) {
  return (
    <p
      className={`ppros_ecom_filter-section-label ppros_ecom_filter-mb-2 ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-1.5 ${colorClass}`}
      style={style}
    >
      {icon}
      {children}
    </p>
  );
}

export function HeartIcon({ filled = false, size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function StarRating({ rating = 0, size = 12, max = 5 }) {
  const stars = [];
  for (let i = 1; i <= max; i += 1) {
    const filled = rating >= i;
    const partial = !filled && rating > i - 1;
    stars.push(
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        aria-hidden
        className="ppros_ecom_filter-shrink-0"
      >
        <defs>
          {partial && (
            <linearGradient id={`star-grad-${i}-${rating}`}>
              <stop offset={`${((rating - (i - 1)) * 100).toFixed(0)}%`} stopColor="#FBBF24" />
              <stop offset={`${((rating - (i - 1)) * 100).toFixed(0)}%`} stopColor="#E2E8F0" />
            </linearGradient>
          )}
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill={filled ? "#FBBF24" : partial ? `url(#star-grad-${i}-${rating})` : "#E2E8F0"}
        />
      </svg>
    );
  }
  return <span className="ppros_ecom_filter-product-stars">{stars}</span>;
}

export function ChevronDownIcon({ className = "", open = false }) {
  return (
    <svg
      className={[
        "ppros_ecom_filter-filter-section-chevron",
        open ? "ppros_ecom_filter-filter-section-chevron-open" : "",
        className,
      ].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SlidersIcon({ className = "", size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
