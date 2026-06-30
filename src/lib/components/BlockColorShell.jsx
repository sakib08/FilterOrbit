import { getBlockColorTheme, normalizeHexColor } from "../utils/blockColors";

export function BlockColorShell({ color, children, className = "", fallback = "#8b5cf6" }) {
  const theme = getBlockColorTheme(color, fallback);

  return (
    <div
      className={`filter-orbit-block-shell ppros_ecom_filter-rounded-2xl ppros_ecom_filter-border ppros_ecom_filter-p-1 ${className}`.trim()}
      style={{
        borderColor: theme.border,
        backgroundColor: theme.background,
      }}
    >
      {children}
    </div>
  );
}

export { normalizeHexColor, getBlockColorTheme, getDefaultBlockColor, getDefaultFilterColor } from "../utils/blockColors";
