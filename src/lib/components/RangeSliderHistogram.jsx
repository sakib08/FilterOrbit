import { useCallback, useEffect, useState } from "react";
import { getBarColorTheme } from "../utils/blockColors";

export function RangeSliderHistogram({
  label,
  unit = "USD",
  min,
  max,
  value,
  histogram,
  step = 1,
  formatValue,
  barColor = "#8b5cf6",
  onChange,
}) {
  const [local, setLocal] = useState(value);
  const barTheme = getBarColorTheme(barColor);

  useEffect(() => {
    setLocal(value);
  }, [value[0], value[1]]);

  const pct = (v) => ((v - min) / (max - min || 1)) * 100;
  const fmt = formatValue ?? ((n) => String(n));

  const emit = useCallback(
    (lo, hi) => {
      const a = Math.min(lo, hi);
      const b = Math.max(lo, hi);
      setLocal([a, b]);
      onChange(a, b);
    },
    [onChange]
  );

  const loPct = pct(local[0]);
  const hiPct = pct(local[1]);
  const rangeStyle = { "--range-accent": barTheme.hex };

  return (
    <div className="ppros_ecom_filter-py-1">
      <div className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-items-baseline ppros_ecom_filter-mb-3">
        <span className="ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold ppros_ecom_filter-text-slate-800">
          {label}
        </span>
        <span className="ppros_ecom_filter-text-[10px] ppros_ecom_filter-font-bold ppros_ecom_filter-tracking-widest ppros_ecom_filter-text-slate-500">
          {unit}
        </span>
      </div>

      <div className="ppros_ecom_filter-relative ppros_ecom_filter-mb-1 ppros_ecom_filter-h-14">
        <div className="ppros_ecom_filter-flex ppros_ecom_filter-h-full ppros_ecom_filter-items-end ppros_ecom_filter-gap-[3px]">
          {histogram.map((h, i) => {
            const binStart = min + ((max - min) / histogram.length) * i;
            const binEnd = min + ((max - min) / histogram.length) * (i + 1);
            const inRange = binEnd >= local[0] && binStart <= local[1];
            return (
              <div
                key={i}
                className="ppros_ecom_filter-flex-1 ppros_ecom_filter-rounded-t-md ppros_ecom_filter-min-h-[4px] ppros_ecom_filter-transition-colors"
                style={{
                  height: `${Math.max(12, h * 100)}%`,
                  backgroundColor: inRange ? barTheme.active : barTheme.inactive,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="ppros_ecom_filter-relative ppros_ecom_filter-h-8">
        <div className="ppros_ecom_filter-absolute ppros_ecom_filter-inset-x-0 ppros_ecom_filter-top-3 ppros_ecom_filter-h-1.5 ppros_ecom_filter-rounded-full ppros_ecom_filter-bg-gray-200">
          <div
            className="ppros_ecom_filter-absolute ppros_ecom_filter-h-full ppros_ecom_filter-rounded-full"
            style={{
              left: `${loPct}%`,
              width: `${hiPct - loPct}%`,
              backgroundColor: barTheme.active,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[0]}
          onChange={(e) => emit(Number(e.target.value), local[1])}
          className="ppros_ecom_filter-range-input ppros_ecom_filter-range-input-themed ppros_ecom_filter-z-10"
          style={rangeStyle}
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[1]}
          onChange={(e) => emit(local[0], Number(e.target.value))}
          className="ppros_ecom_filter-range-input ppros_ecom_filter-range-input-themed ppros_ecom_filter-z-20"
          style={rangeStyle}
          aria-label={`${label} maximum`}
        />
      </div>

      <div
        className="ppros_ecom_filter-flex ppros_ecom_filter-justify-between ppros_ecom_filter-mt-1 ppros_ecom_filter-text-sm ppros_ecom_filter-font-semibold"
        style={{ color: barTheme.text }}
      >
        <span>{fmt(local[0])}</span>
        <span>{fmt(local[1])}</span>
      </div>
    </div>
  );
}
