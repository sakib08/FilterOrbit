import type { FilterState, Product } from "../types";

const RULES: { pattern: RegExp; apply: (m: RegExpMatchArray) => Partial<FilterState> }[] = [
  {
    pattern: /under\s*\$?(\d+)/i,
    apply: (m) => ({ price: [0, Number(m[1])] }),
  },
  {
    pattern: /over\s*\$?(\d+)/i,
    apply: (m) => ({ price: [Number(m[1]), 99999] }),
  },
  {
    pattern: /between\s*\$?(\d+)\s*and\s*\$?(\d+)/i,
    apply: (m) => ({
      price: [Number(m[1]), Number(m[2])],
    }),
  },
  {
    pattern: /brand\s+(?:is\s+)?["']?(\w+)["']?/i,
    apply: (m) => ({ brand: [m[1]!] }),
  },
  {
    pattern: /(cordless|electric|gas|battery)/i,
    apply: (m) => ({ powerSource: [m[1]!.toLowerCase()] }),
  },
  {
    pattern: /(wooden|metal|modern|industrial)/i,
    apply: (m) => ({ style: [m[1]!.toLowerCase()] }),
  },
  {
    pattern: /(blue|red|black|white|green|wood)/i,
    apply: (m) => ({ color: [m[1]!.toLowerCase()] }),
  },
  {
    pattern: /(power tools?|gardening|watches?|furniture)/i,
    apply: (m) => ({ category: [m[1]!.toLowerCase().replace(/\s/g, " ").trim()] }),
  },
];

export function parseNaturalLanguageLocally(
  query: string,
  products: Product[]
): FilterState {
  const state: FilterState = {};
  const q = query.trim();
  if (!q) return state;

  for (const rule of RULES) {
    const m = q.match(rule.pattern);
    if (m) {
      Object.assign(state, rule.apply(m));
    }
  }

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  for (const brand of brands) {
    if (q.toLowerCase().includes(String(brand).toLowerCase())) {
      state.brand = [String(brand)];
      break;
    }
  }

  return state;
}
