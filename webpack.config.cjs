const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babelOptions = {
  presets: [
    ["@babel/preset-env", { targets: "defaults" }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};

function postcssConfigForFile(resourcePath) {
  const normalized = resourcePath.split(path.sep).join("/");
  const isLibStyles =
    normalized.includes("/src/lib/") || normalized.endsWith("/admin/src/preview.css");

  if (isLibStyles) {
    return path.resolve(__dirname, "postcss.frontend.config.js");
  }

  return path.resolve(__dirname, "postcss.admin.config.js");
}

const cssPipeline = () => [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: (loaderContext) => ({
        config: postcssConfigForFile(loaderContext.resourcePath),
      }),
    },
  },
];

module.exports = [
  {
    name: "admin",
    entry: path.resolve(__dirname, "admin/src/main.jsx"),
    output: {
      path: path.resolve(__dirname, "assets/admin"),
      filename: "filter-orbit-admin.js",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@lib": path.resolve(__dirname, "src/lib/index.jsx"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader", options: babelOptions },
        },
        {
          test: /\.css$/,
          use: cssPipeline(),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "filter-orbit-admin.css" }),
    ],
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
    stats: "minimal",
  },
  {
    name: "frontend",
    entry: path.resolve(__dirname, "frontend/src/main.jsx"),
    output: {
      path: path.resolve(__dirname, "assets/frontend"),
      filename: "filter-orbit.js",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader", options: babelOptions },
        },
        {
          test: /\.css$/,
          use: cssPipeline(),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "filter-orbit.css" }),
    ],
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    devtool: process.env.NODE_ENV === "development" ? "source-map" : false,
    stats: "minimal",
  },
];
