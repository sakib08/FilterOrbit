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
