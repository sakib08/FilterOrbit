/** Demo-only Tailwind config — no prefix so App.jsx utilities work */
export default {
  content: [
    "./demo/**/*.{js,jsx,ts,tsx}",
    "./src/lib/components/VendorFilter.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
