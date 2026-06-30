export function SparkleIcon({ className = "ppros_ecom_filter-w-4 ppros_ecom_filter-h-4", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 4.2L17.4 8l-4.2 1.2L12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2zm-7 14l.6 2.1 2.1.6-2.1.6L5 21.4l-.6-2.1-2.1-.6 2.1-.6L5 16z" />
    </svg>
  );
}

export function GradientIconBadge({
  children,
  from = "from-violet-500",
  to = "to-indigo-500",
  style,
}) {
  return (
    <span
      className={`ppros_ecom_filter-flex ppros_ecom_filter-h-11 ppros_ecom_filter-w-11 ppros_ecom_filter-shrink-0 ppros_ecom_filter-items-center ppros_ecom_filter-justify-center ppros_ecom_filter-rounded-full ppros_ecom_filter-bg-gradient-to-br ${from} ${to} ppros_ecom_filter-text-white ppros_ecom_filter-shadow-md`}
      style={style}
    >
      {children}
    </span>
  );
}

export function SectionLabel({
  icon,
  children,
  colorClass = "ppros_ecom_filter-text-violet-600",
  style,
}) {
  return (
    <p
      className={`ppros_ecom_filter-mb-2 ppros_ecom_filter-flex ppros_ecom_filter-items-center ppros_ecom_filter-gap-1.5 ppros_ecom_filter-text-xs ppros_ecom_filter-font-semibold ${colorClass}`}
      style={style}
    >
      {icon}
      {children}
    </p>
  );
}
