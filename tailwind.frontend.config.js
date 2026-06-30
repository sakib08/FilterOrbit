/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
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
