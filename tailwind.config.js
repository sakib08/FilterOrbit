/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./demo/**/*.{js,ts,jsx,tsx}",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "ppros_ecom_filter-",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "var(--font-display)", "system-ui", "sans-serif"],
        sans: ["DM Sans", "var(--font-sans)", "system-ui", "sans-serif"],
        ppros: ["DM Sans", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["0.625rem", { lineHeight: "1rem" }],
        "section-label": ["0.7rem", { lineHeight: "1rem", letterSpacing: "0.1em" }],
      },
      colors: {
        cream: {
          DEFAULT: "#F9F8F6",
          dark: "#F3F1ED",
        },
        accent: {
          DEFAULT: "#7C3AED",
          light: "#8B5CF6",
          muted: "#EDE9FE",
        },
        coral: {
          DEFAULT: "#F4717F",
          dark: "#E85D6F",
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 24px rgba(15, 23, 42, 0.1)",
      },
      transitionDuration: {
        500: "500ms",
      },
    },
  },
};
