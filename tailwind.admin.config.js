/** @type {import('tailwindcss').Config} */
export default {
  content: ["./admin/src/**/*.{js,jsx,ts,tsx}"],
  prefix: "fo-",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
    },
  },
};
