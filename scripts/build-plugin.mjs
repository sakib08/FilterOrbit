/**
 * build-plugin.mjs
 *
 * Creates a distributable WordPress plugin zip.
 *
 * Usage:
 *   npm run build:plugin          — compile + zip
 *   npm run build:plugin -- --skip-build   — zip only (assets already compiled)
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PLUGIN_SLUG = "filterorbit-product-filters";
const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const OUT_DIR = path.join(ROOT, "build");
const PLUGIN_DIR = path.join(OUT_DIR, PLUGIN_SLUG);
const ZIP_FILE = path.join(OUT_DIR, `${PLUGIN_SLUG}-${version}.zip`);

/* ── Files/dirs excluded from the zip (mirrors .distignore) ─────────────── */
const EXCLUDE = new Set([
  ".git",
  ".gitignore",
  ".distignore",
  ".github",
  "node_modules",
  "src",
  "admin/src",
  "frontend/src",
  "build",
  "scripts",
  "demo",
  "dist",
  "REVIEW-REPLY.txt",
  "README.md",
  "package.json",
  "package-lock.json",
]);

const EXCLUDE_EXTENSIONS = new Set([
  ".config.cjs",
  ".config.js",
  ".config.ts",
]);

function isExcluded(relPath) {
  const parts = relPath.split(path.sep);

  // top-level exact match
  if (EXCLUDE.has(parts[0])) return true;

  // nested path prefix match (e.g. admin/src/*)
  for (const ex of EXCLUDE) {
    if (ex.includes("/") && relPath.startsWith(ex.split("/").join(path.sep))) {
      return true;
    }
  }

  // extension patterns (e.g. webpack.config.cjs)
  const base = path.basename(relPath);
  for (const ext of EXCLUDE_EXTENSIONS) {
    if (base.endsWith(ext)) return true;
  }

  return false;
}

/* ── Recursive copy ──────────────────────────────────────────────────────── */
function copyDir(src, dest, baseRel = "") {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = baseRel ? path.join(baseRel, entry.name) : entry.name;

    if (isExcluded(relPath)) continue;

    // Skip legacy bootstrap file if present in the dev tree.
    if (entry.name === "filter-orbit.php") continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath, relPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/* ── Main ────────────────────────────────────────────────────────────────── */
const skipBuild = process.argv.includes("--skip-build");

console.log(`\n🔧  FilterOrbit Plugin Builder  v${version}\n`);

// 1. Compile assets
if (!skipBuild) {
  console.log("📦  Building assets…");
  execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
}

// 2. Clean build output
console.log("🗑   Cleaning previous build…");
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(PLUGIN_DIR, { recursive: true });

// 3. Copy distributable files
console.log(`📂  Copying files → build/${PLUGIN_SLUG}/`);
copyDir(ROOT, PLUGIN_DIR);

// 4. Zip
console.log(`🗜   Creating zip → build/${PLUGIN_SLUG}-${version}.zip`);
execSync(`zip -r "${ZIP_FILE}" "${PLUGIN_SLUG}"`, {
  cwd: OUT_DIR,
  stdio: "inherit",
});

// 5. Stats
const zipSizeKb = (fs.statSync(ZIP_FILE).size / 1024).toFixed(1);
console.log(`\n✅  Done!  ${PLUGIN_SLUG}-${version}.zip  (${zipSizeKb} KB)\n`);
console.log(`   Upload path: ${ZIP_FILE}\n`);
