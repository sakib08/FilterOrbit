/** Demo-only Tailwind config — no prefix so App.jsx utilities work */
export default {
  content: [
    "./demo/**/*.{js,jsx,ts,tsx}",
    "./src/lib/components/VendorFilter.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "var(--font-display)", "system-ui", "sans-serif"],
        sans: ["DM Sans", "var(--font-sans)", "system-ui", "sans-serif"],
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
    },
  },
};
