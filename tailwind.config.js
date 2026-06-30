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
        ppros: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
