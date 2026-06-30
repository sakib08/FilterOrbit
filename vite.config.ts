import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  if (mode === "library") {
    return {
      plugins: [
        react(),
        dts({
          include: ["src/lib"],
          outDir: "dist",
          rollupTypes: true,
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, "src/lib/index.ts"),
          name: "PprosEcomFilter",
          fileName: "ppros-ecom-filter",
          formats: ["es", "umd"],
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
            },
          },
        },
        cssCodeSplit: false,
      },
    };
  }

  return {
    plugins: [react()],
    root: "demo",
    resolve: {
      alias: {
        "ppros-ecom-filter": resolve(__dirname, "src/lib/index.ts"),
      },
    },
  };
});
